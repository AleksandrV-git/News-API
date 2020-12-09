require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const routeArticles = require('./routes/article.js');
const routeUsers = require('./routes/users.js');
const { createUser, login } = require('./controllers/users.js');
const auth = require('./middlewares/auth.js');

const NotFoundErr = require('./errors/not-found-err');

const { PORT = 3000, DATABASE_URL = 'mongodb://localhost:27017/news-explorer-db' } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(cors({
  credentials: true,
  origin: 'http://localhost:8080',
  allowedHeaders: 'API-Key,Content-Type,If-Modified-Since,Cache-Control',
  optionsSuccessStatus: 200,
}));
app.use(limiter);
//app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// подключение базы данных
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(30),
  }),
}), createUser);

// Защита роутов авторизацией
app.use(celebrate({
  headers: Joi.object().keys({
    cookies: Joi.object().keys({
      jwt: Joi.string().token().required(),
    }),
  }).unknown(true),
}), auth);

app.use('/users', routeUsers);
app.use('/articles', routeArticles);
app.use((req, res, next) => {
  next(new NotFoundErr('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors()); // подключение обрабочика ошибок Celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  // выставляем сообщение в зависимости от статуса
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT);
