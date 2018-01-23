const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
      type: String,
      required: true,
      minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }]
}, {usePushEach: true})

userSchema.methods.generateAuthToken = function () {
  var access = 'auth';
  var token = jwt.sign({_id: this._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  this.tokens.push({access, token})

  return this.save().then(() => {
    return token
  });
}

userSchema.methods.toJSON = function () {
  var userObject = this.toObject();
  return _.pick(userObject, ['_id', 'email'])
}

userSchema.methods.removeToken = function (token) {
  return this.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
}
// statics apply to model not instance of model
userSchema.statics.findByToken = function (token) {
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  }catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            next()
        });
      });
  }else {
    next()
  }
});

userSchema.statics.findByCredentails = function (email, password) {
  return this.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return resolve(user);
        }else {
          return reject()
        }
      });
    })
  });
};

var User = mongoose.model('User', userSchema);

module.exports = {User};
