var User = require('./userModel.js');
var  Q = require('q');
var  jwt = require('jwt-simple');

// Promisify a few mongoose methods with the `q` promise library
var findUser = Q.nbind(User.findOne, User);
var findUsers = Q.nbind(User.find, User);
var createUser = Q.nbind(User.create, User);

var applyToUser = function (user, success, failure, next) {
  if (typeof(user) === 'string') {
    user = {username: user};
  }
  return findUser(user)
    .then(function (user) {
      if (!user) {
        if (failure) {
          failure();
        }
        next();
      } else {
        var updatedUser = success(user)
        if (updatedUser) {
          return updatedUser;
        } else {
          return user;
        }
      }
    });
};

var updatePartnersMiles = function (username, next) {
  var newMilage = {};
  return applyToUser(username, function(user) {
    var milagePromises = user.ridingGroup.map(function(partner) {
      return findUser({username: partner.username})
      .then(function(dbPartner) {
        newMilage[partner.username] = dbPartner.totalMiles - partner.startMiles;
        return newMilage;
      });
    });

    if (milagePromises.length) {
      return milagePromises[milagePromises.length-1]
      .then(function(milages) {
        return user.updatePartnersMiles(milages)
        .then(function(user) {
          return user;
        })
      });
    } else {
      return user;
    }
  }, null, next);
};

module.exports = {
  addRidingPartner: function(req, res, next) {
    applyToUser(req.body.newRider,
      function (partner) {
        applyToUser(req.body.user.username,
          function (currentUser) {
            currentUser.addRidingPartner({
              username: partner.username,
              startMiles: partner.totalMiles,
              milesSince: 0
            })
            .then(function (user) {
              res.json(user);
            });
          }, null, next);
      }, null, next);
  },

  addMiles: function (req, res, next) {
    applyToUser(req.body.user,
      function (user) {
        user.addMiles(req.body.miles)
      }, null, next)
    .then(function(user) {
      res.json(user);
    });
  },

  getUser: function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      applyToUser(user.username,
        function (user) {
          updatePartnersMiles(user.username, next)
          .then(function(user) {
            res.json(user);
          });
        },
        function (user) { res.sendStatus(401); },
        next);
    }
  },

  setUser: function (req, res, next) {
    applyToUser(req.body.user,
      function (user) {
        user.updateInfo(req.body.newInfo)
        .then(function(user) {
          res.json(user);
        });
      }, null, next);
  },


  signin: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    findUser({username: username})
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function (foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({token: token});
              } else {
                return next(new Error('No user'));
              }
            });
        }
      })
      .fail(function (error) {
        next(error);
      });
  },

  signup: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var weeklyMilageGoal = req.body.weeklyMilageGoal;

    // check to see if user already exists
    findUser({username: username})
      .then(function (user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          // make a new user if not one
          return createUser({
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            weeklyMilageGoal: weeklyMilageGoal
          });
        }
      })
      .then(function (user) {
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function (error) {
        next(error);
      });
  },

  checkAuth: function (req, res, next) {
    // checking to see if the user is authenticated
    // grab the token in the header is any
    // then decode the token, which we end up being the user object
    // check to see if that user exists in the database
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'secret');
      findUser({username: user.username})
        .then(function (foundUser) {
          if (foundUser) {
            res.send(200);
          } else {
            res.send(401);
          }
        })
        .fail(function (error) {
          next(error);
        });
    }
  }
};
