/**
 * @swagger
 * users/{userId}/posts/{postId}/visitedPosts:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - visitedPosts
 *     name: 가본 장소 리스트에 추가
 *     summary: 가본 장소 리스트에 추가
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 유저 고유 아이디
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *     responses:
 *       '201':
 *         description: 가본 장소 리스트에 추가 완료
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - visitedPosts
 *     name: 가본 장소 리스트에서 삭제
 *     summary: 가본 장소 리스트에서 삭제
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 유저 고유 아이디
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *     responses:
 *       '200':
 *         description: 가본 장소 리스트에서 삭제 완료
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 */
