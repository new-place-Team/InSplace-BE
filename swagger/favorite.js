/**
 * @swagger
 * /posts/{id}/favorites:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Favorite
 *     name: 찜하기 추가
 *     summary: 찜하기 추가
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
 *         description: 찜하기 추가 완료.
 *       '400':
 *         description: DB관련 에러
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Favorite
 *     name: 찜하기 취소
 *     summary: 찜하기 취소
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
 *         description: 찜하기 취소 완료.
 *       '400':
 *         description: DB관련 에러
 */
