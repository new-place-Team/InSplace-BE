/* 현재 위치 기반 조건 결과 페이지 조회 */
const queryOfResultPageOfConditionAndCurrentLoc = (
  userId,
  x,
  y,
  weather,
  category,
  num,
  gender,
  lang
) => {
  if (lang === 'ko' || lang === undefined) {
    return `
			SELECT 
				Posts.post_id AS postId, 
				title, 
				address_short AS addressShort,
				favorite_cnt AS favoriteCnt, 
				post_images AS postImage, 
				inside_yn AS insideYN,
				Posts.category_id AS category,
				permission_state AS permissionState, 
				CASE WHEN b.user_id = ${userId} THEN 1 
				ELSE 0 
				END AS favoriteState,
				post_loc_x AS postLocationX, 
				post_loc_y AS postLocationY,
				ROUND(6371 * acos(cos(radians(${x})) * cos(radians(post_loc_y)) * cos(radians(post_loc_x) - radians(${y})) + sin(radians(${x})) * sin(radians(post_loc_y)))) 
				AS distance
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE 
			Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			HAVING distance <= 5
			`;
  } else {
    return `
			SELECT 
				Posts.post_id AS postId, 
				Posts.title_en AS title, 
				Posts.address_short_en AS addressShort,
				favorite_cnt AS favoriteCnt, 
				post_images AS postImage, 
				inside_yn AS insideYN,
				Posts.category_id AS category, 
				permission_state AS permissionState, 
					CASE WHEN b.user_id = ${userId} THEN 1 
					ELSE 0 
					END AS favoriteState,
				post_loc_x AS postLocationX, 
				post_loc_y AS postLocationY,
					ROUND(6371 * acos(cos(radians(${x})) * cos(radians(post_loc_y)) * cos(radians(post_loc_x) - radians(${y})) + sin(radians(${x})) * sin(radians(post_loc_y)))) 
					AS distance
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE 
			Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}), '%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			HAVING distance <= 5
			`;
  }
};

/* 조건 결과 페이지 조회 */
const queryOfResultPageOfCondition = (
  userId,
  weather,
  category,
  num,
  gender,
  lang
) => {
  if (lang === 'ko' || lang === undefined) {
    return `
			SELECT 
			Posts.post_id AS postId, 
			title, 
			address_short AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category, 
			permission_state AS permissionState, 
			CASE WHEN 
			b.user_id = ${userId} THEN 1 
			ELSE 0 
			END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT 
				post_id, user_id
				FROM Favorites
				where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE
			Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}), '%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			`;
  } else {
    return `
			SELECT 
			Posts.post_id AS postId, 
			Posts.title_en AS title, 
			Posts.address_short_en AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category, 
			permission_state AS permissionState, 
			CASE WHEN b.user_id = ${userId} THEN 1 
			ELSE 0 
			END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT
				post_id, user_id
				FROM Favorites
				where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE
			Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			`;
  }
};

const queryOfGettingInOutDoorsPageNum = (
  userId,
  weather,
  category,
  num,
  gender,
  inside
) => {
  return `	
  	SELECT 
	count(Posts.post_id) AS pageNum, 
	Categories.description AS category, 
	permission_state AS permissionState, 
		CASE WHEN b.user_id =${userId} THEN 1 
		ELSE 0 
		END AS favoriteState
	FROM Posts 
	INNER JOIN Genders 
	ON Posts.gender_id = Genders.gender_id
	INNER JOIN Weathers
	ON Posts.weather_id = Weathers.weather_id
	INNER JOIN MemberCnt
	ON Posts.member_id = MemberCnt.member_id
	INNER JOIN Categories ON Posts.category_id = Categories.category_id
	LEFT JOIN (
		SELECT post_id, user_id
		FROM Favorites
		where user_id =${userId}
	) b 
	ON Posts.post_id = b.post_id
	WHERE  Weathers.description
	LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
	AND Categories.description
	LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
	AND MemberCnt.description
	LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
	AND Genders.description 
	LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
	AND inside_yn =${inside}
	`;
};

