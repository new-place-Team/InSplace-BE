const Joi = require('joi');
const customizedError = require('../controllers/error');
const Schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  nickname: Joi.string().required(),
  password: Joi.string().min(4).required(),
  maleYn: Joi.number().integer().required(),
  mbtiId: Joi.number().integer().required(),
});

const validationUser = async (req, res, next) => {
  const { email, nickname, password, maleYn, mbtiId } = req.body;
  try {
    await Schema.validateAsync({
      email,
      nickname,
      password,
      maleYn,
      mbtiId,
    });
    req.user = { email, nickname, password, maleYn, mbtiId };
    return next();
  } catch (error) {
    const { message } = error;
    return next(customizedError(message, 400));
  }
};

module.exports = validationUser;
