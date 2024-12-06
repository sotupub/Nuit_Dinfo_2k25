export const sampleScenarios = [
  {
    title: "Phishing Email Detection",
    description: "Learn to identify and handle suspicious emails in a corporate environment",
    difficulty: "easy",
    category: "Email Security",
    steps: [
      {
        order: 1,
        content: "You receive an urgent email from your bank asking you to verify your account details by clicking a link. What should you do?",
        choices: [
          {
            text: "Click the link immediately to prevent account suspension",
            isCorrect: false,
            feedback: "Never click on links in unexpected emails from banks. Banks typically don't request sensitive information via email."
          },
          {
            text: "Contact your bank directly through their official website or phone number",
            isCorrect: true,
            feedback: "Correct! Always verify such requests through official channels, not through links in emails."
          },
          {
            text: "Reply to the email with your account details",
            isCorrect: false,
            feedback: "Never send sensitive information through email, especially in response to unsolicited requests."
          }
        ]
      },
      {
        order: 2,
        content: "The email contains your name and partial account number. Does this mean it's definitely legitimate?",
        choices: [
          {
            text: "Yes, they have my personal information so it must be real",
            isCorrect: false,
            feedback: "Personal information can be obtained through various means, including data breaches. This alone doesn't verify legitimacy."
          },
          {
            text: "No, this information could have been obtained through other means",
            isCorrect: true,
            feedback: "Correct! Scammers can obtain personal information through various means. Always verify through official channels."
          }
        ]
      }
    ],
    points: 10,
    completionTime: 5
  },
  {
    title: "Password Security",
    description: "Master the art of creating and managing secure passwords",
    difficulty: "medium",
    category: "Access Security",
    steps: [
      {
        order: 1,
        content: "Which of these passwords is the most secure?",
        choices: [
          {
            text: "Password123!",
            isCorrect: false,
            feedback: "This password is too common and follows a predictable pattern."
          },
          {
            text: "P@ssw0rd",
            isCorrect: false,
            feedback: "Simple character substitutions are well-known and don't add much security."
          },
          {
            text: "kT9#mP2$vL5@nQ8",
            isCorrect: true,
            feedback: "Correct! This password is long, random, and uses a mix of characters, numbers, and symbols."
          }
        ]
      },
      {
        order: 2,
        content: "What's the best way to store passwords for multiple accounts?",
        choices: [
          {
            text: "Write them down in a notebook",
            isCorrect: false,
            feedback: "Physical records can be lost or stolen, and aren't easily updated or secured."
          },
          {
            text: "Use a reputable password manager",
            isCorrect: true,
            feedback: "Correct! Password managers provide secure storage, generation, and easy access to your passwords."
          },
          {
            text: "Use the same password for all accounts",
            isCorrect: false,
            feedback: "Using the same password means if one account is compromised, all accounts are at risk."
          }
        ]
      }
    ],
    points: 15,
    completionTime: 10
  },
  {
    title: "Social Engineering Defense",
    description: "Learn to recognize and prevent social engineering attacks",
    difficulty: "hard",
    category: "Human Security",
    steps: [
      {
        order: 1,
        content: "A caller claiming to be from IT support asks for your login credentials to fix a system issue. What should you do?",
        choices: [
          {
            text: "Provide the credentials since they're from IT",
            isCorrect: false,
            feedback: "Never share credentials, even with IT support. Legitimate IT staff shouldn't ask for passwords."
          },
          {
            text: "Verify the caller's identity through official channels before proceeding",
            isCorrect: true,
            feedback: "Correct! Always verify the identity of anyone requesting sensitive information through established procedures."
          },
          {
            text: "Share only your username but not password",
            isCorrect: false,
            feedback: "Any credential sharing can be dangerous and against security policies."
          }
        ]
      },
      {
        order: 2,
        content: "You notice a USB drive labeled 'Confidential' in the parking lot. What's the safest action?",
        choices: [
          {
            text: "Plug it into your computer to identify the owner",
            isCorrect: false,
            feedback: "Never plug in unknown USB devices. They could contain malware."
          },
          {
            text: "Turn it in to security or IT without plugging it in",
            isCorrect: true,
            feedback: "Correct! Unknown USB devices could be part of a security attack. Let security handle it."
          },
          {
            text: "Ask colleagues if they lost it",
            isCorrect: false,
            feedback: "This could still lead to someone plugging in a potentially dangerous device."
          }
        ]
      }
    ],
    points: 20,
    completionTime: 15
  }
];
