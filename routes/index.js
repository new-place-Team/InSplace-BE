const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const postRouter = require('./post');
const searchingRouter = require('./searching');
const adminRouter = require('./admin');
require('dotenv').config();

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// 배포용 및 로컬용 host 나누기
let host = `localhost:${process.env.PORT}`;
if (process.env.NODE_ENV === 'production') {
  host = process.env.DB_HOST;
}

const swaggerDefinition = {
  info: {
    title: 'new-place API',
    version: '1.0.0',
    description: 'new-place API 명세서',
  },
  host: host,
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./swagger/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
router.get('./swagger.json', (req, res) => {
  res.setHeader('content-Type', 'application/json');
  res.send(swaggerSpec);
});

router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/search', searchingRouter);
router.use('/admin', adminRouter);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
