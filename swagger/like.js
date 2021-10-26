/**
 * @swagger
 * /posts/{id}/likes:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Like
 *     name: 좋아요 추가
 *     summary: 좋아요 추가
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
 *         description: 좋아요 추가 완료.
 *       '400':
 *         description: DB관련 에러
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Like
 *     name: 좋아요 취소
 *     summary: 좋아요 취소
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
 *         description: 좋아요 취소 완료.
 *       '400':
 *         description: DB관련 에러
 */
