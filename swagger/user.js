/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *      - User
 *     summary: 회원 등록
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *            email:
 *              type: string
 *              description: 이메일
 *            nickname:
 *              type: string
 *              description: 닉네임
 *            password:
 *              type: string
 *              description: 비밀번호
 *            male_yn:
 *              type: number
 *              description: 성별 여부
 *            mbti_id:
 *              type: number
 *              description: mbti 고유번호
 *           example:
 *             email: "najongsi@gmail.com"
 *             nickname: "developerwan"
 *             password: "asdasd"
 *             male_yn: 1
 *             mbti_id: 2
 *     responses:
 *       '201':
 *         description: 회원 등록 성공
 *       '200':
 *         description: 이메일 형식, 비밀번호 4자 이상, 이메일 혹은 닉네임이 중복될 경우
 *       '400':
 *         description: Bad Request
 * /users/auth:
 *   post:
 *     tags:
 *       - User
 *     summary: 로그인 기능(사용 가능)
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: 유저 이메일
 *             password:
 *               type: string
 *               description: 유저 비밀번호
 *           example:
 *             email: "najongsi@gmail.com"
 *             password: "asdasd"
 *     responses:
 *       '201':
 *         description: 로그인 성공
 *       '200':
 *         description: 아이디 또는 패스워드 불일치
 *       '400':
 *         description: 로그인 기능 중, 예상치 못한 에러 발생
 */