/* 현재위치 기반 총 페이지 수 가져오는 쿼리 */
const queryOfGettingInOutDoorsPageNumAndCurrentLoc = (
  userId,
  x,
  y,
  weather,
  category,
  num,
  gender,
  inside
) => {
  return `
	SELECT 
	count(Posts.post_id) AS pageNum, 
	Categories.description AS category, 
	permission_state AS permissionState, 
	CASE WHEN b.user_id =${userId} THEN 1 
	ELSE 0 
	END AS favoriteState
	FROM Posts 
	INNER JOIN Genders 
	ON Posts.gender_id = Genders.gender_id
	INNER JOIN Weathers
	ON Posts.weather_id = Weathers.weather_id
	INNER JOIN MemberCnt
	ON Posts.member_id = MemberCnt.member_id
	INNER JOIN Categories ON Posts.category_id = Categories.category_id
	LEFT JOIN (
		SELECT post_id, user_id
		FROM Favorites
		where user_id =${userId}
	) b 
	ON Posts.post_id = b.post_id
	WHERE  
	ROUND(6371 * acos(cos(radians(${x})) * cos(radians(post_loc_y)) * cos(radians(post_loc_x) - radians(${y})) + sin(radians(${x})) * sin(radians(post_loc_y)))) <= 5
	AND Weathers.description
	LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
	AND Categories.description
	LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
	AND MemberCnt.description
	LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
	AND Genders.description 
	LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
	AND inside_yn = ${inside}
`;
};
/* 조건 결과 상세 페이지 조회 쿼리(실내외 구분) */
const queryOfDetailPageOfInOutDoors = (
  userId,
  weather,
  category,
  num,
  gender,
  inside,
  pageNum,
  lang
) => {
  if (lang === 'ko' || lang === undefined) {
    return `
			SELECT 
			Posts.post_id AS postId, 
			title, 
			address_short AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category, 
			permission_state AS permissionState, 
			CASE WHEN b.user_id = ${userId} THEN 1 
			ELSE 0 
			END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			AND inside_yn = ${inside}
			LIMIT ${pageNum}, 12;
		`;
  } else {
    return `
			SELECT 
			Posts.post_id AS postId, 
			Posts.title_en AS title, 
			Posts.address_short_en AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category,
			permission_state AS permissionState, 
			CASE WHEN b.user_id = ${userId} THEN 1 
			ELSE 0 
			END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT 
				post_id, user_id
				FROM Favorites
				where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			AND inside_yn = ${inside}
			LIMIT ${pageNum}, 12;
		`;
  }
};

/* 현재 위치 기반, 조건 결과 상세 페이지 조회 쿼리(실내외 구분) */
const queryOfDetailPageOfInOutDoorsAndCurrentLoc = (
  userId,
  x,
  y,
  weather,
  category,
  num,
  gender,
  inside,
  pageNum,
  lang
) => {
  if (lang === 'ko' || lang === undefined) {
    return `
			SELECT 
			Posts.post_id AS postId, 
			title, 
			address_short AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category, 
			permission_state AS permissionState, 
			CASE WHEN b.user_id = ${userId} THEN 1 
			ELSE 0 
			END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY,
			ROUND(6371 * acos(cos(radians(${x})) * cos(radians(post_loc_y)) * cos(radians(post_loc_x) - radians(${y})) + sin(radians(${x})) * sin(radians(post_loc_y)))) 
			AS distance
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			AND inside_yn = ${inside}
			HAVING distance <= 5
			LIMIT ${pageNum}, 12;
			`;
  } else {
    return `
			SELECT 
			Posts.post_id AS postId, 
			Posts.title_en AS title, 
			Posts.address_short_en AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category, 
			permission_state AS permissionState, 
			CASE WHEN b.user_id = ${userId} THEN 1 
			ELSE 0 
			END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY,
			ROUND(6371 * acos(cos(radians(${x})) * cos(radians(post_loc_y)) * cos(radians(post_loc_x) - radians(${y})) + sin(radians(${x})) * sin(radians(post_loc_y)))) 
			AS distance
			FROM Posts 
			INNER JOIN Genders 
			ON Posts.gender_id = Genders.gender_id
			INNER JOIN Weathers
			ON Posts.weather_id = Weathers.weather_id
			INNER JOIN MemberCnt
			ON Posts.member_id = MemberCnt.member_id
			INNER JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE Weathers.description
			LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
			AND Categories.description
			LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
			AND MemberCnt.description
			LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
			AND Genders.description 
			LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
			AND inside_yn = ${inside}
			HAVING distance <= 5
			LIMIT ${pageNum}, 12;
			`;
  }
};

