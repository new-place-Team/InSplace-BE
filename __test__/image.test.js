require('dotenv').config();
const {
  convertBodyImageArrToText,
  convertImageArrToText,
  getMainImage,
} = require('../controllers/utils/image');

/* S3 업로드 후 받아온 req.files 모킹 데이터 */
const mockingS3Data = [
  {
    transforms: [
      {
        location:
          'https://halimg.s3.ap-northeast-2.amazonaws.com/reviews/1636379920120.jpeg',
      },
    ],
  },
  {
    transforms: [
      {
        location:
          'https://halimg.s3.ap-northeast-2.amazonaws.com/reviews/1636379920121.jpeg',
      },
    ],
  },
];
test('클라이언트로 부터 들어온 image 배열을 DB에 저장할 텍스트로 변환해 줍니다.', () => {
  const baseUrl = process.env.REVIEW_BASE_URL;
  expect(convertBodyImageArrToText([], baseUrl)).toEqual('');
  expect(
    convertBodyImageArrToText([`${baseUrl}1.png`, `${baseUrl}2.png`], baseUrl)
  ).toEqual('1.png&&2.png');
  expect(
    convertBodyImageArrToText(
      [`${baseUrl}1.png`, `${baseUrl}2.png`, `${baseUrl}3.png`],
      baseUrl
    )
  ).toEqual('1.png&&2.png&&3.png');
});

test('클라이언트로 부터 들어온 이미지 파일들을 S3로 업로드 시키고 받은 image 배열을 DB에 저장할 텍스트로 변환해 줍니다.', () => {
  const baseUrl = process.env.REVIEW_BASE_URL;
  expect(convertImageArrToText([], baseUrl)).toEqual('');
  expect(convertImageArrToText(mockingS3Data, baseUrl)).toEqual(
    '1636379920120.jpeg&&1636379920121.jpeg'
  );
});

test('DB에 들어있는 이미지들 중 대표 이미지만 String으로 변환시킵니다.', () => {
  const baseUrl = process.env.REVIEW_BASE_URL;
  expect(getMainImage('', baseUrl)).toEqual('');
  expect(getMainImage('1636379920120.jpeg', baseUrl)).toEqual(
    'https://halimg.s3.ap-northeast-2.amazonaws.com/reviews/1636379920120.jpeg'
  );
  expect(
    getMainImage('1636379920120.jpeg&&1636379920121.jpeg', baseUrl)
  ).toEqual(
    'https://halimg.s3.ap-northeast-2.amazonaws.com/reviews/1636379920120.jpeg'
  );
  expect(
    getMainImage(
      '1636379920120.jpeg&&1636379920121.jpeg&&1636379920123.jpeg',
      baseUrl
    )
  ).toEqual(
    'https://halimg.s3.ap-northeast-2.amazonaws.com/reviews/1636379920120.jpeg'
  );
});
