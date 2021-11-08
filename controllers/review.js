const { pool } = require('../models/index');
require('dotenv').config();
const {
  updateReviewDeleteYn,
  queryOfRegistingReview,
  queryOfGettingReview,
  queryOfModifyingReview,
  queryOfGettingReviewsByOrder,
  queryOfGettingWritingPageOfReview,
  queryOfGettingEditingPageOfReview,
} = require('../query/review');

const customizedError = require('../controllers/error');
const {
  schemasOfRegistingReview,
  schemasOfModifyingReview,
  schemasOfGettingReviews,
} = require('../middlewares/validationReview');

const {
  convertImageArrToText,
  convertImageTextToArr,
  getMainImage,
} = require('./utils/image');

/* post 데이터 가공 */
const getPostData = (result) => {
  return (post = {
    postId: result.postId,
    reviewId: result.reviewId,
    userImage: result.userImage,
    nickname: result.nickname,
    gender: result.gender,
    mbti: result.mbti,
    reviewImages: convertImageTextToArr(
      result.reviewImages,
      process.env.REVIEW_BASE_URL
    ),
    reviewDesc: result.reviewDesc,
    weather: result.weather,
    weekdayYN: result.weekdayYN,
    revisitYN: result.revisitYN,
    likeCnt: result.likeCnt,
    likeState: result.likeState,
    createdAt: result.createdAt,
  });
};

