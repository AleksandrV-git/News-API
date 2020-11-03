const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

// конструкторы ошибок
const AuthErr = require('../errors/auth-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.plugin(uniqueValidator, { message: 'Error, expected value to be unique.' });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthErr('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthErr('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('userCollection', userSchema);
