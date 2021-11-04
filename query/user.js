const getUsers = (email, nickname) => {
  return email !== ''
    ? `SELECT * FROM Users WHERE email = "${email}"`
    : `SELECT * FROM Users WHERE nickname = "${nickname}"`;
};

const checkMBTI = (mbti) => {
  return `SELECT mbti_id 
    FROM Mbti 
    WHERE mbti_id = "${mbti}"`;
};

const insertNewUser = (email, nickname, hashPassword, male_yn, mbti) => {
  return `INSERT INTO Users 
    (email, nickname, password, male_yn, mbti_id) 
    VALUES("${email}","${nickname}","${hashPassword}","${male_yn}","${mbti}")`;
};

const getUserInformation = (email) => {
  return `SELECT password, user_id, nickname, email, description, user_image   
    FROM Users INNER JOIN Mbti ON Users.mbti_id = Mbti.mbti_id
    WHERE email = "${email}"`;
};
const getUserInformationById = (id) => {
  return `SELECT user_id AS userId, email, nickname, user_image ,description FROM Users INNER JOIN Mbti ON Users.mbti_id = Mbti.mbti_id WHERE user_id = ${id} `;
};

const updateUserDeleteYn = (userID) => {
  return `UPDATE Users SET delete_yn = 1 WHERE user_id="${userID}"`;
};

const getUserFavoriteQuery = (userID) => {
  return `
  SELECT DISTINCT Posts.post_id AS postId, Posts.title, Posts.category_id AS categoryId, Posts.post_images AS postImage
  FROM Posts 
  LEFT JOIN Favorites
  ON Posts.post_id = Favorites.post_id
  WHERE Favorites.user_id = ${userID}
  `;
};

const getUserVisitedQuery = (userID) => {
  return `
  SELECT DISTINCT Posts.post_id AS postId, Posts.title, Posts.category_id AS categoryId, Posts.post_images AS postImage
  FROM Posts 
  LEFT JOIN VisitedPosts
  ON Posts.post_id = VisitedPosts.post_id
  WHERE VisitedPosts.user_id = ${userID}
  `;
};
const getKakaoUser = (userKakaoId) => {
  return `
  SELECT user_id, nickname, user_image, description ,email FROM Users  
  LEFT JOIN Mbti ON Users.mbti_id = Mbti.mbti_id
  WHERE kakao_id = ${userKakaoId}
  `;
};

const insertNewUserforKakao = (kakaoId, userImage, nickname, gender) => {
  if (gender == '') {
    return `
    INSERT INTO Users 
    (kakao_id, user_image, nickname, kakao_yn) 
    VALUES(${kakaoId},"${userImage}","${nickname}", 1)`;
  }
  return `
  INSERT INTO Users 
  (kakao_id, user_image, nickname, kakao_yn, male_yn) 
  VALUES(${kakaoId},"${userImage}","${nickname}", 1, ${gender})`;
};

module.exports = {
  getUsers,
  checkMBTI,
  insertNewUser,
  getUserInformation,
  getUserInformationById,
  updateUserDeleteYn,
  getUserFavoriteQuery,
  getUserVisitedQuery,
  getKakaoUser,
  insertNewUserforKakao,
};
