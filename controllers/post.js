const { pool } = require('../models/index');
const { findDetailPosts, findDetailReviews } = require('../query/post');
const customizedError = require('../controllers/error');

const showDetailPost = async (req, res, next) => {
  //주소를 &&로 잘라서 재구성하는 함수
  const splitPostAddress = (result) => {
    let resultSplitAddress = result[0];
    resultSplitAddress.postImages = result[0].postImages.split('&&').slice(1);
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
