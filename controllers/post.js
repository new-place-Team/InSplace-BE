const logger = require('../config/logger');

/* 가본 장소 리스트에 추가 */
const addVisitedList = (req, res) => {
  try {
    const query = `
    INSERT INTO VisitedPosts()
    `;
  } catch (err) {
    logger.error(`가본 장소 리스트 추가 API에서 발생한 오류: ${err}`);
    return res.status(400).json({
      success: false,
      errMsg: `가본 장소 리스트 추가 API에서 발생한 오류: ${err}`,
    });
  }
};

module.exports = {
  addVisitedList,
};
