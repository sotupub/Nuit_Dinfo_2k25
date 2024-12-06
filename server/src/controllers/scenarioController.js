const Scenario = require('../models/Scenario');
const UserStats = require('../models/UserStats'); // Assuming UserStats model is defined in a separate file
const logger = require('../config/logger');

// Get all scenarios
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find()
      .select('title description difficulty category points completionTime steps')
      .sort('-createdAt')
      .lean();

    // Process each scenario to ensure steps are properly sorted and formatted
    const processedScenarios = scenarios.map(scenario => {
      // Ensure steps exist and are sorted
      if (scenario.steps && Array.isArray(scenario.steps)) {
        scenario.steps = scenario.steps
          .filter(step => step && step.order != null)
          .sort((a, b) => a.order - b.order);

        // Remove sensitive data from choices
        scenario.steps = scenario.steps.map(step => ({
          ...step,
          choices: step.choices.map(choice => ({
            text: choice.text,
            id: choice._id
          }))
        }));
      } else {
        scenario.steps = [];
      }

      return scenario;
    });

    res.json(processedScenarios);
  } catch (error) {
    logger.error('Error fetching scenarios:', error);
    res.status(500).json({ message: 'Error fetching scenarios' });
  }
};

// Get single scenario
exports.getScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id)
      .select('title description difficulty category points completionTime steps')
      .lean();
    
    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    // Ensure steps exist and are sorted
    if (scenario.steps && Array.isArray(scenario.steps)) {
      scenario.steps = scenario.steps
        .filter(step => step && step.order != null)
        .sort((a, b) => a.order - b.order);
    } else {
      scenario.steps = [];
    }

    // Remove sensitive data from choices
    if (scenario.steps) {
      scenario.steps = scenario.steps.map(step => ({
        ...step,
        choices: step.choices.map(choice => ({
          text: choice.text,
          id: choice._id
        }))
      }));
    }

    res.json(scenario);
  } catch (error) {
    logger.error('Error fetching scenario:', error);
    res.status(500).json({ message: 'Error fetching scenario' });
  }
};

// Submit scenario answer
exports.submitAnswer = async (req, res) => {
  try {
    const { stepIndex, choiceIndex } = req.body;
    const scenario = await Scenario.findById(req.params.id)
      .select('steps points')
      .lean();
    
    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    if (!scenario.steps || !Array.isArray(scenario.steps)) {
      return res.status(400).json({ message: 'Invalid scenario data' });
    }

    const step = scenario.steps[stepIndex];
    if (!step) {
      return res.status(400).json({ message: 'Invalid step index' });
    }

    if (!step.choices || !Array.isArray(step.choices)) {
      return res.status(400).json({ message: 'Invalid step data' });
    }

    const choice = step.choices[choiceIndex];
    if (!choice) {
      return res.status(400).json({ message: 'Invalid choice index' });
    }

    res.json({
      isCorrect: choice.isCorrect,
      feedback: choice.feedback || (choice.isCorrect ? 'Correct!' : 'Incorrect. Try again.'),
      points: choice.isCorrect ? scenario.points : 0
    });
  } catch (error) {
    logger.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Error submitting answer' });
  }
};

// Create new scenario (admin only)
exports.createScenario = async (req, res) => {
  try {
    const scenario = new Scenario({
      ...req.body,
      createdBy: req.user._id
    });
    await scenario.save();
    res.status(201).json(scenario);
  } catch (error) {
    logger.error('Error creating scenario:', error);
    res.status(500).json({ message: 'Error creating scenario' });
  }
};

// Update scenario (admin only)
exports.updateScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    res.json(scenario);
  } catch (error) {
    logger.error('Error updating scenario:', error);
    res.status(500).json({ message: 'Error updating scenario' });
  }
};

// Delete scenario (admin only)
exports.deleteScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findByIdAndDelete(req.params.id);

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    res.json({ message: 'Scenario deleted successfully' });
  } catch (error) {
    logger.error('Error deleting scenario:', error);
    res.status(500).json({ message: 'Error deleting scenario' });
  }
};

// Update scenario progress
exports.updateScenarioProgress = async (req, res) => {
  try {
    const { score, timeSpent } = req.body;
    const scenarioId = req.params.id;
    const userId = req.user._id;

    // Find or create user stats
    let userStats = await UserStats.findOne({ userId });
    
    if (!userStats) {
      userStats = await UserStats.create({
        userId,
        totalPoints: 0,
        level: 'beginner'
      });
    }

    // Check if scenario was already completed
    const alreadyCompleted = userStats.completedScenarios.some(
      s => s.scenarioId.toString() === scenarioId
    );

    if (!alreadyCompleted) {
      // Add scenario to completed list
      userStats.completedScenarios.push({
        scenarioId,
        score,
        completedAt: new Date()
      });

      // Update total points
      userStats.totalPoints += score;

      // Update weekly progress
      const currentWeek = new Date();
      currentWeek.setHours(0, 0, 0, 0);
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay());

      const weeklyProgress = userStats.weeklyProgress.find(wp => 
        new Date(wp.week).getTime() === currentWeek.getTime()
      );

      if (weeklyProgress) {
        weeklyProgress.scenariosCompleted += 1;
        weeklyProgress.pointsEarned += score;
      } else {
        userStats.weeklyProgress.push({
          week: currentWeek,
          scenariosCompleted: 1,
          pointsEarned: score
        });
      }

      // Update user level based on total points
      if (userStats.totalPoints >= 1000) {
        userStats.level = 'expert';
      } else if (userStats.totalPoints >= 500) {
        userStats.level = 'explorer';
      }

      await userStats.save();
    }

    res.json({
      success: true,
      userStats: {
        totalPoints: userStats.totalPoints,
        level: userStats.level,
        completedScenarios: userStats.completedScenarios.length
      }
    });
  } catch (error) {
    logger.error('Error updating scenario progress:', error);
    res.status(500).json({ message: 'Error updating progress' });
  }
};
