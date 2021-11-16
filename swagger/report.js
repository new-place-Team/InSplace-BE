/**
 * @swagger
 * /posts/{postId}/reviews/{reviewId}/reports:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Review
 *     summary: 신고하기
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
 *         default: 272
 *         schema:
 *           type: Number
 *           description: 해당 리뷰 고유 아이디
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *            toUserId:
 *              type: number
 *              description: 신고를 받은 유저 아이디
 *            categoryNum:
 *              type: number
 *              description: 신고 유형 번호
 *            description:
 *              type: string
 *              description: 신고 내용
 *           example:
 *             toUserId: 81
 *             categoryNum: 2
 *             description: "신고한 내용입니다 ㅎㅎ."
 *     responses:
 *       '201':
 *         description: Report DB에 추가 성공
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: 로그인 권한이 없을 경우
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 */
