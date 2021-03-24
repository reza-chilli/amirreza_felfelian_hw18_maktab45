const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  username : {
    type : String,
    required : true,
    unique : true,
    minlength : 3,
    maxlength : 20,
    trim : true
  },
  password : {
    type : String,
    required : true,
    minlength : 8,
    maxlength : 30,
    trim : true
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
})

userSchema.pre('save', function(next) {
  const user = this;
  if (this.isNew || this.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        return next();
      });
  });
  } else {
    return next();
  }
})

module.exports = mongoose.model('User', userSchema);