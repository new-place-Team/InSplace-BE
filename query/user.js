const getUsers = (email, nickname) => {
  return email !== ''
    ? `SELECT * FROM Users WHERE email = "${email}"`
    : `SELECT * FROM Users WHERE nickname = "${nickname}"`;
};

const checkMBTI = (mbti) => {
  return `SELECT mbti_id 
    FROM Mbti 
    WHERE description = "${mbti}"`;
};

const insertNewUser = (email, nickname, hashPassword, male_yn, mbti) => {
  return `INSERT INTO Users 
    (email, nickname, password, male_yn, mbti_id) 
    VALUES("${email}","${nickname}","${hashPassword}","${male_yn}","${mbti}")`;
};

const getHashedPassword = (email) => {
  return `SELECT password, user_id, nickname 
    FROM Users 
    WHERE email = "${email}"`;
};

module.exports = { getUsers, checkMBTI, insertNewUser, getHashedPassword };
