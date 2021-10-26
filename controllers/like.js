const logger = require('../config/logger');
// const { db } = require('../models/index');

/* 좋아요 추가 함수 */
const addLike = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.userId;
  try {
    await db.beginTransaction(); // 트랜잭션 적용 시작

    const likeQuery = `
    INSERT INTO
    PostLikes(user_id, post_id)
    VALUES(?, ?);
    `;
    const likeCntQuery = `
    UPDATE Posts
    SET like_cnt = like_cnt + 1
    WHERE post_id=?;
    `;

    await db.query(likeQuery, [userId, postId], (err, rows, fields) => {});
    await db.query(likeCntQuery, [postId], (err, rows, fields) => {});

    await db.commit(); // 커밋
    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    /* Bad Request */
    logger.error('좋아요 추가 기능에서 발생한 예상치 못한 에러:', err);
    await db.rollback(); // 롤백
    return res.status(400).json({
      success: false,
      errMsg: `좋아요 추가 기능에서 발생한 예상치 못한 에러: ${err}`,
    });
  } finally {
    db.release(); // db 회수
  }
};

/* 좋아요 취소 함수 */
const cancelLike = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.userId;

  try {
    await db.beginTransaction(); // 트랜잭션 적용 시작

    /* db에서 삭제 */
    const likeQuery = `
    DELETE FROM PostLikes
    WHERE post_id=? and user_id=?;
    `;

    const likeCntQuery = `
    UPDATE Posts
    SET like_cnt = like_cnt - 1
    WHERE post_id=?;
    `;

    await db.query(likeQuery, [userId, postId], (err, rows, fields) => {});
    await db.query(likeCntQuery, [postId], (err, rows, fields) => {});

    await db.commit(); // 커밋
    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    logger.error('좋아요 취소 기능에서 발생한 예상치 못한 에러:', err);
    await db.rollback(); // 롤백
    /* Bad Request */
    return res.status(400).json({
      success: false,
      errMsg: `좋아요 취소 기능에서 발생한 예상치 못한 에러: ${err}`,
    });
  } finally {
    db.release(); // db 회수
  }
};

module.exports = {
  addLike,
  cancelLike,
};