const queryOfResultPageOfTotal = (userId, result, pageNum, lang) => {
  if (lang === 'ko' || lang === undefined) {
    return `
		SELECT 
		Posts.post_id AS postId, 
		title, 
		address_short AS addressShort, 
		favorite_cnt AS favoriteCnt, 
		post_images AS postImage,
		Posts.category_id AS category, 
		permission_state AS permissionState,
		CASE WHEN b.user_id = ${userId} THEN 1 
		ELSE 0 END AS favoriteState,
		post_loc_x AS postLocationX, 
		post_loc_y AS postLocationY
		FROM Posts
		LEFT JOIN Categories 
		ON Posts.category_id = Categories.category_id
		LEFT JOIN (
			SELECT post_id, user_id
				FROM Favorites
				where user_id = ${userId}
		) b 
		ON Posts.post_id = b.post_id
		WHERE REPLACE(title, ' ', '')
		LIKE CONCAT('%', REPLACE('${result}', ' ', '') , '%')
		OR post_desc LIKE CONCAT('%', '${result}', '%')
		LIMIT ${pageNum}, 12;
		`;
  } else {
    return `
			SELECT 
			Posts.post_id AS postId, 
			Posts.title_en AS title, 
			Posts.address_short_en AS addressShort, 
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage,
			Posts.category_id AS category, 
			permission_state AS permissionState,
				CASE WHEN b.user_id = ${userId} THEN 1 
					ELSE 0 END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY
			FROM Posts
			LEFT JOIN Categories 
			ON Posts.category_id = Categories.category_id
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			WHERE REPLACE(title_en, ' ', '') LIKE CONCAT('%', REPLACE('${result}', ' ', '') , '%')
			OR post_desc_en LIKE CONCAT('%', '${result}', '%')
			LIMIT ${pageNum}, 12;
		`;
  }
};

/* 토탈 검색 페이지 총 게시글 수 가져오기 */
const queryOfGettingTotalPageNum = (userId, result, lang) => {
  if (lang === 'ko' || lang === undefined) {
    return `
	SELECT 
	count(Posts.post_id) AS pageNum, 
	title, 
	address_short AS addressShort, 
	favorite_cnt AS favoriteCnt, 
	post_images AS postImage,
	Posts.category_id AS category
	FROM Posts
	LEFT JOIN Categories 
	ON Posts.category_id = Categories.category_id
	LEFT JOIN (
		SELECT post_id, user_id
			FROM Favorites
			where user_id = ${userId}
	) b 
	ON Posts.post_id = b.post_id
	WHERE title LIKE CONCAT('%', '${result}', '%')
	OR post_desc LIKE CONCAT('%', '${result}', '%')
	OR title LIKE CONCAT('%', REPLACE('${result}', ' ', '') , '%')
			`;
  } else {
    return `
		SELECT 
		count(Posts.post_id) AS pageNum, 
		Posts.title_en AS title, 
		Posts.address_short_en AS addressShort, 
		favorite_cnt AS favoriteCnt, 
		post_images AS postImage,
		Posts.category_id AS category
		FROM Posts
		LEFT JOIN Categories 
		ON Posts.category_id = Categories.category_id
		LEFT JOIN (
			SELECT post_id, user_id
				FROM Favorites
				where user_id = ${userId}
		) b 
		ON Posts.post_id = b.post_id
		WHERE title_en LIKE CONCAT('%', '${result}', '%')
		OR post_desc_en LIKE CONCAT('%', '${result}', '%')
		OR title_en LIKE CONCAT('%', REPLACE('${result}', ' ', ''), '%')
	`;
  }
};

