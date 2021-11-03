const Joi = require('joi');

const schemasOfRegistingReview = Joi.object({
  userId: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
  reviewImages: Joi.string().allow('').max(255).required(),
  reviewDesc: Joi.string(),
  weekdayYN: Joi.number().min(0).max(1).required(),
  revisitYN: Joi.number().min(0).max(1).required(),
});

const schemasOfModifyingReview = Joi.object({
  reviewId: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
  userId: Joi.number().min(1).required(),
  reviewImages: Joi.string().allow('').max(255).required(),
  reviewDesc: Joi.string(),
  weekdayYN: Joi.number().min(0).max(1).required(),
  revisitYN: Joi.number().min(0).max(1).required(),
});

module.exports = {
  schemasOfRegistingReview,
  schemasOfModifyingReview,
};
