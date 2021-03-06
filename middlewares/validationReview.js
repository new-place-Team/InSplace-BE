const Joi = require('joi');

const schemasOfRegistingReview = Joi.object({
  userId: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
  reviewImages: Joi.string().allow('').max(255).required(),
  reviewDesc: Joi.string(),
  weekdayYN: Joi.number().min(0).max(1).required(),
  revisitYN: Joi.number().min(0).max(1).required(),
  weather: Joi.number().min(1).max(5).required(),
});

const schemasOfModifyingReview = Joi.object({
  reviewId: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
  userId: Joi.number().min(1).required(),
  reviewImages: Joi.string().allow('').max(255).required(),
  reviewDesc: Joi.string(),
  weekdayYN: Joi.number().min(0).max(1).required(),
  revisitYN: Joi.number().min(0).max(1).required(),
  weather: Joi.number().min(1).max(5).required(),
});

const schemasOfReviewLike = Joi.object({
  userId: Joi.number().min(1).required(),
  reviewId: Joi.number().min(1).required(),
});

const schemasOfGettingReviews = Joi.object({
  userId: Joi.number().required(),
  pageNum: Joi.number().min(1).required(),
  postId: Joi.number().min(1).required(),
});
module.exports = {
  schemasOfRegistingReview,
  schemasOfModifyingReview,
  schemasOfReviewLike,
  schemasOfGettingReviews,
};
