const queryOfAddingFavorite = `
    INSERT INTO
    Favorites(user_id, post_id)
    VALUES(?,?);
`;
const queryOfDeletingFavorite = `
    DELETE FROM Favorites
    WHERE user_id=? AND post_id=?
`;

const queryOfGettingFavoriteData = `
    SELECT * 
    FROM Favorites 
    WHERE user_id=? AND post_id=?
`;

module.exports = {
  queryOfAddingFavorite,
  queryOfDeletingFavorite,
  queryOfGettingFavoriteData
};
