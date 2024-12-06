const express = require('express');
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideo);
router.post('/:id/view', videoController.incrementViews);

// Protected routes
router.use(protect);

router.post('/', videoController.createVideo);
router.patch('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);
router.post('/:id/like', videoController.likeVideo);

module.exports = router;
