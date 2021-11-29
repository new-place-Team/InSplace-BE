const { pool } = require('../models/index');
require('dotenv').config();
const customizedError = require('./error');
const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);
const schemasOfFeedback = require('../middlewares/validationFeedback');
const logger = require('../config/logger');

/* 피드백 슬랙에 보내는 함수 */
const sendMsgToSlack = async (userId, nickname, phoneNumber, description) => {
  // Send the notification
  await webhook.send({
    text: `
      유저 아이디: ${userId}\n유저 이름: ${nickname}\n핸드폰 번호: ${phoneNumber}\n피드백 내용: ${description}\n
    `,
  });
};

/* Feedback 추가하는 쿼리문 */
const queryOfAddingFeedback = (userId, nickname, phoneNumber, description) => {
  return `
        INSERT INTO
        Feedbacks(user_id, nickname, phone_number, description) 
        VALUES(${userId}, '${nickname}' ,'${phoneNumber}', '${description}');    
        `;
};

const convertDescription = (description) => {
  let result = description.replace(/\"/gi, '');
  return result.replace('"', '');
};
/* 피드백 추가 */
const addFeedback = async (req, res, next) => {
  const lang = req.headers['language'];
  let errMsg = '';
  const userId = req.user;
  let { phoneNumber, description } = req.body;
  description = convertDescription(description);
  /* 유효성 검사*/
  try {
    await schemasOfFeedback.validateAsync({
      userId,
      phoneNumber,
      description,
    });
  } catch (err) {
    errMsg =
      lang === 'ko' || lang === undefined
        ? '잘못된 형식입니다.'
        : 'Invalid format.';
    logger.error(`${errMsg} : ${err}`);
    return next(customizedError(errMsg, 400));
  }

  /* 피드백 슬랙에 보내기 */
  /* 유저 닉네임 가져오기 */
  let [[nickname]] = await pool.query(
    `SELECT nickname FROM Users WHERE user_id=${userId}`
  );
  nickname = nickname.nickname;
  await sendMsgToSlack(userId, nickname, phoneNumber, description);
  try {
    /* 피드백 등록 */
    const [result] = await pool.query(
      queryOfAddingFeedback(userId, nickname, phoneNumber, description)
    );

    /* 피드백이 등록 되지 않은 경우 */
    if (result.affectedRows === 0) {
      errMsg =
        lang === 'ko' || lang === undefined
          ? '유저 피드백이 등록 되지 않았습니다.'
          : 'User feedback is not registered.';
      logger.error(`${errMsg}`);
      return next(customizedError(errMsg, 400));
    }
    return res.sendStatus(201);
  } catch (err) {
    /* 피드백 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    errMsg = 'Func: addFeedback 에서 internal server error 발생';
    logger.error(`${errMsg} : ${err}`);
    return next(customizedError(errMsg, 500));
  }
};

module.exports = addFeedback;
