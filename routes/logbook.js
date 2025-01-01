const router = require('express').Router();
const Auth = require('../middlewares/restrict');
const logbook = require('../controllers/logbook');
// const multer = require('multer');


router.post('/make-logbook', Auth.dosen, logbook.makeLogbook);


module.exports = router;