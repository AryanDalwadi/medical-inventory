const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/apiResponse');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return errorResponse(res, 'Access token required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
}

module.exports = authenticateToken;
