/**
 * @swagger
 * /search/maps/total?result={result}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Map
 *     summary: 토탈 결과 페이지 조회(map용)
 *     parameters:
 *       - name: result
 *         in: query
 *         required: true
 *         default: "카페"
 *         schema:
 *           type: string
 *           description: 검색어
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error(백엔드 문제)
 * /search/maps/condition?weather={weather}&category={category}&num={num}&gender={gender}&inside={inside}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Map
 *     summary: 조건 결과 상세 페이지 조회(실내/실외 구분, map용)
 *     parameters:
 *       - name: weather
 *         in: query
 *         required: true
 *         description: 1 - 맑음 | 2-  비 | 3- 눈
 *         default: 2
 *         schema:
 *           type: weather
 *       - name: category
 *         in: query
 *         required: true
 *         description: 1 - 여행 | 2 - 맛집 | 3 - 카페 | 4 - 예술 | 5 - 액티비티
 *         default: 3
 *         schema:
 *           type: category
 *       - name: num
 *         in: query
 *         required: true
 *         description: 1 - 1명 | 2 - 2명 | 3 - 4명 미만 | 4 - 4명 이상
 *         default: 1
 *         schema:
 *           type: Number
 *       - name: gender
 *         in: query
 *         required: true
 *         description: 1 - 남자끼리| 2 - 여자끼리| 3 - 혼성
 *         default: 3
 *         schema:
 *           type: Number
 *       - name: inside
 *         in: query
 *         required: true
 *         description: 실내 - 1 | 실외 - 0
 *         default: 1
 *         schema:
 *           type: Number
 *       - name: x
 *         in: query
 *         description: 위도(x)
 *         default: 37.51350
 *         schema:
 *           type: string
 *       - name: y
 *         in: query
 *         description: 경도(y)
 *         default: 127.10009
 *         schema:
 *           type: string
 *       - name: area
 *         in: query
 *         description: 서울 지역
 *         default: 관악구
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error(백엔드 문제)
 */