/* 조건 검색 결과 쿼리(지역별) */
const queryOfResultPageOfConditionAndArea = (
  userId,
  weather,
  category,
  num,
  gender,
  area,
  lang
) => {
  if (lang === 'ko' || lang === undefined) {
    return `
		SELECT 
		Posts.post_id AS postId, 
		title, 
		address_short AS addressShort,
		favorite_cnt AS favoriteCnt, 
		post_images AS postImage, 
		inside_yn AS insideYN,
		Posts.category_id AS category, 
		permission_state AS permissionState, 
			CASE WHEN b.user_id = ${userId} THEN 1 
			ELSE 0 
			END AS favoriteState,
		post_loc_x AS postLocationX, 
		post_loc_y AS postLocationY
		FROM Posts 
		INNER JOIN Genders 
		ON Posts.gender_id = Genders.gender_id
		INNER JOIN Weathers
		ON Posts.weather_id = Weathers.weather_id
		INNER JOIN MemberCnt
		ON Posts.member_id = MemberCnt.member_id
		INNER JOIN Categories 
		ON Posts.category_id = Categories.category_id
		LEFT JOIN (
			SELECT post_id, user_id
				FROM Favorites
				where user_id = ${userId}
		) b 
		ON Posts.post_id = b.post_id
		WHERE
		Weathers.description
		LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}), '%')
		AND Categories.description
		LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
		AND MemberCnt.description
		LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
		AND Genders.description 
		LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
		AND Posts.address_short
		LIKE CONCAT('%', '${area}','%')
   `;
  } else {
    return `
				SELECT 
				Posts.post_id AS postId, 
				Posts.title_en AS title, 
				Posts.address_short_en AS addressShort,
				favorite_cnt AS favoriteCnt, 
				post_images AS postImage, 
				inside_yn AS insideYN,
				Posts.category_id AS category, 
				permission_state AS permissionState, 
					CASE WHEN b.user_id = ${userId} THEN 1 
					ELSE 0 
					END AS favoriteState,
				post_loc_x AS postLocationX, 
				post_loc_y AS postLocationY
				FROM Posts 
				INNER JOIN Genders 
				ON Posts.gender_id = Genders.gender_id
				INNER JOIN Weathers
				ON Posts.weather_id = Weathers.weather_id
				INNER JOIN MemberCnt
				ON Posts.member_id = MemberCnt.member_id
				INNER JOIN Categories 
				ON Posts.category_id = Categories.category_id
				LEFT JOIN (
					SELECT post_id, user_id
						FROM Favorites
						where user_id = ${userId}
				) b 
				ON Posts.post_id = b.post_id
				WHERE
				Weathers.description
				LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
				AND Categories.description
				LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
				AND MemberCnt.description
				LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
				AND Genders.description 
				LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
				AND Posts.address_short_en
				LIKE CONCAT('%', '${area}','%')
				`;
  }
};

