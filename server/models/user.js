const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');


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
  var token = jwt.sign({_id: this._id.toHexString(), access}, 'abc123').toString();
  this.tokens.push({access, token})

  return this.save().then(() => {
    return token
  });
}

userSchema.methods.toJSON = function () {
  var userObject = this.toObject();
  return _.pick(userObject, ['_id', 'email'])
}

var User = mongoose.model('User', userSchema);

module.exports = {User};
