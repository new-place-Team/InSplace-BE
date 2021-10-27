const Joi = require('joi');

const Schema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  nickname: Joi.string(),
  password: Joi.string().min(4),
});

const validationUser = async (req, res, next) => {
  const { email, nickname, password } = req.body;

  try {
    await Schema.validateAsync({
      email,
      nickname,
      password,
    });
    req.user = { email, nickname, password };
    next();
  } catch (error) {
    const { message } = error;
    let payload = {
      success: false,
    };
    if (message == '"email" must be a valid email') {
      payload.errMsg = '이메일 형식으로 작성해주세요';
      res.status(200).json({ payload });
    }
    if (message == '"password" length must be at least 4 characters long') {
      payload.errMsg = '비밀번호는 최소 4자 이상으로 작성해 주세요';
      res.status(200).json({
        payload,
      });
    }
  }
};

module.exports = validationUser;
