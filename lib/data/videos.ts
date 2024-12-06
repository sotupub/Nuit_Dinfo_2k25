export const videos = [
  {
    id: 1,
    title: "Creating Strong Passwords",
    description: "Learn how to create and manage secure passwords that protect your accounts.",
    url: "https://example.com/videos/password-security.mp4",
    thumbnail: "https://example.com/thumbnails/password-security.jpg",
    completed: false,
    decisionPoint: {
      question: "You need to create a new password. Which approach should you take?",
      options: [
        "Use a simple password that's easy to remember",
        "Use a password manager to generate and store a strong password",
        "Use your birthday and name",
        "Use the same password as your other accounts"
      ],
      correctIndex: 1,
      explanation: "Password managers help create and store unique, strong passwords securely."
    },
    quiz: [
      {
        question: "Which of these is the most secure password?",
        options: [
          "password123",
          "MyBirthday1990!",
          "Tr0ub4dor&3",
          "qwerty12345"
        ],
        correctIndex: 2,
        explanation: "A strong password contains a mix of uppercase, lowercase, numbers, and special characters."
      },
      {
        question: "How often should you change your passwords?",
        options: [
          "Never",
          "Every day",
          "When there's a security breach or compromise",
          "Every week"
        ],
        correctIndex: 2,
        explanation: "Change passwords when there's a security incident or if you suspect compromise."
      }
    ]
  },
  {
    id: 2,
    title: "Spotting Phishing Attacks",
    description: "Learn to identify and avoid sophisticated phishing attempts.",
    url: "https://example.com/videos/phishing-awareness.mp4",
    thumbnail: "https://example.com/thumbnails/phishing-awareness.jpg",
    completed: false,
    decisionPoint: {
      question: "You receive an urgent email from your bank. What's your first action?",
      options: [
        "Click the link in the email immediately",
        "Check the sender's email address and hover over links",
        "Reply with your account information",
        "Forward it to your friends"
      ],
      correctIndex: 1,
      explanation: "Always verify the sender and inspect links before clicking."
    },
    quiz: [
      {
        question: "What's a common sign of a phishing email?",
        options: [
          "Professional design",
          "Urgent language and threats",
          "Company logo",
          "Sender's name"
        ],
        correctIndex: 1,
        explanation: "Phishing emails often create urgency to make you act without thinking."
      }
    ]
  }
];