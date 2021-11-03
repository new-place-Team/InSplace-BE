/* 가본 장소 리스트에 추가 */
const addVisitedPosts = async (req, res, next) => {
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

const deleteVisitedPosts = (req, res, next) => {
  console.log('가본 장소 리스트에서 삭제하는 미들웨어');
};

module.exports = {
  addVisitedPosts,
  deleteVisitedPosts,
};
