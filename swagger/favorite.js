/**
 * @swagger
 * /posts/{postId}/favorites:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Favorites
 *     name: 찜 목록에 추가
 *     summary: 찜 목록에 추가
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *     responses:
 *       '201':
 *         description: 찜 목록에 추가 완료
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Favorites
 *     name: 찜 목록에서 삭제
 *     summary: 찜 목록에서 삭제
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *     responses:
 *       '200':
 *         description: 찜 목록에서 삭제 완료
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 */
