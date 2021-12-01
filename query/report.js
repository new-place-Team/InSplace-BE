const queryOfAddingReport = (
  fromUserId,
  toUserId,
  reviewId,
  categoryNum,
  description
) => {
  return `
    INSERT INTO
    Reports(from_user_id, to_user_id, review_id, category_num, description) 
    VALUES(${fromUserId}, ${toUserId}, ${reviewId}, ${categoryNum}, '${description}')    
    `;
};

const FindReportUser = (fromUser, toUserId) => {
  return `SELECT * FROM UserReports WHERE from_user_id = ${fromUser} and to_user_id = ${toUserId}`;
};
const addReportUser = (fromUser, toUserId, categoryNum) => {
  return `INSERT INTO UserReports(from_user_id,to_user_id,category_num) VALUES(${fromUser},${toUserId},${categoryNum})`;
};

module.exports = { queryOfAddingReport, addReportUser, FindReportUser };
