const axios = require('axios');

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '52.79.162.82',
  user: 'newPlace',
  password: '12345',
  database: 'new_place',
});
//정보들
const loadAddress = '서울 종로구 창신동';
const storeName = '종로구 청계천';
const imageUrl =
  'https://lh3.googleusercontent.com/NL5NDEwMrbp7aGve6qNPfbZ1mU4kvr02k9inxjP-M6jQp9qBX1LHYf6FCe8oPfsPihPvinyvsXarsVC-crqpNFfA71WvclPrsMZHhvFp8OhhHt67ckA8zMewHnuS83f9-6QxmqtltDrwu23W2tp5aSZJhFKPQdwa2KK7S8kJbEoBDHTUjnsRVKsgkCal-pkE1E4kUq6_H8l-QpZeFYaPHW_CVd5i2llYk9TJp0zdZcJoR7JKaoikqz-vIKG1DxutoSMTKs7qswZnYM1r8J9aLixTEsQqKUGoPLy7xGWHGUKvrghcvfQTAf87NLB06TbJEpuqUMt8_yWbBaN6dGJCNyod_Tl6d81rJmpaOHoD3sEC9RycJV7ZqtNvZo1Z4-lyoD7eoP6QwGmZJXi3G8XTR1NWrHMGWIdh9f7pRaVF7CpZF9frE3VmWwZmjXLTKLzegcfURu7nifsic35tzX5o9Mp6WZ7rgkZET5XVHc1px3ovPqsAOeMBpm5jc-3C5EXvh_XnRBSYSVtqP8Ry9iOLpygdEVobLSWENTyLs-riNe8IDMkd2LbrMQyw6Uup9_UsisBHVOUUH0pSnf28OBPw5Nf6gaR6u-QgM92UtogT9AVhStrgKqz8BaU_xHo5AAutyDHNdwKCiPhHQzbQFzwsX_GgWWCId93-Im2VpqOox-QSDUPlEfN_CD4sO6ecVpBqF8Ou0Q6PaKABWJPdY9lYJrfMdQ=w461-h346-no?authuser=0';
const localDescription = '청계천요';

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
        const data = response.data.documents[0];
        const [Seoul, Goo] = response.data.documents[0].address_name.split(' ');
        const SeoulGoo = `${Seoul} ${Goo}`;
        const query = `INSERT INTO Posts
        (title, address, address_short, contact_number, category_id, post_images, post_desc, post_loc_x, post_loc_y,
           weather_id, inside_yn, gender_id, member_id ) 
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const params = [
          data.place_name,
          loadAddress,
          SeoulGoo,
          data.phone,
          1,
          imageUrl,
          localDescription,
          data.x,
          data.y,
          1,
          1,
          1,
          1,
        ];

        await pool.query(query, params);
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
