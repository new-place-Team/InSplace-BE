/**
 * @swagger
 * /main:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 메인 페이지 조회
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 * /favorites:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 찜한 포스트 조회
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 * /visitedPosts:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 가본 리스트 조회
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 */
