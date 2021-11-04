const Joi = require('joi');
const customizedError = require('../controllers/error');
const Schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  nickname: Joi.string().min(2).max(12).required(),
  mbtiId: Joi.number().integer().required(),
});

const validationModifyUser = async (req, res, next) => {
  const { email, nickname, mbtiId } = req.body;
  try {
    await Schema.validateAsync({
      email,
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
