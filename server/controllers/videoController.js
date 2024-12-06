const Video = require('../models/video');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllVideos = catchAsync(async (req, res) => {
  const { category } = req.query;
  
  const query = category && category !== 'All' 
    ? { category } 
    : {};

  const videos = await Video.find(query)
    .sort('-createdAt')
    .populate('user', 'name');

  res.status(200).json({
    status: 'success',
    results: videos.length,
    data: videos
  });
});

exports.getVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findById(req.params.id)
    .populate('user', 'name');

  if (!video) {
    return next(new AppError('No video found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: video
  });
});

exports.createVideo = catchAsync(async (req, res) => {
  const newVideo = await Video.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: newVideo
  });
});

exports.updateVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!video) {
    return next(new AppError('No video found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: video
  });
});

exports.deleteVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndDelete(req.params.id);

  if (!video) {
    return next(new AppError('No video found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.likeVideo = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  if (!video) {
    return next(new AppError('No video found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: video
  });
});

exports.incrementViews = catchAsync(async (req, res, next) => {
  const video = await Video.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!video) {
    return next(new AppError('No video found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: video
  });
});
