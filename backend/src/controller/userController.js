const { successResponse } = require('../utils/apiResponse');
const userService = require('../service/userService');

async function insertUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 'User created successfully', user, 201);
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const filters = req.method === 'GET' ? req.query : req.body;
    const users = await userService.getUsers(filters);
    return successResponse(res, 'Users fetched successfully', users);
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const updatedUser = await userService.updateUser(userId, req.body);
    return successResponse(res, 'User updated successfully', updatedUser);
  } catch (error) {
    return next(error);
  }
}

module.exports = { insertUser, getUsers, updateUser };
