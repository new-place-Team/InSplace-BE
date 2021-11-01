const jwt = require('jsonwebtoken');
const customizedError = require('../controllers/error');

/*
 * 로그인 권한이 없을 경우 내보내는 미들웨어
 * 로그인 권한이 있을 경우, user_id 값을 넘김
 */
const isAuth = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    /* authHeader == undefined || Bearer로 시작하지 않는 경우 */
    if (!(authHeader && authHeader.startsWith('Bearer'))) {
      return next(
        customizedError(
          'Authorization이 undefined이거나 Bearer로 시작 되지 않습니다.',
          400
        )
      );
    }

    const token = authHeader.split(' ')[1];
    /* token값이 존재하지 않는 경우 */
    if (!token) {
      return next(customizedError('token값이 존재하지 않습니다.', 400));
    }

    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      /* login 유효시간 만료 OR 유효한 Token값이 아닌 경우 */
      if (error) {
        return next(
          'login 유효시간이 만료되었거나 유효한 token값이 아닙니다.',
          401
        );
      }

      req.user = decoded.user_id;
      next();
    });
  } catch (err) {
    return next('isAuth Function에서 예측하지 못한 에러가 발생했습니다.', 500);
  }
};

/*
 * 로그인 권한이 없을 경우 그냥 내보냄
 * 로그인 권한이 있을 경우, user_id 값을 넘김
 */
const justCheckAuth = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      /* login 유효시간 만료 OR 유효한 Token값이 아닌 경우 */
      if (error) {
        next();
      }

      req.user = decoded.user_id;
      next();
    });
  } catch (err) {
    next();
  }
};

module.exports = {
  isAuth,
  justCheckAuth,
};
