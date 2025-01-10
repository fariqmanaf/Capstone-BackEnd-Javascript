const router = require('express').Router();
const authRouter = require('./auth');
const userRouter = require('./user');
const logbookRouter = require('./logbook');
const topicRouter = require('./topic');
const absensiRouter = require('./absensi');

router.use(authRouter);
router.use(userRouter);
router.use(logbookRouter);
router.use(topicRouter);
router.use(absensiRouter);

module.exports = router;