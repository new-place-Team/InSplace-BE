/* 통합 테스트 예시 */

/* const request = require('supertest');
const app = require('../app');
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNSwiaWF0IjoxNjM2MzQ4OTAyfQ.Umw-hnUz-AhBQVl0_0bZRJq_5HR40Cz0pyxnm9jkZfE`;

describe('add Favorite', () => {
  test('should return a 201 status code', async () => {
    const response = await request(app)
      .post('/posts/2/favorites')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
  });
});
 */

/* 

describe('regist', () => {
  test('회원가입 성공', (done) => {
    request(app)
      .post('/users/register')
      .send({
        email: 'rlarlxo@naver.com',
        nickname: 'rlarlxo',
        password: 'test12344',
        maleYN: 1,
        mbtiId: 2,
      })
      .expect(201, done);
  });
*/
