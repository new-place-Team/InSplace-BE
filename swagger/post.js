/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Post
 *     summary: 상세 페이지 조회
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 */
