#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require('../app');
const debug = require('debug')('new-place-be:server');
const http = require('http');
const logger = require('../config/logger');
const schedule = require('node-schedule');
const { schedulingWeather } = require('../controllers/weatherScheduler');
require('dotenv').config();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  logger.info(`${process.env.PORT}번 포트로 서버가 켜졌습니다.`);
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);

  if (process.env.NODE_ENV === 'production') {
    schedule.scheduleJob('*/1 * * * *', function () {
      schedulingWeather();
      logger.info('날씨 상태 업데이트 완료');
      console.log('스케쥴러 실행, 날씨 변경완료.')
    });
  }
}
