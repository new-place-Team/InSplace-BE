const addVisited = (userID, postID) => {
  return `INSERT INTO VisitedPosts
    (user_id, post_id)
    VALUES("${userID}","${postID}")`;
};
const findDetailPage = (postID) => {
  return `SELECT title, post_images, contact_number, post_loc_x, post_loc_y, description, address, address_short, post_desc, like_cnt FROM Posts 
    INNER JOIN Categories 
    ON Posts.category_id = Categories.category_id  
    WHERE post_id = "${postID}"`;
};
module.exports = { addVisited, findDetailPage };
