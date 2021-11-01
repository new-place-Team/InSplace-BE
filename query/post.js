const addVisited = (userID, postID) => {
  return `INSERT INTO VisitedPosts
    (user_id, post_id)
    VALUES("${userID}","${postID}")`;
};
const findDetailPosts = (postID) => {
  return `SELECT title, post_images, contact_number, post_loc_x, post_loc_y, description, address, address_short, post_desc, favorite_cnt FROM Posts 
    INNER JOIN Categories 
    ON Posts.category_id = Categories.category_id  
    WHERE post_id = "${postID}"`;
};

const checkVisitedUser = (userID, postID) => {
  return `SELECT * FROM VisitedPosts WHERE user_id = "${userID}" AND post_id = "${postID}"`;
};

const findDetailReviews = (postID) => {
  return `SELECT user_Id AS userID, review_images AS reviewImages, review_desc AS reviewDesc, created_at AS createdAt FROM Reviews
  WHERE post_id = "${postID}" AND delete_yn = "0"
  ORDER BY created_at DESC 
  LIMIT 8`;
};
module.exports = {
  addVisited,
  findDetailPosts,
  findDetailReviews,
  checkVisitedUser,
};
