const articleCollection = require('../models/article.js');

// конструкторы ошибок
const ReqErr = require('../errors/req-err');
const NewErr = require('../errors/new-err');
const NotFoundErr = require('../errors/not-found-err');

module.exports.getArticles = (req, res, next) => {
  articleCollection.find({}).orFail(new NotFoundErr('статьи не найдены'))
    .then((article) => res.send({ data: article }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const ownerId = req.user._id;

  articleCollection.create({
    keyword, title, text, date, source, link, image, owner: ownerId,
  })
    .then((article) => res.send({ data: article }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ReqErr('Переданны некорректные данные'));
      } else { next(err); }
    });
};

module.exports.deleteArticleById = (req, res, next) => {
  articleCollection.findById(req.params.articleId).orFail(new NotFoundErr('Запршиваемая статья не найдена'))
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        throw new NewErr('Вы не можете удалять карточки других пользователей', 403);
      }
      articleCollection.remove().then((removedArticle) => res.send(removedArticle));
    })
    .catch(next);
};
