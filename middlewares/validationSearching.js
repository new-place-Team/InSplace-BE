const Joi = require('joi');

const schemasOfResultPageofCondition = Joi.object({
  userId: Joi.number().required(),
  weather: Joi.number().min(1).max(3).required(),
  category: Joi.number().min(1).max(5).required(),
  num: Joi.number().min(1).max(4).required(),
  gender: Joi.number().min(1).max(3).required(),
});

const schemasOfDetailPageOfInOutDoors = Joi.object({
  userId: Joi.number().required(),
  weather: Joi.number().min(1).max(3).required(),
  category: Joi.number().min(1).max(5).required(),
  num: Joi.number().min(1).max(4).required(),
  gender: Joi.number().min(1).max(3).required(),
  inside: Joi.number().min(0).max(1).required(),
  pageNum: Joi.number().min(1).required(),
});

const schemasOfResultPageofTotal = Joi.object({
  userId: Joi.number().required(),
  result: Joi.string().min(1).required(),
  pageNum: Joi.number().min(1).required(),
});

module.exports = {
  schemasOfResultPageofCondition,
  schemasOfDetailPageOfInOutDoors,
  schemasOfResultPageofTotal,
};
