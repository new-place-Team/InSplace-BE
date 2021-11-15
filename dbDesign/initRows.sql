-- Users Table
INSERT INTO Users(email, nickname, password, male_yn, mbti_id, user_image) VALUES("najongsi@naver.com", "jongwan", "asdasd", 1, 3, "default.png" );
INSERT INTO Users(email, nickname, password, male_yn, mbti_id, user_image) VALUES("najongsi@naver.com1", "jongwan1", "asdasd",1, 2, "default.png" );
INSERT INTO Users(email, nickname, password, male_yn, mbti_id, user_image) VALUES("najongsi@naver.com2", "jongwan2", "asdasd", 1, 10, "default.png" );

-- MBTI Table
INSERT INTO Mbti(description) values("ISTJ");
INSERT INTO Mbti(description) values("ISFJ");
INSERT INTO Mbti(description) values("INFJ");
INSERT INTO Mbti(description) values("INTJ");
INSERT INTO Mbti(description) values("ISTP");
INSERT INTO Mbti(description) values("ISFP");
INSERT INTO Mbti(description) values("INFP");
INSERT INTO Mbti(description) values("INTP");
INSERT INTO Mbti(description) values("ESTP");
INSERT INTO Mbti(description) values("ESFP");
INSERT INTO Mbti(description) values("ENFP");
INSERT INTO Mbti(description) values("ENTP");
INSERT INTO Mbti(description) values("ESTJ");
INSERT INTO Mbti(description) values("ESFJ");
INSERT INTO Mbti(description) values("ENFJ");
INSERT INTO Mbti(description) values("ENTJ");
INSERT INTO Mbti(description) values("모름");


-- Genders Table
INSERT INTO Genders(gender_id, description) VALUES(1, "남자끼리");
INSERT INTO Genders(gender_id, description) VALUES(2, "여자끼리");
INSERT INTO Genders(gender_id, description) VALUES(3, "혼성");
INSERT INTO Genders(gender_id, description) VALUES(4, "남자끼리, 여자끼리");
INSERT INTO Genders(gender_id, description) VALUES(5, "남자끼리, 혼성");
INSERT INTO Genders(gender_id, description) VALUES(6, "여자끼리, 혼성");
INSERT INTO Genders(gender_id, description) VALUES(7, "남자끼리, 여자끼리, 혼성");

-- Weathers Table
INSERT INTO Weathers(weather_id, description) VALUES(1, "맑음");
INSERT INTO Weathers(weather_id, description) VALUES(2, "비");
INSERT INTO Weathers(weather_id, description) VALUES(3, "눈");
INSERT INTO Weathers(weather_id, description) VALUES(4, "맑음, 비");
INSERT INTO Weathers(weather_id, description) VALUES(5, "맑음, 눈");
INSERT INTO Weathers(weather_id, description) VALUES(6, "비, 눈");
INSERT INTO Weathers(weather_id, description) VALUES(7, "맑음, 비, 눈");

-- Categories Table
INSERT INTO Categories(category_id, description) VALUES(1, "여행");
INSERT INTO Categories(category_id, description) VALUES(2, "맛집");
INSERT INTO Categories(category_id, description) VALUES(3, "카페");
INSERT INTO Categories(category_id, description) VALUES(4, "예술");
INSERT INTO Categories(category_id, description) VALUES(5, "액티비티");
INSERT INTO Categories(category_id, description) VALUES(6, "여행, 액티비티");

--MemberCnt Table
INSERT INTO MemberCnt(member_id, description) VALUES(1, "1명");
INSERT INTO MemberCnt(member_id, description) VALUES(2, "2명");
INSERT INTO MemberCnt(member_id, description) VALUES(3, "4명 미만");
INSERT INTO MemberCnt(member_id, description) VALUES(4, "4명 이상");
INSERT INTO MemberCnt(member_id, description) VALUES(5, "1명, 2명, 4명 미만, 4명 이상");
INSERT INTO MemberCnt(member_id, description) VALUES(6, "2명, 4명 미만");


-- ReviewWeathers
INSERT INTO ReviewWeathers(r_weather_id, description) VALUES(1, "맑음");
INSERT INTO ReviewWeathers(r_weather_id, description) VALUES(2, "비");
INSERT INTO ReviewWeathers(r_weather_id, description) VALUES(3, "눈");
INSERT INTO ReviewWeathers(r_weather_id, description) VALUES(4, "흐림");
INSERT INTO ReviewWeathers(r_weather_id, description) VALUES(5, "기억안남");