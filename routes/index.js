const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const logbookRouter = require('./logbook');

router.use(authRouter);
router.use(userRouter);
router.use(logbookRouter);


module.exports = router;