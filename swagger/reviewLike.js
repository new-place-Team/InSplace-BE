/**
 * @swagger
 * /posts/{postId}/reviews/{reviewId}/likes:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - ReviewLike
 *     summary: 리뷰 좋아요 추가
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *       - name: reviewId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 리뷰 아이디
 *     responses:
 *       '201':
 *         description: 좋아요 성공
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: 로그인 권한이 없을 경우
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - ReviewLike
 *     summary: 리뷰 좋아요 취소
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *       - name: reviewId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 리뷰 아이디
 *     responses:
 *       '200':
 *         description: 좋아요 취소
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: 로그인 권한이 없을 경우
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 */
