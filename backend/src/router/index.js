const express = require('express');
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const groupRouter = require('./groupRouter');

const router = express.Router();


router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/groups', groupRouter);

module.exports = router;
