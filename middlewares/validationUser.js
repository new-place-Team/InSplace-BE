const Joi = require('joi');
const customizedError = require('../controllers/error');
const logger = require('../config/logger');
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
  maleYN: Joi.number().min(0).max(1).allow(null),
  mbtiId: Joi.number().integer().required(),
});

const validationUser = async (req, res, next) => {
  const { email, nickname, password, maleYN, mbtiId } = req.body;
  const lang = req.headers['language'];
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
  } catch (err) {
    const errMsg =
      lang === 'ko' || lang === undefined
        ? '비밀번호는 영어와 숫자로 8자 이상 16자 이하로 작성해주세요.'
        : 'Please write the password in English and numbers, not less than 8 characters and not more than 16 characters.';
    logger.info(`${errMsg} : ${err}`);
    return next(customizedError(errMsg, 400));
  }
};

module.exports = validationUser;
