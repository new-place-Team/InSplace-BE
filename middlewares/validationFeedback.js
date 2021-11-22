const Joi = require('joi');

const schemasOfFeedback = Joi.object({
  userId: Joi.number().min(1).required(),
  phoneNumber: Joi.string()
    .length(13)
    .pattern(/^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/)
    .required(),
  description: Joi.string().required(),
});

module.exports = schemasOfFeedback;
