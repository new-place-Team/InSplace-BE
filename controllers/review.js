const logger = require('../config/logger');
const { pool } = require('../models/index');
const {
  queryOfRegistingReview,
  queryOfModifyingReview,
} = require('../query/review');
const customizedError = require('./error');
const schemas = require('../middlewares/validationReview');
require('dotenv').config();

/* 이미지 배열을 DB저장할 수 있는 텍스트로 변환 */
const convertImageArrToText = (imgArr) => {
  const baseUrlSize = process.env.IMG_BASE_URL.length;
  let imgText = '';
  /* 아무 이미지도 없는 경우 */
  if (imgArr.length == 0) {
    return imgText;
  }
  for (let i = 0; i < imgArr.length; i++) {
    if (i === 0) {
      imgText += `${imgArr[i].transforms[0].location.slice(baseUrlSize)}`;
    } else {
      imgText += `&&${imgArr[i].transforms[0].location.slice(baseUrlSize)}`;
    }
  }
  return imgText;
};

/* DB에 저장 된 reviewImages를 배열로 변환 */
const convertImageTextToArr = (imgText) => {
  let imgArr = [];
  /* 아무 이미지도 없는 경우 */
  if (imgText.length === 0) {
    return imgArr;
  }

  imgArr = imgText.split('&&');
  for (let i = 0; i < imgArr.length; i++) {
    imgArr[i] = `${process.env.IMG_BASE_URL}${imgArr[i]}`;
  }
  return imgArr;
};

/* 리뷰 등록 함수 */
const registReview = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;
  const { reviewDesc, weekdayYN, revisitYN } = req.body;
  const reviewImages = convertImageArrToText(req.files);
  /* 유효성 검사 */
  try {
    await schemas.validateAsync({
      postId,
      userId,
      reviewImages,
      reviewDesc,
      weekdayYN,
      revisitYN,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }
  const params = [
    postId,
    userId,
    reviewImages,
    reviewDesc,
    weekdayYN,
    revisitYN,
  ];

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.query(queryOfRegistingReview, params);
    /* review 등록: Success */
    return res.status(201).json({
      postId: Number(postId),
      userId,
      reviewImages: convertImageTextToArr(reviewImages),
      reviewDesc,
      weekdayYN: Number(weekdayYN),
      revisitYN: Number(revisitYN),
    });
  } catch (err) {
    /* review 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 리뷰 수정 함수 */
const modifyReview = async (req, res, next) => {
  const { postId, reviewId } = req.params;
  const userId = req.user;
  const { reviewDesc, weekdayYN, revisitYN } = req.body;
  /* mocking 데이터를 통해 테스트 중 */
  const reviewImages = 'mocking1.png&&mocking2.png&&mocking3.png';
  // const reviewImages = req.file.transforms[0].location;

  /* 유효성 검사 */
  try {
    await schemas.validateAsync({
      reviewId,
      postId,
      userId,
      reviewImages,
      reviewDesc,
      weekdayYN,
      revisitYN,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }
  const params = [
    reviewImages,
    reviewDesc,
    weekdayYN,
    revisitYN,
    reviewId,
    userId,
    postId,
  ];

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const result = await connection.query(queryOfModifyingReview, params);
    console.log('result of update query:', result);
    /* review 등록: Success */
    return res.sendStatus(201);
  } catch (err) {
    /* review 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};
module.exports = {
  registReview,
  modifyReview,
};
