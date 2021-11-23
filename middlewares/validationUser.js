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
  maleYN: Joi.number().min(0).max(1).allow(null),
  mbtiId: Joi.number().integer().required(),
});

const validationUser = async (req, res, next) => {
  const lang = req.headers['language'];
  const { email, nickname, password, maleYN, mbtiId } = req.body;
  let errMsg = '';
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
    if (message.includes('fails to match')) {
      errMsg =
        lang === 'kr' || lang === undefined
          ? '비밀번호는 영어와 숫자의 조합으로 8자 이상 16자 이하로 작성해주세요.'
          : 'Please write the password in English and Numbers, not less than 8 characters and not more than 16 characters.';

      return next(customizedError(errMsg, 400));
    }
    if (message.includes('email')) {
      errMsg =
        lang === 'kr' || lang === undefined
          ? '이메일 양식으로 입력해 주세요.'
          : 'Please fill in the email form.';
      return next(customizedError(errMsg, 400));
    }
    if (message.includes('nickname')) {
      errMsg =
        lang === 'kr' || lang === undefined
          ? '닉네임은 2자 이상 12자 이하로 작성해 주세요.'
          : 'Please write your nickname with at least 2 characters and no more than 12 characters.';
      return next(customizedError(errMsg, 400));
    }

    return next(customizedError(message, 400));
  }
};

module.exports = validationUser;
