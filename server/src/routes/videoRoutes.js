const express = require('express');
const videoController = require('../controllers/videoController');

const router = express.Router();

// Public routes
router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideo);
router.post('/', videoController.createVideo);
router.post('/:id/like', videoController.likeVideo);
router.post('/:id/view', videoController.incrementViews);

module.exports = router;