/* 리뷰 등록 미들웨어 */
const registReview = async (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.user;
  const { reviewDesc, weekdayYN, revisitYN, weather } = req.body;

  const reviewImages = convertImageArrToText(
    req.files,
    process.env.REVIEW_BASE_URL
  );

  /* 유효성 검사 */
  try {
    await schemasOfRegistingReview.validateAsync({
      postId,
      userId,
      reviewImages,
      reviewDesc,
      weekdayYN,
      revisitYN,
      weather,
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
    weather,
  ];
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let result = await connection.query(queryOfRegistingReview, params);
    /* 추가 되지 않은 경우 */
    if (result[0].affectedRows === 0) {
      return next(
        customizedError('review 데이터가 추가 되지 않았습니다.', 400)
      );
    }
    const reviewId = result[0].insertId;
    const paramsOfGettingReview = [userId, userId, reviewId, postId];
    result = await connection.query(
      queryOfGettingReview,
      paramsOfGettingReview
    );
    result = result[0][0];
    /* review 등록: Success */
    res.status(201).json({
      post: getPostData(result),
    });
  } catch (err) {
    /* review 등록: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 리뷰 삭제 미들웨어 */
const deleteReview = async (req, res, next) => {
  try {
    const result = await pool.query(
      updateReviewDeleteYn(req.params.postId, req.params.reviewId, req.user)
    );

    if (result[0].changedRows == 0) {
      return next(customizedError('이미 삭제된 리뷰입니다.', 400));
    }
    return res.sendStatus(200);
  } catch (err) {
    return next(customizedError(err.message, 500));
  }
};

/* 리뷰 수정 미들웨어 */
const modifyReview = async (req, res, next) => {
  console.log('req.files:', req.files, typeof req.files);
  console.log("req.body:", req.body);
  console.log("----------");
  console.log("req", req);
  /* 문자열로 온 경우 req.body.reviewImages 존재
     파일로 온 경우 req.body.reviewImages == undefined
  */

  const { postId, reviewId } = req.params;
  const userId = req.user;
  const { reviewDesc, weekdayYN, revisitYN, weather } = req.body;
  const reviewImages =
    req.files != undefined
      ? convertImageArrToText(req.files, process.env.REVIEW_BASE_URL)
      : req.body.reviewImages;

  console.log(
    `reviewImages : ${reviewImages} / type: : ${typeof reviewImages} `
  );
  return res.json({ success: true });

  /* 유효성 검사 */
  try {
    await schemasOfModifyingReview.validateAsync({
      reviewId,
      postId,
      userId,
      reviewImages,
      reviewDesc,
      weekdayYN,
      revisitYN,
      weather,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }

  const params = [
    reviewImages,
    reviewDesc,
    weekdayYN,
    revisitYN,
    weather,
    reviewId,
    userId,
    postId,
  ];

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let result = await connection.query(queryOfModifyingReview, params);
    /* 변경된 것이 없는 경우 */
    if (result[0].changedRows == 0) {
      return next(customizedError('수정된 데이터가 없습니다.', 400));
    }

    const paramsOfGettingReview = [userId, userId, reviewId, postId];
    result = await connection.query(
      queryOfGettingReview,
      paramsOfGettingReview
    );
    result = result[0][0];
    /* review 수정: Success */
    return res.status(201).json({
      post: getPostData(result),
    });
  } catch (err) {
    /* review 수정: Fail */
    /* Internal Server Error(예상 못한 에러 발생) */
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 최신순으로 리뷰 가져오기 */
const getReviewByLatest = async (req, res, next) => {
  const postId = req.params.postId;
  const pageNum = Number(req.params.num);
  let userId = 0;
  /* 로그인 한 유저인 경우 userId, 아닌 경우 0 */
  if (req.user) {
    userId = req.user;
  }

  /* 유효성 검사 */
  try {
    await schemasOfGettingReviews.validateAsync({
      userId,
      pageNum,
      postId,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let reviews = await connection.query(
      queryOfGettingReviewsByOrder(postId, userId, pageNum, 'created_at')
    );
    reviews = reviews[0];
    /* 이미지 배열로 변환 */
    for (let i = 0; i < reviews.length; i++) {
      reviews[i].reviewImages = convertImageTextToArr(
        reviews[i].reviewImages,
        process.env.REVIEW_BASE_URL
      );
    }
    res.status(200).json({
      reviews,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 추천순으로 리뷰 가져오기 */
const getReviewByLike = async (req, res, next) => {
  const postId = req.params.postId;
  const pageNum = Number(req.params.num);
  let userId = 0;
  /* 로그인 한 유저인 경우 userId, 아닌 경우 0 */
  if (req.user) {
    userId = req.user;
  }

  /* 유효성 검사 */
  try {
    await schemasOfGettingReviews.validateAsync({
      userId,
      pageNum,
      postId,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  }
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let reviews = await connection.query(
      queryOfGettingReviewsByOrder(postId, userId, pageNum, 'like_cnt')
    );
    reviews = reviews[0];

    console.log('length:', reviews.length);
    /* 이미지 배열로 변환 */
    for (let i = 0; i < reviews.length; i++) {
      reviews[i].reviewImages = convertImageTextToArr(
        reviews[i].reviewImages,
        process.env.REVIEW_BASE_URL
      );
    }

    res.status(200).json({
      reviews,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* const adjImg = (resultImg) => {
  resultImg.postImage = resultImg.postImage.split('&&').slice(1)[0];
  return resultImg.postImage;
}; */

/* review 작성 페이지 조회 */
const getWritingPageOfReview = async (req, res, next) => {
  const postId = req.params.postId;

  /* 유효성 검사 */
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    let result = await connection.query(queryOfGettingWritingPageOfReview, [
      postId,
    ]);

    result = result[0][0];
    return res.status(200).json({
      post: {
        postId: result.postId,
        postImage: getMainImage(result.postImage, process.env.POST_BASE_URL),
        category: result.category,
        title: result.title,
      },
    });
  } catch (err) {
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

/* 리뷰 수정 페이지 조회 */
const getEditingPageOfReview = async (req, res, next) => {
  const reviewId = req.params.reviewId;

  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const [[review]] = await connection.query(
      queryOfGettingEditingPageOfReview,
      [reviewId]
    );

    review.reviewImages = convertImageTextToArr(
      review.reviewImages,
      process.env.REVIEW_BASE_URL
    );
    return res.status(200).json({
      review,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  } finally {
    await connection.release();
  }
};

const checkImageFileType = (req, res, next) => {
  console.log('checkImageFileType');
  const reviewImages = req.body.reviewImages;
  console.log('reviewImages', reviewImages, typeof reviewImages);

  next('route');
};
module.exports = {
  registReview,
  modifyReview,
  deleteReview,
  getReviewByLatest,
  getReviewByLike,
  getWritingPageOfReview,
  getEditingPageOfReview,
  checkImageFileType,
};
