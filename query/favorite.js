const queryOfAddingFavorite = `
    INSERT INTO
    Favorites(user_id, post_id)
    VALUES(?,?);
`;

const queryOfIncreasingFavoriteCnt = `
    UPDATE Posts
    SET favorite_cnt = favorite_cnt + 1
    WHERE post_id=?;
`;

const queryOfDeletingFavorite = `
    DELETE FROM Favorites
    WHERE user_id=? AND post_id=?
`;

const queryOfDecreasingFavoriteCnt = `
    UPDATE Posts
    SET favorite_cnt = favorite_cnt - 1
    WHERE post_id=?;
`;
const queryOfGettingFavoriteData = `
    SELECT * 
    FROM Favorites 
    WHERE user_id=? AND post_id=?
`;

module.exports = {
  queryOfAddingFavorite,
  queryOfDeletingFavorite,
  queryOfIncreasingFavoriteCnt,
  queryOfDecreasingFavoriteCnt,
  queryOfGettingFavoriteData,
};
