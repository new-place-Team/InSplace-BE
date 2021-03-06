const Joi = require('joi');

const schemas = Joi.object({
  userId: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
});

module.exports = schemas;
