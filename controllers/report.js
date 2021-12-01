const { pool } = require('../models/index');
const customizedError = require('./error');
const schemasOfReport = require('../middlewares/validationReport');
const {
  queryOfAddingReport,
  addReportUser,
  FindReportUser,
} = require('../query/report');
const logger = require('../config/logger');

/* 신고한 내용 DB에 추가 */
const addReport = async (req, res, next) => {
  const { toUserId, categoryNum, description } = req.body;
  const lang = req.headers['language'];
  let errMsg;
  console.log(
    `toUserId: ${toUserId} / categoryNum: ${categoryNum} / description: ${description}`
  );
  const reviewId = req.params.reviewId;
  console.log(`reviewId: ${reviewId}`);
  const fromUserId = req.user;
  console.log(`fromUserId: ${fromUserId}`);

  /* 유효성 검사 */
  try {
    await schemasOfReport.validateAsync({
      fromUserId,
      toUserId,
      reviewId,
      description,
      categoryNum,
    });
  } catch (err) {
    errMsg =
      lang === 'ko' || lang === undefined
        ? `유효하지 않은 요청입니다. 다시 확인해주세요`
        : `Invalid Request. Please check your request`;
    return next(customizedError(errMsg, 400));
  }
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [result] = await connection.query(
      queryOfAddingReport(
        fromUserId,
        toUserId,
        reviewId,
        categoryNum,
        description
      )
    );
    /* 추가 되지 않은 경우 */
    if (result.affectedRows === 0) {
      errMsg =
        lang === 'ko' || lang === undefined
          ? `신고한 데이터가 추가 되지 않았습니다.`
          : `Your Report data has been rejected. please check your report`;
      return next(customizedError(errMsg, 400));
    }
    return res.sendStatus(200);
  } catch (err) {
    /* 신고 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    logger.error(`신고를 등록하는 과정에서 서버 에러가 발생했습니다 : ${err}`);
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

const addUserReport = async (req, res, next) => {
  const fromUser = req.user;
  const { toUserId, categoryNum } = req.body;
  const lang = req.headers['language'];
  try {
    const findReportUserResult = await pool.query(
      FindReportUser(fromUser, toUserId)
    );
    if (findReportUserResult[0].length == 0) {
      await pool.query(addReportUser(fromUser, toUserId, categoryNum));
      return res.sendStatus(200);
    }
    errMsg =
      lang === 'ko' || lang === undefined
        ? `이미 신고한 유저입니다`
        : `User has already reported`;
    return next(customizedError(errMsg, 400));
  } catch (err) {
    console.log(err);
    errMsg =
      lang === 'ko' || lang === undefined
        ? `유효하지 않은 요청입니다. 다시 확인해주세요`
        : `Invalid Request. Please check your request`;
    return next(customizedError(errMsg, 400));
  }
};

module.exports = { addReport, addUserReport };
