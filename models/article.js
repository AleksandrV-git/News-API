const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  date: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  source: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator: (v) => isURL(v),
      message: 'error',
    },
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => isURL(v),
      message: 'error',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('articleCollection', articleSchema);
