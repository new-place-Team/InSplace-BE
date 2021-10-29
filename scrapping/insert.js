const axios = require('axios');

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '52.79.162.82',
  user: 'newPlace',
  password: '12345',
  database: 'new_place',
});
//정보들
const loadAddress = '서울특별시 옥인동';
const storeName = '서울 인왕산';
const localDescription = '청계천요';
const category_id = 1;
const weather_id = 1;
const inside_yn = 1;
const gender_id = 1;
const member_id = 1;

// axios
//   .get(
//     encodeURI(
//       `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=127.1074078&y=37.50915365&input_coord=WGS84`
//     ),
//     {
//       headers: {
//         Authorization: 'KakaoAK c5b22a4795f62ae5790a2f735f2f0ffc',
//       },
//     }
//   )
//   .then((Response) => {
//     console.log(Response.data.documents);
//   });

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
    axios
      .get(
        encodeURI(
          `https://dapi.kakao.com/v2/local/search/keyword.json?y=${y}&x=${x}&radius=2000&query=${storeName}`
        ),
        {
          headers: {
            Authorization: 'KakaoAK c5b22a4795f62ae5790a2f735f2f0ffc',
          },
        }
      )
      .then(async (response) => {
        console.log(response.data.documents[0]);
        // const data = response.data.documents[0];
        // const [Seoul, Goo] = response.data.documents[0].address_name.split(' ');
        // const SeoulGoo = `${Seoul} ${Goo}`;
        // const query = `INSERT INTO Posts
        // (title, address, address_short, contact_number, category_id, post_desc, post_loc_x, post_loc_y,
        //    weather_id, inside_yn, gender_id, member_id )
        //    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;
        // const params = [
        //   storeName,
        //   loadAddress,
        //   SeoulGoo,
        //   data.phone,
        //   category_id,
        //   localDescription,
        //   data.x,
        //   data.y,
        //   weather_id,
        //   inside_yn,
        //   gender_id,
        //   member_id,
        // ];

        // await pool.query(query, params);
      })
      .catch((Error) => {
        console.log(Error);
      });
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
