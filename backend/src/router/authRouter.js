const express = require('express');
const validate = require('../middleware/validate');
const { loginSchema } = require('../validation/authValidation');
const authController = require('../controller/authController');

const router = express.Router();

router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
