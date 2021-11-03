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
 * /posts/{id}/visited:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Post
 *     summary: 가본 장소 리스트에 추가
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *     responses:
 *       '201':
 *         description: 가본 장소 리스트 추가 완료
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: 로그인 권한이 없을 경우
 */
