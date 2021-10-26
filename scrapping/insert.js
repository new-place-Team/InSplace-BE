const axios = require('axios');
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: '52.79.162.82',
  user: 'newPlace',
  password: '12345',
  database: 'new_place',
});


axios
  .get(
    encodeURI(
      'https://dapi.kakao.com/v2/local/search/address.json?query=서울 강남구 테헤란로 지하 340'
    ),
    {
      headers: {
        Authorization: 'KakaoAK c5b22a4795f62ae5790a2f735f2f0ffc',
      },
    }
  )
  .then((Response) => {
    x = Response.data.documents[0].y; //위도
    y = Response.data.documents[0].x; //경도
    console.log(x, y);
  })
  .catch((Error) => {
    console.log(Error);
  });

//좌표를 기점으로 주변 시설 검색
// axios
//   .get(
//     encodeURI(
//       'https://dapi.kakao.com/v2/local/search/keyword.json?y=37.5663174209601&x=126.977829174031&radius=20000&query=여행'
//     ),
//     {
//       headers: {
//         Authorization: 'KakaoAK c5b22a4795f62ae5790a2f735f2f0ffc',
//       },
//     }
//   )
//   .then((Response) => {
//     Response.data.documents.forEach((data) => {
//       const [City, village] = data.road_address_name.split(' ');
// console.log(data.road_address_name);
// console.log(`${City} ${village}`);
// console.log(data.phone);
// console.log(data.place_name);
// console.log(data.x);
// console.log(data.y);
// connection.query(
//   'INSERT INTO Posts(title, address, contact_number, post_images, post_desc, post_loc_x, post_loc_y, noisy_yn, weather_yn ) VALUES (?,?,?,?,?,?,?,?,? );',
//   [
//     data.place_name,
//     data.road_address_name,
//     data.phone,
//     '이미지를 넣어주세요',
//     '장소에 대한 설명을 넣어주세요',
//     data.x,
//     data.y,
//     1,
//     1,
//   ]
// ),
//   (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(data);
//     }
//   };
//   });
// })
// .catch((Error) => {
//   console.log(Error);
// });

// 데이터베이스에 중복제거
// connection.query(
//   'DELETE a FROM Posts a, Posts b WHERE a.post_id > b.post_id AND a.title = b.title',
//   (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(data);
//     }
//   }
// );
