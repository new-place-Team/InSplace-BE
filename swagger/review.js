/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Comment
 *     name: 댓글 작성
 *     summary: 댓글 작성
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: object
 *           properties:
 *             commentContent:
 *               type: string
 *               description: 댓글 내용
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             commentContent:
 *               type: String
 *               description: 댓글 내용
 *           example:
 *             commentContent: "댓글 작성 테스트입니다."
 *     responses:
 *       '201':
 *         description: 댓글 등록 완료.
 *       '400':
 *         description: DB관련 에러
 *       '500':
 *         description: 예상하지 못한 에러
 * /posts/{postId}/comments/{commentId}:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Comment
 *     name: 댓글 수정
 *     summary: 댓글 수정
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *       - name: commentId
 *         in: path
 *         required: true
 *         default: 1399
 *         schema:
 *           type: Number
 *           description: 게시글의 해당 댓글 고유 아이디
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             commentContent:
 *               type: String
 *               description: 해당 댓글 수정 내용
 *           example:
 *             commentContent: "댓글수정 테스트입니다."
 *     responses:
 *       '200':
 *         description: 댓글 수정 완료.
 *       '401':
 *         description: 권한이 없을 때(잘못된 접근이거나, 본인의 글이 아닐 때)
 *       '500':
 *         description: 예상하지 못한 에러
 *   delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Comment
 *     summary: 댓글 삭제
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *       - name: commentId
 *         in: path
 *         required: true
 *         default: 1399
 *         schema:
 *           type: Number
 *           description: 게시글의 해당 댓글 고유 아이디
 *     responses:
 *       '200':
 *         description: 해당 댓글 삭제 완료
 *       '400':
 *         description: DB 관련 에러 발생
 *       '401':
 *         description: 권한이 없을 때(잘못된 접근이거나, 본인의 글이 아닐 때)
 *       '500':
 *         description: 예상하지 못한 에러 발생
 */
