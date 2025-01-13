const router = require('express').Router();
const Auth = require('../middlewares/restrict');
const TopicController = require('../controllers/topic');


router.post('/create-topic', Auth.dosen, TopicController.createTopic);
router.get('/topic', Auth.allUser, TopicController.getAllTopic);
router.get('/topic/:id', Auth.allUser, TopicController.getTopicById);
router.delete('/delete-topic/:id', Auth.dosen, TopicController.deleteTopic);
router.post('/create-topic/:topikId', Auth.mahasiswa, Auth.uploadDokumen, TopicController.createTopikDetail);
router.put('/update-topic/:id', Auth.dosen, TopicController.updateTopic);
router.get('/get-role/:id', Auth.dosen, TopicController.getRole);
router.get('/pendaftar-topic', Auth.dosen, TopicController.getPendaftarTopic);
router.get('/pendaftar-topic/filter', Auth.dosen, TopicController.getPendaftarTopicFilter);
router.get('/pendaftar-topic-acc', Auth.dosen, TopicController.getPendaftarTopicAcc);
router.get('/pendaftar-topic-acc/filter', Auth.dosen, TopicController.getPendaftarTopicAccFilter);
router.patch('/update-pendaftar-topic/:id', Auth.dosen, TopicController.updatePendaftarTopic);
router.delete('/delete-pendaftar-topic/:id', Auth.dosen, TopicController.deletePendaftarTopic);

module.exports = router;