const request = require('supertest');
// const { addFavorite } = require('../controllers/favorite');
const app = require('../app');
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNSwiaWF0IjoxNjM2MzQ4OTAyfQ.Umw-hnUz-AhBQVl0_0bZRJq_5HR40Cz0pyxnm9jkZfE`;

describe('add Favorite', () => {
  test('should return a 201 status code', async () => {
    const response = await request(app)
      .post('/posts/4/favorites')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toEqual(201);
  });
});
