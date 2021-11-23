const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const userUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'halimg',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: 'original',
        key: function (req, file, cb) {
          const userId = req.user //미들웨어 통과한 유저이름 받아오기
          const ext = path.extname(file.originalname); //올린 사진의 확장자 확인
          const uploadFile = `userImg/${userId}${ext}`
          cb(null, uploadFile); 
        },
        transform: function (req, file, cb) {
          //사진을 잘라내어 압축.. 해당 코드 리뷰필요...
          cb(null, sharp()
            .resize(600, 600)
            .jpeg({quality: 75})
            .withMetadata()
            );
        },
      },
    ],
  }),
});
module.exports = userUpload;