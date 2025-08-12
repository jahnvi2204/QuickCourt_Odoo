const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack });
  const status = err.status || 500;
  res.status(status).json({
    message: status === 500 ? 'Internal server error' : err.message,
  });
};


