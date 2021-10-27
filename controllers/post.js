const logger = require('../config/logger');
const { pool } = require('../models/index');
const { addVisited, findDetailPage } = require('../query/post');
/* 가본 장소 리스트에 추가 */
const addVisitedList = async (req, res) => {
  try {
    //장소 리스트에 추가해주기
    await pool.query(addVisited(req.user, req.params.postId));
    const payload = {
      success: true,
    };
    res.status(200).json({ payload });
  } catch (err) {
    logger.error(`가본 장소 리스트 추가부분에서 에러:${err}`);
    res.status(400).json({
      success: false,
      errMsg: '가본 장소 리스트 추가부분에서 에러',
      err: err,
    });
  }
};

const showDetailPost = async (req, res) => {
  //상세페이지 찾는 쿼리
  try {
    const [result] = await pool.query(findDetailPage(req.params.postId));
    //payload
    const payload = { success: true, ...result[0] };
    res.status(200).json({ payload });
  } catch (err) {
    logger.error(`상세페이지 찾는쿼리에서 에러 : ${err}`);
    res.status(400).json({
      success: false,
      errMsg: '상세페이지 찾는 쿼리에서 에러',
      err: err,
    });
  }
};
module.exports = {
  addVisitedList,
  showDetailPost,
};
