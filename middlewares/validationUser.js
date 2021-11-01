const Joi = require('joi');

const Schema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  nickname: Joi.string().required(),
  password: Joi.string().min(4).required(),
  male_yn: Joi.number().integer().required(),
  mbti_id: Joi.number().integer().required(),
});

const validationUser = async (req, res, next) => {
  const { email, nickname, password, male_yn, mbti_id } = req.body;
  console.log(male_yn, mbti_id);
  try {
    await Schema.validateAsync({
      email,
      nickname,
      password,
      male_yn,
      mbti_id,
    });
    req.user = { email, nickname, password, male_yn, mbti_id };
    next();
  } catch (error) {
    const { message } = error;
    console.log(message);
    let payload = {
      success: false,
    };
    if (message == '"email" must be a valid email') {
      payload.errMsg = '이메일 형식으로 작성해주세요';
      res.status(400).json({ payload });
    }
    if (message == '"password" length must be at least 4 characters long') {
      payload.errMsg = '비밀번호는 최소 4자 이상으로 작성해 주세요';
      res.status(400).json({
        payload,
      });
    }
  }
};

module.exports = validationUser;
