const {
  checkDuplicateOfEmail,
  checkDuplicateOfNickname,
  getuserPasswordAndId,
} = require('../controllers/utils/user');

jest.mock('../models/index');
const { pool } = require('../models/index');
describe('registUser', () => {
  const next = jest.fn();
  test('회원가입시 Email이 중복되지 않을때', async () => {
    await pool.query.mockReturnValue(Promise.resolve([[]]));
    const result = await checkDuplicateOfEmail('skjfsdlk@slfkjsd.com', next);
    expect(result).toEqual(undefined);
  });

  test('회원가입시 이메일이 중복되어 있을때', async () => {
    await pool.query.mockReturnValue(
      Promise.resolve([
        [
          {
            user_id: 40,
          },
        ],
      ])
    );
    const result = await checkDuplicateOfEmail('skjfsdlk@slfkjsd.com', next);
    expect(result).toEqual({ user_id: 40 });
  });

  test('회원가입시 닉네임이 중복되어 있을때', async () => {
    await pool.query.mockReturnValue(Promise.resolve([[]]));
    const result = await checkDuplicateOfNickname('Test', next);
    expect(result).toEqual(undefined);
  });
  test('회원가입시 닉네임이 중복되어있지 않을때', async () => {
    await pool.query.mockReturnValue(Promise.resolve([[{ nick: test }]]));
    const result = await checkDuplicateOfNickname('Test', next);
    expect(result).toEqual({ nick: test });
  });
});
describe('loginUser', () => {
  test('유저가 Email을 정확히 입력했을 때', async () => {
    await pool.query.mockReturnValue(Promise.resolve([[{ email: test }]]));
    const result = await getuserPasswordAndId('Test');
    expect(result).toEqual([{ email: test }]);
  });
  test('유저가 Email을 정확히 입력하지 않았을 때', async () => {
    await pool.query.mockReturnValue(Promise.resolve([[]]));
    const result = await getuserPasswordAndId('Test');
    expect(result).toEqual([]);
  });
});
