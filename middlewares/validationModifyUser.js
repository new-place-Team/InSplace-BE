const Joi = require('joi');
const customizedError = require('../controllers/error');
const Schema = Joi.object({
  nickname: Joi.string().min(2).max(12).required(),
  mbtiId: Joi.number().integer().required(),
});

const validationModifyUser = async (req, res, next) => {
  const { nickname, mbtiId } = req.body;
  try {
    await Schema.validateAsync({
      nickname,
      mbtiId,
    });
    return next();
  } catch (error) {
    const { message } = error;
    return next(customizedError(message, 400));
  }
};

module.exports = validationModifyUser;
