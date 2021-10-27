/**
 * @swagger
 * /search/condition?weather={weather}&category={category}&num={num}&gender={gender}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Search
 *     summary: 조건 결과 페이지 조회
 *     parameters:
 *       - name: weather
 *         in: query
 *         required: true
 *         default: 2
 *         schema:
 *           type: weather
 *           description: 날씨 고유 번호
 *       - name: category
 *         in: query
 *         required: true
 *         default: 3
 *         schema:
 *           type: category
 *           description: 카테고리 고유 번호
 *       - name: num
 *         in: query
 *         required: true
 *         default: 1
 *         schema:
 *           type: Number
 *           description: 인원 수 고유 번호
 *       - name: gender
 *         in: query
 *         required: true
 *         default: 3
 *         schema:
 *           type: Number
 *           description: 성별 고유 번호
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 */
