var Q = require('q');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var AMERICA_WIDTH = 2680; // miles

var UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: String,

  firstName: { type: String, default: "Lance" },
  lastName: { type: String, default: "Armstrong" },
  totalMiles: { type: Number, default: 0 },
  americaCrossings: { type: Number, default: 0 },
  weeklyMilageGoal: { type: Number, default: 50 },
});

UserSchema.methods.addMiles = function (miles) {
  var user = this;
  return Q.Promise(function (resolve, reject) {
    user.totalMiles += miles;
    user.americaCrossings = Math.floor(user.totalMiles / AMERICA_WIDTH);
    user.save( function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  })
};

UserSchema.methods.comparePasswords = function (candidatePassword) {
  var savedPassword = this.password;
  return Q.Promise(function (resolve, reject) {
    bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
