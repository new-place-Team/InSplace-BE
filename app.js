const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const logger = require('./config/logger');
const compression = require('compression');
require('dotenv').config;

/* morgan setting */
const morgan = require('morgan');
const combined =
  ':remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';
// 기존 combined 포멧에서 timestamp만 제거
// NOTE: morgan 출력 형태 server.env에서 NODE_ENV 설정 production : 배포 dev : 개발
const morganFormat = process.env.NODE_ENV !== 'production' ? combined : 'dev';
logger.info(`Current NODE_ENV: ${morganFormat}`);
app.use(morgan(morganFormat, { stream: logger.stream })); // morgan 로그 설정
app.use(compression());
app.use(helmet());
//CORS
const cors = require('cors');
const corsOptions = {
  origin: '*',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  preflightContinue: false,

  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return res.status(404).send('404 NOT FOUND');
});

// error handler
app.use(function (err, req, res, next) {
  logger.error(`${err.stack}`);
  return res.status(err.status).json({ errMsg: err.message });
});

module.exports = app;
