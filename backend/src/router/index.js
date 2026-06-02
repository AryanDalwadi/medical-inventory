const express = require('express');
const userRouter = require('./userRouter');
const authRouter = require('./authRouter');
const groupRouter = require('./groupRouter');
const menuRouter = require('./menuRouter');

const router = express.Router();


router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/groups', groupRouter);
router.use('/menus', menuRouter);

module.exports = router;
