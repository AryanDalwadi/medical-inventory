const { errorResponse } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  return errorResponse(res, message, statusCode);
}

module.exports = errorHandler;
