const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const db = require("./db")

let server;

function initNotificationConnection(delaySecs = 0, maxAttempts = 1) {
  return new Promise((resolve, reject) => {
    const connect = () => {
      db.connect({
        direct: true,
        onLost: () => {
          console.log('Connection Lost');
        },
      })
        .then((obj) => {
          notificationConn = obj;
          return resolve(obj);
          // return addNotificationListener();
        })
        .catch((err) => {
          console.log('notification connection init error: ', err);
          maxAttempts = maxAttempts - 1;
          if (0 < maxAttempts) {
            initNotificationConnection(delaySecs, maxAttempts).then(resolve).catch(reject);
          } else {
            reject(err);
          }
        });
    };
    setTimeout(connect, 1000 * delaySecs);
  });
}

initNotificationConnection()
  .then(() => {
    logger.info('PostgreSQL DB connected');
    app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((err) => {
    console.log('failed to establish notification connection: ', err);
  });



const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});