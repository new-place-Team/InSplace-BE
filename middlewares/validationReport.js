const Joi = require('joi');

const schemasOfReport = Joi.object({
  fromUserId: Joi.number().min(1).required(),
  toUserId: Joi.number().min(1).required(),
  reviewId: Joi.number().min(1).required(),
  description: Joi.string(),
  categoryNum: Joi.number().min(1).required(),
});

module.exports = schemasOfReport;
