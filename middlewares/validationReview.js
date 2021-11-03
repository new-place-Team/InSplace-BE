const Joi = require('joi');

const schemas = Joi.object({
  userId: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
  reviewImages: Joi.string().allow('').max(255),
  reviewDesc: Joi.string(),
  weekdayYN: Joi.number().min(0).max(1).required(),
  revisitYN: Joi.number().min(0).max(1).required(),
});

module.exports = schemas;
