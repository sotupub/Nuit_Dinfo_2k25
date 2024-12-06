const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const logger = require('../config/logger');

// Get all quizzes
exports.getAllQuizzes = async (req, res) => {
  try {
    // Only fetch quizzes if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const quizzes = await Quiz.find();
    logger.info(`Fetched quizzes for user: ${req.user._id}`);
    res.json(quizzes);
  } catch (error) {
    logger.error('Error getting quizzes:', error);
    res.status(500).json({ message: 'Error retrieving quizzes' });
  }
};

// Get quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    // Only fetch quiz if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      logger.warn(`Quiz not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    logger.info(`Fetched quiz ${quiz._id} for user: ${req.user._id}`);
    res.json(quiz);
  } catch (error) {
    logger.error('Error getting quiz:', error);
    res.status(500).json({ message: 'Error retrieving quiz' });
  }
};

// Create new quiz
exports.createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    logger.info('New quiz created:', quiz._id);
    res.status(201).json(quiz);
  } catch (error) {
    logger.error('Error creating quiz:', error);
    res.status(400).json({ message: 'Error creating quiz' });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    logger.info('Quiz updated:', quiz._id);
    res.json(quiz);
  } catch (error) {
    logger.error('Error updating quiz:', error);
    res.status(400).json({ message: 'Error updating quiz' });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    // Also delete all attempts for this quiz
    await QuizAttempt.deleteMany({ quizId: req.params.id });
    logger.info('Quiz deleted:', req.params.id);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    logger.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Error deleting quiz' });
  }
};

// Submit quiz attempt
exports.submitQuizAttempt = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers must be an array' });
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    
    // Create formatted answers array for the attempt
    const formattedAnswers = answers.map(answer => {
      const { questionId, selectedAnswer } = answer;
      
      // Find the corresponding question in the quiz
      const question = quiz.questions.find(q => q._id.toString() === questionId);
      
      // Check if answer is correct
      const isCorrect = question && selectedAnswer === question.correctAnswer;
      if (isCorrect) {
        correctAnswers++;
      }
      
      return {
        questionId,
        selectedAnswer,
        isCorrect,
        correctAnswer: question ? question.correctAnswer : null
      };
    });

    // Calculate percentage score
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    const passed = score >= (quiz.passingScore || 70);

    // Create attempt record
    const attempt = new QuizAttempt({
      quizId: quiz._id,
      userId: req.user._id,
      answers: formattedAnswers,
      score,
      passed,
      timeSpent: req.body.timeSpent || 0
    });
    
    await attempt.save();
    logger.info(`Quiz ${quiz._id} submitted by user ${req.user._id} - Score: ${score}%`);

    // Return detailed results
    res.json({
      success: true,
      score,
      correctAnswers,
      totalQuestions,
      passed,
      answers: formattedAnswers,
      message: `Quiz completed! Your score: ${score}%${passed ? ' Congratulations!' : ' Keep practicing!'}`
    });
    
  } catch (error) {
    logger.error('Error submitting quiz attempt:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error submitting quiz attempt',
      error: error.message 
    });
  }
};

// Get quiz statistics
exports.getQuizStats = async (req, res) => {
  try {
    const quizId = req.params.id;
    const stats = await QuizAttempt.aggregate([
      { $match: { quizId: quizId } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: "$score" },
          highestScore: { $max: "$score" },
          lowestScore: { $min: "$score" },
          passRate: {
            $avg: { $cond: ["$passed", 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passRate: 0
    });
  } catch (error) {
    logger.error('Error getting quiz statistics:', error);
    res.status(500).json({ message: 'Error retrieving quiz statistics' });
  }
};

// Get user's quiz history
exports.getUserQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id })
      .populate('quizId')
      .sort('-createdAt');
    res.json(attempts);
  } catch (error) {
    logger.error('Error getting user quiz history:', error);
    res.status(500).json({ message: 'Error retrieving quiz history' });
  }
};

// Get user's quiz statistics
exports.getUserQuizStats = async (req, res) => {
  try {
    const stats = await QuizAttempt.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: "$score" },
          quizzesPassed: {
            $sum: { $cond: ["$passed", 1, 0] }
          },
          totalTime: { $sum: "$timeSpent" }
        }
      }
    ]);

    res.json(stats[0] || {
      totalAttempts: 0,
      averageScore: 0,
      quizzesPassed: 0,
      totalTime: 0
    });
  } catch (error) {
    logger.error('Error getting user statistics:', error);
    res.status(500).json({ message: 'Error retrieving user statistics' });
  }
};
