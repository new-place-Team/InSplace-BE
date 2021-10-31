const adminPageQuery = `
   SELECT post_id, title, address, address_short,
   contact_number, Posts.category_id, Categories.description as category, post_images, post_desc,
   post_loc_x, post_loc_y, Posts.weather_id, Weathers.description as weather, inside_yn,
   Posts.gender_id, Genders.description as gender, Posts.member_id, MemberCnt.description as member, md_pick, source, admin
   FROM Posts
   INNER JOIN Categories ON Posts.category_id = Categories.category_id
   INNER JOIN Weathers ON Posts.weather_id = Weathers.weather_id
   INNER JOIN Genders ON Posts.gender_id = Genders.gender_id
   INNER JOIN MemberCnt ON Posts.member_id = MemberCnt.member_id
   ORDER BY Posts.post_id ASC;
   ;`;

const editBtnQuery = `
  UPDATE Posts
  SET title=?, address=?, address_short=?, contact_number=?,
  category_id=?, post_images=?, post_desc=?, post_loc_x=?, post_loc_y=?,
  like_cnt=?, weather_id=?, inside_yn=?, gender_id=?, member_id=?
  WHERE post_id=?;
`;
const deleteBtnQuery = `
  DELETE FROM Posts WHERE post_id=?;
`;

module.exports = {
  adminPageQuery,
  editBtnQuery,
  deleteBtnQuery,
};
