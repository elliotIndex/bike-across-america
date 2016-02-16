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
        next(new Error('User already exist!'));
      } else {
        success(user)
        return user;
      }
    });
};

module.exports = {
  // addRidingPartner: function(req, res, next) {
  //   applyToUser(req.body.newRider,
  //     function (partner) {
  //       applyToUser(user.username,
  //         function (currentUser) {
  //
  //         }, null, next);
  //     }, null, next);
  // }
  addRidingPartner: function (req, res, next) {
    findUsers({$or: [
      req.body.user,
      { username: req.body.newRider }
    ]})
      .then(function (users) {
        if (users.length < 2) {
          next(new Error('Rider does not exist'));
        } else {
          users.forEach(function(user) {
            if (user.username === req.body.user.username) {
              user.addRidingPartner(req.body.newRider) //users[0] may not always work
              .then(function(users) {
                res.json(users);
              });
            }
          });
        }
      })
      .fail(function (error) {
        next(error);
      });
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
        function (user) { res.json(user); },
        function (user) { res.sendStatus(401); },
        next);
    }
  },

  setUser: function (req, res, next) {
    findUser(req.body.user)
      .then(function (user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          user.updateInfo(req.body.newInfo)
          .then(function(user) {
            res.json(user);
          });
        }
      })
      .fail(function (error) {
        next(error);
      });
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
