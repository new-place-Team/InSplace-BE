const { pool } = require('../models/index');
require('dotenv').config();
const customizedError = require('./error');
const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);
const schemasOfFeedback = require('../middlewares/validationFeedback');
const logger = require('../config/logger');
/* 피드백 슬랙에 보내는 함수 */
const sendMsgToSlack = async (userId, phoneNumber, description) => {
  // Send the notification
  await webhook.send({
    text: `
    유저 아이디: ${userId} \n 핸드폰 번호: ${phoneNumber} \n 피드백 내용: ${description} \n
    `,
  });
};

/* Feedback 추가하는 쿼리문 */
const queryOfAddingFeedback = (userId, phoneNumber, description) => {
  return `
        INSERT INTO
        Feedbacks(user_id, phone_number,description) 
        VALUES(${userId}, '${phoneNumber}', '${description}');    
        `;
};

/* 피드백 추가 */
const addFeedback = async (req, res, next) => {
  console.log('asdasdasad');
  const userId = req.user;
  const { phoneNumber, description } = req.body;
  /* 유효성 검사*/
  try {
    await schemasOfFeedback.validateAsync({
      userId,
      phoneNumber,
      description,
    });
  } catch (err) {
    logger.error('피드백 추가 중 유효성 검사에서 발생한 에러: ', err);
    return next(customizedError(err, 400));
  }

  /* 피드백 슬랙에 보내기 */
  await sendMsgToSlack(userId, phoneNumber, description);

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    /* 피드백 등록 */
    const [result] = await connection.query(
      queryOfAddingFeedback(userId, description)
    );
    /* 추가 되지 않은 경우 */
    if (result.affectedRows === 0) {
      return next(customizedError('유저 피드백이 추가 되지 않았습니다.', 400));
    }

    return res.sendStatus(201);
  } catch (err) {
    /* 피드백 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

module.exports = addFeedback;
