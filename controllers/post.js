const { pool } = require('../models/index');
const { findDetailPosts, findDetailReviews } = require('../query/post');
const customizedError = require('../controllers/error');
require('dotenv').config();

const showDetailPost = async (req, res, next) => {
  //주소를 &&로 잘라서 재구성하는 함수
  const splitPostAddress = (result) => {
    const resultSplitAddress = result[0];
    if (resultSplitAddress.postImages.length === 0) {
      resultSplitAddress.postImages = [];
      return { resultSplitAddress };
    }
    let postImages = resultSplitAddress.postImages.split('&&');
    for (let i = 0; i < postImages.length; i++) {
      postImages[i] = `${process.env.POST_BASE_URL}${postImages[i]}`;
    }
    resultSplitAddress.postImages = postImages;
    return { resultSplitAddress };
  };

  //리뷰 이미지들을 배열로 만들어주는 함수
  const splitReviewsImages = (detailReviews) => {
    const splitReviewsImages = detailReviews.map((data) => {
      if (data.reviewImages.length === 0) {
        data.reviewImages = [];
        return data;
      }
      let reviewImages = data.reviewImages.split('&&');
      for (let i = 0; i < reviewImages.length; i++) {
        reviewImages[i] = `${process.env.REVIEW_BASE_URL}${reviewImages[i]}`;
      }
      data.reviewImages = reviewImages;
      return data;
    });
    return splitReviewsImages;
  };

  //포스트와 리뷰들을 조회하는 함수
  const findDetailPage = async () => {
    try {
      const [detailPosts] = await pool.query(
        findDetailPosts(req.params.postId, req.user)
      );

      const [detailReviews] = await pool.query(
        findDetailReviews(req.params.postId, req.user)
      );
      if (detailPosts.length == 0) {
        return next(customizedError('포스트가 없습니다.', 400));
      }
      return {
        detailPosts,
        detailReviews,
      };
    } catch (err) {
      return next(customizedError(err.message, 400));
    }
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
    return next(customizedError(err.message, 500));
  }
};
module.exports = {
  showDetailPost,
};
