const router = require('express').Router();
const UserController = require('../controllers/user');
const Auth = require('../middlewares/restrict');

router.get('/profile', Auth.userParams, UserController.changePassword);

module.exports = router;