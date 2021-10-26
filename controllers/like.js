const logger = require('../config/logger');
const { pool } = require('../models/index');

/* 좋아요 추가 함수 */
const addLike = async (req, res) => {
  const postId = req.params.postId;
  // const userId = req.user.user_id;
  const userId = 3;
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    // transaction 시작
    await connection.beginTransaction();
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

    await connection.query(likeQuery, [userId, postId]);
    await connection.query(likeCntQuery, [postId]);
    await connection.commit(); // 적용
    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    /* Bad Request */
    logger.error('좋아요 추가 기능에서 발생한 예상치 못한 에러:', err);
    await connection.rollback(); // 에러가 발생할 경우 원래 상태로 돌리기
    return res.status(400).json({
      success: false,
      errMsg: `좋아요 추가 기능에서 발생한 예상치 못한 에러: ${err}`,
    });
  } finally {
    await connection.release(); // 연결 끊기
  }
};

/* 좋아요 취소 함수 */
const cancelLike = async (req, res) => {
  const postId = req.params.postId;
  // const userId = req.user.user_id;
  const userId = 3;
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    // transaction 시작
    await connection.beginTransaction();
    const likeQuery = `
    DELETE FROM PostLikes
    WHERE user_id=? AND post_id=?;
    `;
    const likeCntQuery = `
    UPDATE Posts
    SET like_cnt = like_cnt - 1
    WHERE post_id=?;
    `;

    await connection.query(likeQuery, [userId, postId]);
    await connection.query(likeCntQuery, [postId]);
    await connection.commit(); // 적용
    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    /* Bad Request */
    logger.error('좋아요 취소 기능에서 발생한 예상치 못한 에러:', err);
    await connection.rollback(); // 에러가 발생할 경우 원래 상태로 돌리기
    return res.status(400).json({
      success: false,
      errMsg: `좋아요 취소 기능에서 발생한 예상치 못한 에러: ${err}`,
    });
  } finally {
    await connection.release(); // 연결 끊기
  }
};

module.exports = {
  addLike,
  cancelLike,
};
