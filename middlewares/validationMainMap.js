const Joi = require('joi');

const schemasOfMainMap = Joi.object({
  userId: Joi.number().min(0).required(),
  x: Joi.string().required(),
  y: Joi.string().required(),
});

module.exports = schemasOfMainMap;
