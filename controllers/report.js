const { pool } = require('../models/index');
const customizedError = require('./error');
const schemasOfReport = require('../middlewares/validationReport');
const queryOfAddingReport = require('../query/report');

/* 신고한 내용 DB에 추가 */
const addReport = async (req, res, next) => {
  const { toUserId, categoryNum, description } = req.body;
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
    return next(customizedError(err, 400));
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
      return next(
        customizedError('신고한 데이터가 추가 되지 않았습니다.', 400)
      );
    }
    return res.sendStatus(200);
  } catch (err) {
    /* 신고 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

module.exports = addReport;
