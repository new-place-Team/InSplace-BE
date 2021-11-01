const logger = require('../config/logger');
const { pool } = require('../models/index');
const {
  addVisited,
  findDetailPosts,
  findDetailReviews,
} = require('../query/post');
const { customizedError } = require('../controllers/error');
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

const showDetailPost = async (req, res, next) => {
  //주소를 &&로 잘라서 재구성하는 함수
  const splitPostAddress = (result) => {
    let resultSplitAddress = result[0];
    resultSplitAddress.post_images = result[0].post_images.split('&&').slice(1);
    return { resultSplitAddress };
  };
  //리뷰 이미지들을 배열로 만들어주는 함수
  const splitReviewsImages = (detailReviews) => {
    const splitReviewsImages = detailReviews.map((data) => {
      data.reviewImages = data.reviewImages.split('&&');
      return data;
    });
    return splitReviewsImages;
  };

  //포스트와 리뷰들을 조회하는 함수
  const findDetailPage = async () => {
    const [detailPosts] = await pool.query(findDetailPosts(req.params.postId));
    const [detailReviews] = await pool.query(
      findDetailReviews(req.params.postId)
    );
    return {
      detailPosts,
      detailReviews,
    };
  };

  //상세페이지 찾는 쿼리
  try {
    const { detailPosts, detailReviews } = await findDetailPage(
      req.params.postId
    );
    const { resultSplitAddress } = splitPostAddress(detailPosts);
    resultSplitAddress.reviews = splitReviewsImages(detailReviews);

    return res.status(200).json({ ...resultSplitAddress });
  } catch (err) {
    return next(customizedError(err.message, 400));
  }
};
module.exports = {
  addVisitedList,
  showDetailPost,
};
