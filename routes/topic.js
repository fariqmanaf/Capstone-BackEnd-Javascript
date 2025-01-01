const router = require('express').Router();
const Auth = require('../middlewares/restrict');
const TopicController = require('../controllers/topic');


router.post('/create-topic', Auth.dosen, TopicController.createTopic);
router.get('/topic', Auth.allUser, TopicController.getAllTopic);
router.get('/topic/:id', Auth.allUser, TopicController.getTopicById);
router.delete('/delete-topic/:id', Auth.dosen, TopicController.deleteTopic);
router.post('/create-topic/:topicId', Auth.mahasiswa, TopicController.createTopikDetail);


module.exports = router;