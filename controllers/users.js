const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserCollection = require('../models/user.js');

// конструкторы ошибок
const ReqErr = require('../errors/req-err');
const NewErr = require('../errors/new-err');

module.exports.getUserByConditions = (req, res, next) => {
  const { email, name } = req.body;

  UserCollection.findOne({ email, name }).orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { password } = req.body;
  if (!password || password.length < 8 || /\s/.test(password)) {
    throw new ReqErr('Некорректный пароль. Пароль отсутствует или его длина меньше 8 символов');
  }
  bcrypt.hash(password, 10)
    .then((hash) => {
      const { name, email } = req.body;
      return UserCollection.create({ name, email, password: hash });
    })
    .then((user) => {
      const { name, email, _id } = user;
      res.send({ data: { name, email, _id } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        if (err.errors.email && err.errors.email.kind === 'unique') {
          next(new NewErr('Переданы некорректные данные', 409));
        } else {
          next(new ReqErr('Переданы некорректные данные'));
        }
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return UserCollection.findUserByCredentials(email, password) // кастомный метод
    .then((user) => {
      if (!JWT_SECRET && NODE_ENV !== 'development') {
        // eslint-disable-next-line no-console
        console.log('JWT_SECRET not find');
        next(new NewErr('На сервере произошла ошибка', 500));
        return;
      }
      // создание токена
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).end();
    })
    .catch(next);// ошибка 401 обрабатывается в модели
};
