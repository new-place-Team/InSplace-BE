const { pool } = require('../models/index');
const {
  addVisited,
  findDetailPosts,
  findDetailReviews,
  checkVisitedUser,
} = require('../query/post');
const customizedError = require('../controllers/error');

/* 가본 장소 리스트에 추가 */
const addVisitedList = async (req, res, next) => {
  //유저가 가본 리스트에 추가했는지 확인
  const resultCheckVisitedUser = async (user, postID) => {
    const result = await pool.query(checkVisitedUser(user, postID));
    if (result[0].length !== 0) {
      return next(
        customizedError('이미 가본 리스트에 추가되어 있습니다.', 400)
      );
    }
    return true;
  };
  try {
    //resultCheckVisitedUser가 true면 추가 안되있다는 뜻
    if (await resultCheckVisitedUser(req.user, req.params.postId)) {
      //장소 리스트에 추가해주기
      await pool.query(addVisited(req.user, req.params.postId));
      return res.sendStatus(201);
    }
  } catch (err) {
    return next(customizedError(err, 400));
  }
};

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
      console.log(req.user);
      const [detailPosts] = await pool.query(
        findDetailPosts(req.params.postId, req.user)
      );

      const [detailReviews] = await pool.query(
        findDetailReviews(req.params.postId, req.user)
      );
      if (detailPosts.length == 0) {
        return next(customizedError('포스트가 없습니다.', 400));
      }
      console.log(detailPosts);
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
  addVisitedList,
  showDetailPost,
};
