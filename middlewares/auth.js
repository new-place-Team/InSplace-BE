const jwt = require('jsonwebtoken');
const customizedError = require('../controllers/error');
const logger = require('../config/logger');

/*
 * 로그인 권한이 없을 경우 내보내는 미들웨어
 * 로그인 권한이 있을 경우, user_id 값을 넘김
 */
const isAuth = (req, res, next) => {
  let errMsg = '';
  const lang = req.headers['language'];

  try {
    const authHeader = req.get('Authorization');
    /* authHeader == undefined || Bearer로 시작하지 않는 경우 */
    if (!(authHeader && authHeader.startsWith('Bearer'))) {
      errMsg =
        lang === 'ko' || lang === undefined
          ? '로그인한 유저만 이용 가능한 서비스입니다.'
          : 'This service is available only to logged-in users.';
      logger.info(`${errMsg}`);
      return next(customizedError(errMsg, 401));
    }

    const token = authHeader.split(' ')[1];
    /* token값이 존재하지 않는 경우 */
    if (!token) {
      errMsg =
        lang === 'ko' || lang === undefined
          ? '로그인한 유저만 이용 가능한 서비스입니다.'
          : 'This service is available only to logged-in users.';
      logger.info(`${errMsg}`);
      return next(customizedError(errMsg, 401));
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      /* login 유효시간 만료 OR 유효한 Token값이 아닌 경우 */
      if (err) {
        errMsg =
          lang === 'ko' || lang === undefined
            ? '유효 기간이 만료되었습니다.'
            : 'Validation has expired.';
        logger.info(`${errMsg} : ${err}`);
        return next(errMsg, 401);
      }

      req.user = decoded.user_id;
      next();
    });
  } catch (err) {
    errMsg = 'Func: isAuth 에서 internal server error 발생';
    logger.error(`${errMsg} : ${err}`);
    return next(errMsg, 500);
  }
};

/*
 * 로그인 권한이 없을 경우 그냥 내보냄
 * 로그인 권한이 있을 경우, user_id 값을 넘김
 */
const justCheckAuth = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    /* authHeader == undefined || Bearer로 시작하지 않는 경우 */
    if (!(authHeader && authHeader.startsWith('Bearer'))) {
      return next();
    }
    const token = authHeader.split(' ')[1];
    /* token값이 존재하지 않는 경우 */
    if (!token) {
      return next();
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
      /* login 유효시간 만료 OR 유효한 Token값이 아닌 경우 */
      if (err) {
        return next();
      }

      req.user = decoded.user_id;
      return next();
    });
  } catch (err) {
    logger.error(`Func: isAuth 에서 internal server error 발생: ${err}`);
    return next();
  }
};

module.exports = {
  isAuth,
  justCheckAuth,
};
