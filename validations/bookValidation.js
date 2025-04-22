const Joi = require("joi");

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.number().integer().required(),
  genre: Joi.string().required(),
});

module.exports = { bookSchema };