/* 실내외 구분 지역별 검색 쿼리 */
const queryOfDetailPageOfInOutDoorsAndArea = (
  userId,
  weather,
  category,
  num,
  gender,
  inside,
  pageNum,
  area,
  lang
) => {
  if (lang === 'ko' || lang === undefined) {
    return `
				SELECT 
				Posts.post_id AS postId, 
				title, 
				address_short AS addressShort,
				favorite_cnt AS favoriteCnt, 
				post_images AS postImage, 
				inside_yn AS insideYN,
				Posts.category_id AS category, 
				permission_state AS permissionState, 
					CASE WHEN b.user_id = ${userId} THEN 1 
					ELSE 0 
					END AS favoriteState,
				post_loc_x AS postLocationX, 
				post_loc_y AS postLocationY
				FROM Posts 
				INNER JOIN Genders 
				ON Posts.gender_id = Genders.gender_id
				INNER JOIN Weathers
				ON Posts.weather_id = Weathers.weather_id
				INNER JOIN MemberCnt
				ON Posts.member_id = MemberCnt.member_id
				INNER JOIN Categories 
				ON Posts.category_id = Categories.category_id
				LEFT JOIN (
					SELECT post_id, user_id
						FROM Favorites
						where user_id = ${userId}
				) b 
				ON Posts.post_id = b.post_id
				WHERE 
				Weathers.description
				LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
				AND Categories.description
				LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
				AND MemberCnt.description
				LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
				AND Genders.description 
				LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
				AND inside_yn = ${inside}
				AND Posts.address_short
				LIKE CONCAT('%','${area}','%')
				LIMIT ${pageNum}, 12;
			`;
  } else {
    return `
				SELECT 
				Posts.post_id AS postId, 
				Posts.title_en AS title, 
				Posts.address_short_en AS addressShort,
				favorite_cnt AS favoriteCnt, 
				post_images AS postImage, 
				inside_yn AS insideYN,
				Posts.category_id AS category,
				permission_state AS permissionState, 
					CASE WHEN b.user_id = ${userId} THEN 1 
					ELSE 0 
					END AS favoriteState,
				post_loc_x AS postLocationX, 
				post_loc_y AS postLocationY
				FROM Posts 
				INNER JOIN Genders 
				ON Posts.gender_id = Genders.gender_id
				INNER JOIN Weathers
				ON Posts.weather_id = Weathers.weather_id
				INNER JOIN MemberCnt
				ON Posts.member_id = MemberCnt.member_id
				INNER JOIN Categories 
				ON Posts.category_id = Categories.category_id
				LEFT JOIN (
					SELECT post_id, user_id
						FROM Favorites
						where user_id = ${userId}
				) b 
				ON Posts.post_id = b.post_id
				WHERE
				Weathers.description
				LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
				AND Categories.description
				LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
				AND MemberCnt.description
				LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
				AND Genders.description 
				LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
				AND inside_yn = ${inside}
				AND Posts.address_short_en
				LIKE CONCAT('%','${area}','%')
				LIMIT ${pageNum}, 12;
			`;
  }
};

/* 지역 검색인 경우 게시글 수 가져오는 쿼리 */
const queryOfGettingInOutDoorsPageNumAndArea = (
  userId,
  weather,
  category,
  num,
  gender,
  inside,
  area
) => {
  return `	
	SELECT 
  count(Posts.post_id) AS pageNum, 
  Categories.description AS category, 
  permission_state AS permissionState, 
	  CASE WHEN b.user_id =${userId} THEN 1 
	  ELSE 0 
	  END AS favoriteState
  FROM Posts 
  INNER JOIN Genders 
  ON Posts.gender_id = Genders.gender_id
  INNER JOIN Weathers
  ON Posts.weather_id = Weathers.weather_id
  INNER JOIN MemberCnt
  ON Posts.member_id = MemberCnt.member_id
  INNER JOIN Categories ON Posts.category_id = Categories.category_id
  LEFT JOIN (
	  SELECT post_id, user_id
	  FROM Favorites
	  where user_id =${userId}
  ) b 
  ON Posts.post_id = b.post_id
  WHERE  Weathers.description
  LIKE CONCAT('%', (SELECT description FROM Weathers WHERE weather_id=${weather}),'%')
  AND Categories.description
  LIKE CONCAT('%', (SELECT description FROM Categories WHERE category_id=${category}), '%')
  AND MemberCnt.description
  LIKE CONCAT('%', (SELECT description FROM MemberCnt WHERE member_id=${num}), '%')
  AND Genders.description 
  LIKE CONCAT('%', (SELECT description FROM Genders WHERE gender_id=${gender}), '%')
  AND inside_yn =${inside}
  AND Posts.address_short
  LIKE CONCAT('%', '${area}' ,'%')
  `;
};
module.exports = {
  queryOfResultPageOfCondition,
  queryOfDetailPageOfInOutDoors,
  queryOfResultPageOfTotal,
  queryOfGettingInOutDoorsPageNum,
  queryOfResultPageOfConditionAndCurrentLoc,
  queryOfDetailPageOfInOutDoorsAndCurrentLoc,
  queryOfGettingInOutDoorsPageNumAndCurrentLoc,
  queryOfGettingTotalPageNum,
  queryOfResultPageOfConditionAndArea,
  queryOfDetailPageOfInOutDoorsAndArea,
  queryOfGettingInOutDoorsPageNumAndArea,
};
