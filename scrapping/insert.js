const axios = require('axios');

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '52.79.162.82',
  user: 'newPlace',
  password: '12345',
  database: 'new_place',
});
//정보들
const loadAddress = '서울특별시 종로구 세종로 사직로 161';
const storeName = '종로구 청계천';

axios
  .get(
    encodeURI(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${loadAddress}`
    ),
    {
      headers: {
        Authorization: 'KakaoAK c5b22a4795f62ae5790a2f735f2f0ffc',
      },
    }
  )
  .then((Response) => {
    x = Response.data.documents[0].x; //위도
    y = Response.data.documents[0].y; //경도
    console.log(x, y);
  })
  .catch((Error) => {
    console.log(Error);
  });

// 좌표를 기점으로 주변 시설 검색

// //데이터베이스에 중복제거
// db.query(
//   'DELETE a FROM Posts a, Posts b WHERE a.post_id > b.post_id AND a.title = b.title',
//   (err, data) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(data);
//     }
//   }
// );
