const Video = require('../models/Video');

// Get all videos with optional category filter
exports.getAllVideos = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'All' ? { category } : {};
    const videos = await Video.find(query).sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get a single video
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        status: 'fail',
        message: 'Video not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: video
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create a new video
exports.createVideo = async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({
      status: 'success',
      data: video
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Like a video
exports.likeVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        status: 'fail',
        message: 'Video not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: video
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Increment video views
exports.incrementViews = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({
        status: 'fail',
        message: 'Video not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: video
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
