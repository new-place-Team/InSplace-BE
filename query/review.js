const queryOfRegistingReview = `
    INSERT INTO 
    Reviews(post_id, user_id, review_images, review_desc, weekday_yn, revisit_yn)
    VALUES(?, ?, ?, ?, ?, ?);
`;

const queryOfModifyingReview = `
  UPDATE Reviews 
  SET review_images=?, review_desc=?, weekday_yn=?, revisit_yn=?
  WHERE review_id=? and user_id=? and post_id=?
`;
module.exports = {
  queryOfRegistingReview,
  queryOfModifyingReview,
};
