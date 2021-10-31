const logger = require('../config/logger');
const { pool } = require('../models/index');
const {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
} = require('../query/searching');

/* image Text를 Array로 변환시키는 함수 */
const convertImageToArray = (imgText) => {
  const imgArr = imgText.split('&&');
  return imgArr.slice(1);
};

/* 메인 이미지 한개만 가져오는 함수 */
const getMainImage = (imgText) => {
  const imgArr = imgText.split('&&');
  let res = '';
  if (imgArr.length >= 2) {
    res = imgArr[1];
  }
  return res;
};

/* 조건 결과 페이지 조회  */
const getResultPageOfCondition = async (req, res) => {
  const { weather, category, num, gender } = req.query;
  const params = [weather, category, num, gender];
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const result = await connection.query(queryOfResultPageOfCondition, params);
    const insidePlaces = [];
    const outSidePlaces = [];

    // 실내 실외 포스트 구분(최대 14개씩 받기)
    for (let i = 0; i < result[0].length; i++) {
      const insideSize = insidePlaces.length;
      const outsideSize = outSidePlaces.length;

      if (insideSize > 14 && outsideSize > 14) {
        break;
      }
      result[0][i].post_images = getMainImage(result[0][i].post_images);
      if (result[0][i].inside_yn === 1 && insideSize <= 14) {
        insidePlaces.push(result[0][i]);
      } else if (result[0][i].inside_yn === 0 && outsideSize <= 14) {
        outSidePlaces.push(result[0][i]);
      }
    }

    let payload = {
      success: true,
      insidePlaces,
      outSidePlaces,
    };
    return res.status(200).json({
      payload,
    });
  } catch (err) {
    logger.error('조건 결과 페이지 조회 기능에서 발생한 에러', err);
    payload = {
      success: false,
      errMsg: `조건 결과 페이지 조회 기능에서 발생한 에러', ${err}`,
      posts: [],
    };
    return res.status(400).json({ payload });
  } finally {
    await connection.release();
  }
};

/* 조건 결과 상세 페이지 조회(실내외 구분) */
const getDetailPageOfInOutDoors = async (req, res) => {
  const { weather, category, num, gender, inside } = req.query;
  const pageNum = req.params.number * 8;
  const params = [weather, category, num, gender, inside, pageNum];

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const result = await connection.query(
      queryOfDetailPageOfInOutDoors,
      params
    );

    let posts = result[0];

    // 메인 이미지만 가져오기
    for (let i = 0; i < posts.length; i++) {
      posts[i].post_images = getMainImage(posts[i].post_images);
    }

    let payload = {
      success: true,
      posts,
    };
    return res.status(200).json({
      payload,
    });
  } catch (err) {
    logger.error(
      '조건 결과 상세 페이지 조회(실내외 구분) 기능에서 발생한 에러',
      err
    );
    payload = {
      success: false,
      errMsg: `조건 결과 페이지 조회 기능에서 발생한 에러', ${err}`,
      posts: [],
    };
    return res.status(400).json({ payload });
  } finally {
    await connection.release();
  }
};

module.exports = {
  getResultPageOfCondition,
  getDetailPageOfInOutDoors,
};
