const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, deleteArticleById, createArticle } = require('../controllers/articles.js');

router.get('/', getArticles);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
}), deleteArticleById);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(100),
    text: Joi.string().required().min(2).max(200),
    date: Joi.string().required().min(2).max(30),
    source: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/).required().min(2),
    image: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/).required().min(2),
  }),
}), createArticle);

module.exports = router;
