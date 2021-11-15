-- DB 초기 셋팅

-- User Table
CREATE TABLE `Users` (
  `user_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `kakao_id` integer UNIQUE, 
  `email` varchar(255) UNIQUE,
  `nickname` varchar(255) UNIQUE NOT NULL,
  `password` varchar(40) NOT NULL,
  `male_yn` boolean,
  `mbti_id` integer NOT NULL,
  `user_image` varchar(255),
  `delete_yn` boolean NOT NULL DEFAULT 0,
  `kakao_yn` boolean NOT NULL DEFAULT 0
);


-- Post Table
-- "post_loc_x": "위도"
-- "post_loc_y": "경도"
-- "like_cnt" : 해당 포스트에 좋아요를 누른 횟수
-- "weather_id": 1: 맑음, 2: 비, 3: 눈, 4: 맑음, 비 5: 맑음, 눈, 6:  비, 눈 7: 맑음, 비, 눈
-- member_cnt -> 1: 1명 , 2: 2명, 3: 4명 미만, 4: 4명 이상, 5: "4명 미만, 4명 이상"
CREATE TABLE `Posts` (
  `post_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `address` varchar(45),
  `address_short` varchar(45),
  `contact_number` varchar(20),
  `category_id` integer NOT NULL,
  `post_images` text,
  `post_desc` text,
  `post_loc_x` varchar(20) NOT NULL,
  `post_loc_y` varchar(20) NOT NULL,
  `favorite_cnt` integer NOT NULL DEFAULT 0,
  `weather_id` integer NOT NULL,
  `inside_yn` boolean NOT NULL,
  `gender_id` integer NOT NULL,
  `member_id` integer NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `md_pick` boolean NOT NULL DEFAULT 0,
  `permission_state` integer NOT NULL DEFAULT 2,
  `source` varchar(20),
  `admin` varchar(20)
);


-- Category Table
-- 1: "데이트",  2: "맛집", 3: "카페", 4:"예술", 5:"엑티비티"
CREATE TABLE `Categories` (
  `category_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(20)
);

-- Review Like Table
-- 해당 Review에 좋아요를 누를 경우 생성, 반대일 경우 삭제
CREATE TABLE `ReviewLikes` (
  `user_id` integer NOT NULL,
  `review_id` integer NOT NULL
);

-- 가본 적있는 Post들
-- 가본적있다고 클릭할 경우 생성, 
-- 마이페이지에서 삭제버튼을 클릭할 경우 삭제
CREATE TABLE `VisitedPosts` (
  `user_id` integer NOT NULL,
  `post_id` integer NOT NULL
);


-- 1: "남자끼리", 2: "여자끼리", 3: "혼성"
CREATE TABLE `Genders` (
  `gender_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(20) NOT NULL
);

CREATE TABLE `MemberCnt` (
  `member_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(20) NOT NULL
);

-- 찜한 Post 목록들
-- 해당 Post를 찜할 경우 생성, 반대일 경우 삭제
CREATE TABLE `Favorites` (
  `favorite_id` integer PRIMARY KEY AUTO_INCREMENT,
  `user_id` integer NOT NULL,
  `post_id` integer NOT NULL
);


-- 해당 Post에 대한 리뷰들
-- weekday_yn -> 평일일 경우 1, 주말일 경우 0
-- revisite_yn -> 재방문 의사가 있을 경우 1, 없을 경우 0
CREATE TABLE `Reviews` (
  `review_id` integer PRIMARY KEY AUTO_INCREMENT,
  `post_id` integer NOT NULL,
  `user_id` integer NOT NULL, 
  `review_images` varchar(255),
  `review_desc` varchar(255),
  `weekday_yn` boolean NOT NULL,
  `revisit_yn` boolean NOT NULL,
  `r_weather_id` integer NOT NULL,
  `delete_yn` boolean NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- MBTI 유형 별로 넣어 놓은 테이블(16가지)
CREATE TABLE `Mbti` (
  `mbti_id` integer PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(20) DEFAULT "Unknown"
);

-- WEATHERS 
CREATE TABLE `Weathers` (
  `weather_id` integer PRIMARY KEY AUTO_INCREMENT,
  `description` varchar(20)
);

-- 현재 날씨 테이블
 CREATE TABLE `CurrentWeather` (
  `cur_weather_id` integer PRIMARY KEY,
  `weather_status_fe` integer NOT NULL,
  `weather_status` integer NOT NULL,
  `weather_temp` varchar(20) NOT NULL,
  `temp_diff` varchar(20) NOT NULL
 );

-- REVIEW WEATHER TABLE
 CREATE TABLE `ReviewWeathers` (
  `r_weather_id` integer PRIMARY KEY,
  `description` varchar(20)
 );

 


-- Foreign Key
ALTER TABLE `Favorites` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `Reviews` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `VisitedPosts` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `ReviewLikes` ADD FOREIGN KEY (`review_id`) REFERENCES `Reviews` (`review_id`) ON DELETE CASCADE ON UPDATE NO ACTION;


ALTER TABLE `ReviewLikes` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);
ALTER TABLE `Favorites` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);
ALTER TABLE `VisitedPosts` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`); 
ALTER TABLE `Reviews` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);
ALTER TABLE `Reviews` ADD FOREIGN KEY (`r_weather_id`) REFERENCES `ReviewWeathers` (`r_weather_id`);

ALTER TABLE `Users` ADD FOREIGN KEY (`mbti_id`) REFERENCES `Mbti` (`mbti_id`);
ALTER TABLE `Posts` ADD FOREIGN KEY (`category_id`) REFERENCES `Categories` (`category_id`);
ALTER TABLE `Posts` ADD FOREIGN KEY (`gender_id`) REFERENCES `Genders` (`gender_id`);
ALTER TABLE `Posts` ADD FOREIGN KEY (`weather_id`) REFERENCES `Weathers` (`weather_id`);
ALTER TABLE `Posts` ADD FOREIGN KEY (`member_id`) REFERENCES `MemberCnt` (`member_id`);



-- Charset UTF-8 추가 
ALTER TABLE Users CONVERT TO character SET utf8;
ALTER TABLE Posts CONVERT TO character SET utf8;
ALTER TABLE Favorites CONVERT TO character SET utf8;
ALTER TABLE Mbti CONVERT TO character SET utf8;
ALTER TABLE ReviewLikes CONVERT TO character SET utf8;
ALTER TABLE Categories CONVERT TO character SET utf8;
ALTER TABLE Reviews CONVERT TO character SET utf8;
ALTER TABLE VisitedPosts CONVERT TO character SET utf8;
ALTER TABLE Genders CONVERT TO character SET utf8;
ALTER TABLE Weathers CONVERT TO character SET utf8;
ALTER TABLE MemberCnt CONVERT TO character SET utf8;
ALTER TABLE CurrentWeather CONVERT TO character SET utf8;
ALTER TABLE ReviewWeathers CONVERT TO character SET utf8;