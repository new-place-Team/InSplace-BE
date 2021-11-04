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
 *       - name: weather
 *         in: formData
 *         default: 1
 *         type: Number
 *         description: 날씨 1~ 5번 중 한 가지
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
 *   put:
 *     security:
 *      - bearerAuth: []
 *     consumes:
 *      - multipart/form-data
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
 *           description: 해당 리뷰 아이디
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
 *       - name: weather
 *         in: formData
 *         default: 1
 *         type: Number
 *         description: 날씨 1~ 5번 중 한 가지
 *     responses:
 *       '201':
 *         description: Review 데이터 수정 성공
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
 *      - Review
 *     summary: 리뷰 삭제
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
 *         description: Review 삭제 성공
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: 로그인 권한이 없을 경우
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 * /posts/{postId}/reviews/{reviewId}/likes:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Review
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
 *      - Review
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
 * /posts/{postId}/reviews/pages/{num}/order/1:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Review
 *     summary: 리뷰 리스트(최신순)
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *       - name: num
 *         in: path
 *         required: true
 *         default: 1
 *         schema:
 *           type: Number
 *           description: page Number
 *     responses:
 *       '200':
 *         description: 리뷰 최신순으로 불러오기 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 * /posts/{postId}/reviews/pages/{num}/order/2:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Review
 *     summary: 리뷰 리스트(추천순)
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         default: 4
 *         schema:
 *           type: Number
 *           description: 해당 게시글 고유 아이디
 *       - name: num
 *         in: path
 *         required: true
 *         default: 1
 *         schema:
 *           type: Number
 *           description: page Number
 *     responses:
 *       '200':
 *         description: 리뷰 추천순으로 불러오기 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error(서버쪽 문제)
 */
