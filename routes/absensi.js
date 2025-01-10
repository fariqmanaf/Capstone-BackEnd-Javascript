const router = require('express').Router();
const Auth = require('../middlewares/restrict');
const AbsensiController = require('../controllers/absensi');

router.get('/absensi-mahasiswa', Auth.dosen, AbsensiController.getTopicByUser);
router.get('/absensi-mahasiswa/filter', Auth.dosen, AbsensiController.getMahasiswaByTopic);
module.exports = router;