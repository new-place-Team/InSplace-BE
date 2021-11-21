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
 * /feedbacks:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 유저 피드백 추가
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *            description:
 *              type: string
 *              description: 피드백 내용
 *     responses:
 *       '201':
 *         description: 유저 피드백 추가 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Serve Error
 */
