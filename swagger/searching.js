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
 *       '500':
 *         description: Internal Server Error(백엔드 문제)
 * /search/page/{number}/condition?weather={weather}&category={category}&num={num}&gender={gender}&inside={inside}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Search
 *     summary: 조건 결과 상세 페이지 조회(실내/실외 구분)
 *     parameters:
 *       - name: number
 *         in: path
 *         required: true
 *         default: 1
 *         schema:
 *           type: Number
 *           description: 페이지 수
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
 *       - name: inside
 *         in: query
 *         required: true
 *         default: 1
 *         schema:
 *           type: Number
 *           description: 실내인지 실외인지 여부
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error(백엔드 문제)
 */
