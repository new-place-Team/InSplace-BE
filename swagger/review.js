/**
 * @swagger
 * /posts/{postId}/reviews:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     consumes:
 *      - multipart/form-data
 *     tags:
 *      - Review
 *     summary: 리뷰 추가
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *       - name: reviewImages
 *         in: formData
 *         description: Upload multiple files
 *         type: array
 *         items:
 *           type: file
 *         collectionFormat: multi
 *       - name: reviewDesc
 *         in: formData
 *         default: Hello Everyone I am Jongwan Ra
 *         type: string
 *         description: 리뷰 글
 *       - name: weekdayYN
 *         in: formData
 *         default: 1
 *         type: Number
 *         description: 평일 1 주말 0
 *       - name: revisitYN
 *         in: formData
 *         default: 1
 *         type: Number
 *         description: 재방문 1 반대 0
 *     responses:
 *       '201':
 *         description: Review 데이터 추가 성공
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: 로그인 권한이 없을 경우
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 * /posts/{postId}/reviews/{reviewId}:
 *   patch:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Review
 *     summary: 리뷰 수정
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
 *           description: 해당 리뷰 고유 아이디
 *     responses:
 *       '201':
 *         description: 해당 리뷰 수정 완료
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: 로그인 권한이 없을 경우
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 */
