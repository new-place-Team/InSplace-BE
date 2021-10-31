const logger = require('../config/logger');
const { pool } = require('../models/index');
const { addVisited, findDetailPage } = require('../query/post');
/* 가본 장소 리스트에 추가 */
const addVisitedList = async (req, res) => {
  try {
    //장소 리스트에 추가해주기
    await pool.query(addVisited(req.user, req.params.postId));

    return res.sendStatus(201);
  } catch (err) {
    logger.error(`가본 장소 리스트 추가부분에서 에러 :${err}`);
    return res.status(400).json({
      success: false,
      errMsg: `가본 장소 리스트 추가부분에서 에러 :${err}`,
    });
  }
};

const showDetailPost = async (req, res) => {
  //주소를 &&로 잘라서 재구성하는 함수
  const auditResult = (result) => {
    let splitAddress = result[0];
    splitAddress.post_images = result[0].post_images.split('&&').slice(1);
    return splitAddress;
  };

  //상세페이지 찾는 쿼리
  try {
    const [result] = await pool.query(findDetailPage(req.params.postId));

    const splitAddress = auditResult(result);

    return res.status(200).json({ ...splitAddress });
  } catch (err) {
    logger.error(`상세페이지 찾는쿼리에서 에러 :${err}`);
    return res.status(400).json({
      success: false,
      errMsg: `상세페이지 찾는 쿼리에서 에러 :${err}`,
    });
  }
};
module.exports = {
  addVisitedList,
  showDetailPost,
};
