const Joi = require('Joi');

const schemas = Joi.object({
  userId: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
});

const registSchemas = Joi.object({
  email: Joi.number().min(1).required(),
  nickname: Joi.number().min(1).required(),
  password: Joi.number().min(1).required(),
  male_yn: Joi.number().min(1).required(),
  mbti_id: Joi.number().min(1).required(),
});

module.exports = { schemas, registSchemas };
