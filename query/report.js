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
    VALUES(${fromUserId}, ${toUserId}, ${reviewId}, ${categoryNum}, ${description})    
    `;
};

module.exports = queryOfAddingReport;
