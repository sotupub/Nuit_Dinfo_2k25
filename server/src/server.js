require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const corsMiddleware = require('./config/cors');
const connectDB = require('./config/database');
const { securityMiddleware } = require('./middleware/security');
const logger = require('./config/logger');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(corsMiddleware); // Apply CORS middleware first
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(compression()); // Compress response bodies
securityMiddleware(app); // Apply security middleware

// Import routes
const authRoutes = require('./routes/authRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const quizRoutes = require('./routes/quizRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userStatsRoutes = require('./routes/userStatsRoutes');
const progressRoutes = require('./routes/progressRoutes');
const videoRoutes = require('./routes/videoRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api', userStatsRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
