const queryOfAddingPostLikes = `
    INSERT INTO
    PostLikes(user_id, post_id)
    VALUES(?, ?);
`;
const queryOfIncreasingLikeCnt = `
    UPDATE Posts
    SET like_cnt = like_cnt + 1
    WHERE post_id=?;
`;

/* PostLike Table에서 삭제하다 */
const queryOfDeletingPostLikes = `
    DELETE FROM PostLikes
    WHERE user_id=? AND post_id=?;
`;

/*  likeCnt 1 감소 */
const queryOfDecreasingLikeCnt = `
    UPDATE Posts
    SET like_cnt = like_cnt - 1
    WHERE post_id=?;
`;

const queryOfGettingLikeData = `
    SELECT * 
    FROM PostLikes 
    WHERE user_id=? AND post_id=?
`;

module.exports = {
  queryOfAddingPostLikes,
  queryOfIncreasingLikeCnt,
  queryOfDeletingPostLikes,
  queryOfDecreasingLikeCnt,
  queryOfGettingLikeData,
};
