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
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)
    .required(),
  maleYN: Joi.number().integer().required(),
  mbtiId: Joi.number().integer().required(),
});

const validationUser = async (req, res, next) => {
  const { email, nickname, password, maleYN, mbtiId } = req.body;
  try {
    await Schema.validateAsync({
      email,
      nickname,
      password,
      maleYN,
      mbtiId,
    });
    req.user = { email, nickname, password, maleYN, mbtiId };
    return next();
  } catch (error) {
    const { message } = error;
    return next(customizedError(message, 400));
  }
};

module.exports = validationUser;
