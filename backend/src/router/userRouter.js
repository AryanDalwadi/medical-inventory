const express = require('express');
const validate = require('../middleware/validate');
const authenticateToken = require('../middleware/auth');
const { insertUserSchema, getUsersQuerySchema, searchUsersSchema } = require('../validation/userValidation');
const userController = require('../controller/userController');

const router = express.Router();

router.get(
  '/',
  authenticateToken,
  validate(getUsersQuerySchema, 'query'),
  userController.getUsers
);

router.post(
  '/search',
  authenticateToken,
  validate(searchUsersSchema),
  userController.getUsers
);

router.post(
  '/',
  authenticateToken,
  validate(insertUserSchema),
  userController.insertUser
);

module.exports = router;
