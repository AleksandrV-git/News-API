const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserByConditions } = require('../controllers/users.js');

router.get('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), getUserByConditions);

module.exports = router;
