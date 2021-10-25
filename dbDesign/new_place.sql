-- User Table
CREATE TABLE `Users` (
  `user_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `nickname` varchar(255) UNIQUE NOT NULL,
  `male_yn` boolean NOT NULL,
  `mbti_id` integer NOT NULL,
  `user_image` varchar(255)
);


-- Post Table
-- "post_loc_x": "위도"
-- "post_loc_y": "경도"
-- "like_cnt" : 해당 포스트에 좋아요를 누른 횟수
-- "sunday_yn": 날씨가 맑음일 경우 1, 나머지 0
-- 
CREATE TABLE `Posts` (
  `post_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `address` varchar(45),
  `address_short` varchar(45),
  `contact_number` varchar(20),
  `category_id` integer NOT NULL,
  `post_images` text,
  `post_desc` text,
  `post_loc_x` varchar(255) NOT NULL,
  `post_loc_y` varchar(255) NOT NULL,
  `like_cnt` integer NOT NULL DEFAULT 0,
  `sunday_yn` boolean NOT NULL,
  `inside_yn` boolean NOT NULL,
  `noisy_yn` boolean NOT NULL,
  `gender_id` integer NOT NULL,
  `opening_hour` varchar(255) NOT NULL,
  `closing_hour` varchar(255) NOT NULL,
  `num_of_people` integer NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Category Table
-- 1: "데이트",  2: "여행", 3: "스터디", 4:"엑티비티", 5:"예술"
CREATE TABLE `Categories` (
  `category_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `category_name` varchar(20)
);

-- Post Like Table
-- 해당 Post에 좋아요를 누를 경우 생성, 반대일 경우 삭제
CREATE TABLE `PostLikes` (
  `user_id` integer NOT NULL,
  `post_id` integer NOT NULL
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

-- 찜한 Post 목록들
-- 해당 Post를 찜할 경우 생성, 반대일 경우 삭제
CREATE TABLE `Favorites` (
  `user_id` integer NOT NULL,
  `post_id` integer NOT NULL
);


-- 해당 Post에 대한 리뷰들
-- weekday_yn -> 평일일 경우 1, 주말일 경우 0
-- revisite_yn -> 재방문 의사가 있을 경우 1, 없을 경우 0
CREATE TABLE `Reviews` (
  `review_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `post_id` integer,
  `review_images` varchar(255),
  `review_desc` varchar(255),
  `weekday_yn` boolean NOT NULL,
  `revisit_yn` boolean NOT NULL,
  `review_delete_yn` boolean,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- MBTI 유형 별로 넣어 놓은 테이블(16가지)
CREATE TABLE `Mbti` (
  `mbti_id` integer UNIQUE PRIMARY KEY AUTO_INCREMENT,
  `mbti_info` varchar(20) DEFAULT "Unknown"
);

ALTER TABLE `ReviewLikes` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `PostLikes` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `PostLikes` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `Reviews` ADD FOREIGN KEY (`review_id`) REFERENCES `ReviewLikes` (`review_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `Genders` ADD FOREIGN KEY (`gender_id`) REFERENCES `Posts` (`gender_id`);
ALTER TABLE `Favorites` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`);
ALTER TABLE `Posts` ADD FOREIGN KEY (`post_id`) REFERENCES `Favorites` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Mbti` ADD FOREIGN KEY (`mbti_id`) REFERENCES `Users` (`mbti_id`);
ALTER TABLE `Reviews` ADD FOREIGN KEY (`post_id`) REFERENCES `Posts` (`post_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE `Categories` ADD FOREIGN KEY (`category_id`) REFERENCES `Posts` (`category_id`);
ALTER TABLE `Users` ADD FOREIGN KEY (`user_id`) REFERENCES `visitedPosts` (`user_id`);
ALTER TABLE `Posts` ADD FOREIGN KEY (`post_id`) REFERENCES `visitedPosts` (`post_id`);

