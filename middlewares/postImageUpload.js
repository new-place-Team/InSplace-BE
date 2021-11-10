const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const fs = require('fs');
const { promisify } = require('util');
const convert = require('heic-convert');
require('dotenv').config();

/* HEIC TO PNG */
const convertHeicToPng = async (fileName) => {
  const front = fileName.split('.')[0];
  console.log('heic file name: ', fileName);

  const inputBuffer = await promisify(fs.readFile)(fileName);
  const outputBuffer = await convert({
    buffer: inputBuffer, // the HEIC file buffer
    format: 'PNG', // output format
  });

  await promisify(fs.writeFile)(`${front}.png`, outputBuffer);
  console.log('outBuffer', outputBuffer);
  return;
};

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  region: process.env.S3_BUCKET_REGION,
});

const postUpload = multer({
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
        key: async (req, file, cb) => {
          const ext = path.extname(file.originalname); //올린 사진의 확장자 확인
          if (ext === '.heic') {
            // console.log('originalname:', file.originalname);
            console.log('file:', file);
            console.log('req', req);
            await convertHeicToPng(`${file.originalname}`);
          }
          const uploadFile = `example/${file.originalname}`;
          console.log('ext: ', ext);
          console.log('uploadFile:', uploadFile);
          cb(null, uploadFile);
        },
        transform: function (req, file, cb) {
          //사진을 잘라내어 압축.. 해당 코드 리뷰필요...
          cb(null, sharp().resize(600, 600).withMetadata());
        },
      },
    ],
  }),
});
module.exports = postUpload;
