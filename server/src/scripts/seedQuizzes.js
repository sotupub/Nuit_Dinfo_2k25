const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const quizData = [
  {
    title: "Sécurité des Mots de Passe",
    questions: [
      {
        questionText: "Quelle est la longueur minimale recommandée pour un mot de passe sécurisé ?",
        options: ["6 caractères", "8 caractères", "12 caractères", "16 caractères"],
        correctAnswer: "12 caractères"
      },
      {
        questionText: "Laquelle de ces pratiques est la plus sécurisée pour les mots de passe ?",
        options: [
          "Utiliser le même mot de passe pour tous les comptes",
          "Utiliser un gestionnaire de mots de passe",
          "Noter les mots de passe dans un carnet",
          "Utiliser des informations personnelles"
        ],
        correctAnswer: "Utiliser un gestionnaire de mots de passe"
      },
      {
        questionText: "Quelle méthode d'authentification est la plus sécurisée ?",
        options: [
          "Mot de passe simple",
          "Authentification à deux facteurs (2FA)",
          "Question de sécurité",
          "Code PIN"
        ],
        correctAnswer: "Authentification à deux facteurs (2FA)"
      }
    ]
  },
  {
    title: "Protection contre le Phishing",
    questions: [
      {
        questionText: "Comment identifier un email de phishing ?",
        options: [
          "L'email provient d'une adresse officielle",
          "Il y a des fautes d'orthographe et une urgence dans le message",
          "L'email contient le logo de l'entreprise",
          "L'email demande poliment des informations"
        ],
        correctAnswer: "Il y a des fautes d'orthographe et une urgence dans le message"
      },
      {
        questionText: "Que faire si vous recevez un email suspect ?",
        options: [
          "Cliquer sur les liens pour vérifier",
          "Répondre pour demander plus d'informations",
          "Supprimer l'email et ne pas cliquer sur les liens",
          "Transférer à tous vos contacts"
        ],
        correctAnswer: "Supprimer l'email et ne pas cliquer sur les liens"
      },
      {
        questionText: "Quelle est la meilleure pratique face à un email demandant vos informations bancaires ?",
        options: [
          "Fournir les informations si l'email semble officiel",
          "Ne jamais fournir d'informations sensibles par email",
          "Vérifier le lien en cliquant dessus",
          "Répondre avec des informations partielles"
        ],
        correctAnswer: "Ne jamais fournir d'informations sensibles par email"
      }
    ]
  },
  {
    title: "Sécurité sur les Réseaux Sociaux",
    questions: [
      {
        questionText: "Quelle information ne devriez-vous jamais partager sur les réseaux sociaux ?",
        options: [
          "Vos photos de vacances",
          "Votre date de naissance",
          "Vos informations bancaires",
          "Vos centres d'intérêt"
        ],
        correctAnswer: "Vos informations bancaires"
      },
      {
        questionText: "Comment sécuriser au mieux votre compte sur les réseaux sociaux ?",
        options: [
          "Utiliser un mot de passe simple",
          "Activer l'authentification à deux facteurs",
          "Partager le mot de passe avec des amis",
          "Utiliser le même mot de passe partout"
        ],
        correctAnswer: "Activer l'authentification à deux facteurs"
      },
      {
        questionText: "Que faire si vous recevez une demande d'ami d'un inconnu ?",
        options: [
          "Accepter pour être poli",
          "Vérifier le profil et accepter si vous avez des amis en commun",
          "Ignorer ou refuser si vous ne connaissez pas la personne",
          "Accepter et envoyer un message"
        ],
        correctAnswer: "Ignorer ou refuser si vous ne connaissez pas la personne"
      }
    ]
  }
];

async function seedQuizzes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user (or create one if doesn't exist)
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    // Add createdBy field to each quiz
    const quizzesWithCreator = quizData.map(quiz => ({
      ...quiz,
      createdBy: adminUser._id
    }));

    // Insert new quizzes
    await Quiz.insertMany(quizzesWithCreator);
    console.log('Successfully seeded quizzes');

    // Log the count of inserted quizzes
    const count = await Quiz.countDocuments();
    console.log(`Inserted ${count} quizzes`);

  } catch (error) {
    console.error('Error seeding quizzes:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seeder
seedQuizzes();
