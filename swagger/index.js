/**
 * @swagger
 * /main:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 메인 페이지 조회
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 * /favorites:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 찜한 포스트 조회
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 * /visitedPosts:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 가본 리스트 조회
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 * /feedbacks:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: 유저 피드백 추가
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *            description:
 *              type: string
 *              description: 피드백 내용
 *            phoneNumber:
 *              type: string
 *              description: 유저 핸드폰 번호(옵션)
 *           example:
 *             phoneNumber: "010-2514-0552"
 *             description: "예시로 작성된 피드백 내용!"
 *     responses:
 *       '201':
 *         description: 유저 피드백 추가 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Serve Error
 * /main/maps?x={x}&y={y}:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *      - Index
 *     summary: nav에서 현재 위치 기준 5km 이내 검색
 *     parameters:
 *       - name: x
 *         in: query
 *         description: 위도(x)
 *         default: 37.51350
 *         schema:
 *           type: string
 *       - name: y
 *         in: query
 *         description: 경도(y)
 *         default: 127.10009
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: 데이터 불러오기 성공
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error(백엔드 문제)
 */
