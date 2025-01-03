const router = require('express').Router();
const Auth = require('../middlewares/restrict');
const logbook = require('../controllers/logbook');
const multer = require('multer');
const fileFilter = (req, file, cb) => {
    const allowedMimes = [ 'application/pdf'];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type Only PDF file are allowed'), false);
    }
  };
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});




router.post('/make-logbook', Auth.dosen, logbook.makeLogbook);
router.get('/logbook', Auth.allUser, logbook.getLogbook);
router.post('/logbook/:id/create', Auth.mahasiswa, upload.single('buktiKegiatan'), logbook.makeLogbookDetail,)
router.get('/logbook-mahasiswa', Auth.dosen, logbook.getLogbookDetail);


module.exports = router;