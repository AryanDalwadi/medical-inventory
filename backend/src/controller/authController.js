const { successResponse } = require('../utils/apiResponse');
const authService = require('../service/authService');

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, 'Login successful', result);
  } catch (error) {
    return next(error);
  }
}

module.exports = { login };
