const mongoose = require('mongoose');
const Scenario = require('../models/Scenario');
const User = require('../models/User');
const logger = require('../config/logger');
require('dotenv').config();

const sampleScenarios = [
  {
    title: "Phishing Email Detection",
    description: "Learn to identify and handle suspicious emails in this interactive scenario. You'll be presented with various email examples and must determine which ones are legitimate and which are phishing attempts.",
    difficulty: "easy",
    category: "Email Security",
    steps: [
      {
        order: 1,
        content: "You receive the following email:\n\nFrom: support@bankofamerica.security.com\nSubject: Urgent: Account Security Update Required\n\nDear Customer,\n\nWe have detected unusual activity in your account. Click here immediately to verify your identity and prevent account suspension. This requires immediate attention.\n\nBest regards,\nBank of America Security Team\n\nWhat would you do?",
        choices: [
          {
            text: "Click the link immediately to prevent account suspension",
            isCorrect: false,
            feedback: "This is unsafe! The email domain 'bankofamerica.security.com' is suspicious. Legitimate Bank of America emails come from 'bankofamerica.com'."
          },
          {
            text: "Delete the email and log into your bank account directly through the official website",
            isCorrect: true,
            feedback: "Correct! Never click links in suspicious emails. Always access your bank account directly through the official website."
          },
          {
            text: "Reply to the email asking for more information",
            isCorrect: false,
            feedback: "Never reply to suspicious emails. This could confirm your email is active to scammers."
          }
        ]
      },
      {
        order: 2,
        content: "You notice the following in an email:\n\n1. Spelling errors\n2. Generic greeting ('Dear Customer')\n3. Urgent language\n4. Sender email doesn't match official domain\n\nHow many of these are common phishing indicators?",
        choices: [
          {
            text: "Only 1 of these",
            isCorrect: false,
            feedback: "Actually, all of these are common phishing indicators!"
          },
          {
            text: "2 of these",
            isCorrect: false,
            feedback: "Actually, all of these are common phishing indicators!"
          },
          {
            text: "All of these",
            isCorrect: true,
            feedback: "Correct! All of these are common indicators of phishing emails. Being able to spot multiple red flags helps protect against scams."
          }
        ]
      }
    ],
    points: 20,
    completionTime: 15
  },
  {
    title: "Password Security Challenge",
    description: "Test your knowledge about creating and managing secure passwords. Learn best practices for password security and common mistakes to avoid.",
    difficulty: "medium",
    category: "Access Security",
    steps: [
      {
        order: 1,
        content: "Which of the following passwords is the most secure?",
        choices: [
          {
            text: "Password123!",
            isCorrect: false,
            feedback: "This password is too common and predictable, despite having numbers and a special character."
          },
          {
            text: "P@ssw0rd",
            isCorrect: false,
            feedback: "Simple character substitutions (@ for a, 0 for o) are well-known and don't add much security."
          },
          {
            text: "kH8#mP9$vL2&nQ",
            isCorrect: true,
            feedback: "Correct! This password is strong because it's long, random, and uses a mix of characters, numbers, and special symbols."
          }
        ]
      },
      {
        order: 2,
        content: "What is the best way to manage multiple passwords?",
        choices: [
          {
            text: "Use the same strong password for all accounts",
            isCorrect: false,
            feedback: "Using the same password, even if strong, is dangerous. If one account is compromised, all accounts are at risk."
          },
          {
            text: "Write down all passwords in a notebook",
            isCorrect: false,
            feedback: "Physical records can be lost or stolen, and aren't easily updateable or searchable."
          },
          {
            text: "Use a reputable password manager",
            isCorrect: true,
            feedback: "Correct! Password managers securely store unique, strong passwords for each account and can generate new ones when needed."
          }
        ]
      }
    ],
    points: 25,
    completionTime: 20
  },
  {
    title: "Social Engineering Defense",
    description: "Learn to recognize and defend against social engineering attacks. This scenario will teach you about common manipulation techniques used by attackers.",
    difficulty: "hard",
    category: "Social Engineering",
    steps: [
      {
        order: 1,
        content: "You receive a phone call from someone claiming to be from IT support. They say there's a virus on your computer and need your login credentials to fix it. What should you do?",
        choices: [
          {
            text: "Provide your credentials since it's an emergency",
            isCorrect: false,
            feedback: "Never give out your credentials over the phone! IT support should never ask for your password."
          },
          {
            text: "Hang up and contact IT support through official channels",
            isCorrect: true,
            feedback: "Correct! Always verify requests through official channels, especially when they involve sensitive information."
          },
          {
            text: "Ask them to prove they're from IT first",
            isCorrect: false,
            feedback: "Attackers can easily fake credentials or information. Always verify through official channels."
          }
        ]
      },
      {
        order: 2,
        content: "A delivery person enters your office building by following an employee through the security door (tailgating). What should you do?",
        choices: [
          {
            text: "Nothing, they're just doing their job",
            isCorrect: false,
            feedback: "Tailgating is a serious security breach, even if the person appears legitimate."
          },
          {
            text: "Confront them directly",
            isCorrect: false,
            feedback: "Direct confrontation could be dangerous. It's better to alert security."
          },
          {
            text: "Alert security and report the tailgating incident",
            isCorrect: true,
            feedback: "Correct! Always report security violations to the appropriate authorities."
          }
        ]
      }
    ],
    points: 30,
    completionTime: 25
  }
];

async function seedScenarios() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Find admin user or create one
    let adminUser = await User.findOne({ email: 'admin@cybersafe.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@cybersafe.com',
        password: 'admin123', // Change this in production!
        role: 'admin'
      });
      logger.info('Admin user created');
    }

    // Clear existing scenarios
    await Scenario.deleteMany({});
    logger.info('Cleared existing scenarios');

    // Add admin user ID to scenarios
    const scenariosWithCreator = sampleScenarios.map(scenario => ({
      ...scenario,
      createdBy: adminUser._id
    }));

    // Insert scenarios
    await Scenario.insertMany(scenariosWithCreator);
    logger.info('Sample scenarios inserted successfully');

    // Log count of inserted scenarios
    const count = await Scenario.countDocuments();
    logger.info(`Total scenarios in database: ${count}`);

    // Close connection
    await mongoose.connection.close();
    logger.info('Database connection closed');

  } catch (error) {
    logger.error('Error seeding scenarios:', error);
    process.exit(1);
  }
  process.exit(0);
}

// Run the seeder
seedScenarios();
