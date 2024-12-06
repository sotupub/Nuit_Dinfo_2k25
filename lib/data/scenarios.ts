export const scenarios = [
  {
    id: 1,
    title: "Phishing Email Detection",
    description: "Learn to identify and handle suspicious emails",
    type: "phishing",
    level: 1,
    points: 100,
    steps: [
      {
        question: "You receive an urgent email from your bank asking you to verify your account by clicking a link. What should you do?",
        options: [
          "Click the link immediately to prevent account suspension",
          "Check the sender's email address and hover over the link to preview the URL",
          "Forward the email to all your colleagues to warn them",
          "Reply to the email asking for more information"
        ],
        correctIndex: 1,
        explanation: "Always verify the sender's email address and inspect links before clicking. Legitimate banks never ask for sensitive information via email."
      },
      {
        question: "The email address shows 'support@bank-secure-verify.com'. Is this legitimate?",
        options: [
          "Yes, it contains the word 'bank' and 'secure'",
          "No, this is not the official domain of your bank",
          "Maybe, need to check with friends first",
          "Yes, because it has 'verify' in the address"
        ],
        correctIndex: 1,
        explanation: "Official bank emails come from their official domain. Be suspicious of similar-looking but slightly different domain names."
      }
    ]
  },
  {
    id: 2,
    title: "Password Security",
    description: "Create and manage secure passwords",
    type: "security",
    level: 2,
    points: 150,
    steps: [
      {
        question: "Which of these passwords is the most secure?",
        options: [
          "Password123!",
          "MyDog'sName2023",
          "xK9#mP2$vL9@nQ5",
          "qwerty12345"
        ],
        correctIndex: 2,
        explanation: "A strong password contains a mix of uppercase and lowercase letters, numbers, and special characters."
      }
    ]
  },
  {
    id: 3,
    title: "Social Media Privacy",
    description: "Protect your privacy on social networks",
    type: "privacy",
    level: 3,
    points: 200,
    steps: [
      {
        question: "What information should you avoid sharing on social media?",
        options: [
          "Your vacation photos after returning home",
          "Your current real-time location and travel plans",
          "Your favorite movies and books",
          "Photos of your pets"
        ],
        correctIndex: 1,
        explanation: "Sharing real-time location can make you vulnerable to theft or stalking. Wait until after events to post about them."
      }
    ]
  }
];