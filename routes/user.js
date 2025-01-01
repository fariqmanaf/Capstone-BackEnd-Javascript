// src/routes/user.js
const router = require('express').Router();
const UserController = require('../controllers/user');
const Auth = require('../middlewares/restrict');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure multer for multiple files
const uploadFields = upload.fields([
  { name: 'transkripNilai', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]);

// Routes
router.post('/change-password', Auth.userParams, UserController.changePassword);
router.get('/profile', Auth.userParams, UserController.getProfile);
router.post('/upload-document', Auth.userParams, uploadFields, UserController.uploadDocuments);

module.exports = router;