import { QuizQuestion } from "./types";

export const quizQuestions: QuizQuestion[] = [
  // Phishing Questions
  {
    id: "phish-1",
    theme: "phishing",
    difficulty: "beginner",
    question: "Comment identifier un e-mail de phishing ?",
    options: [
      "Vérifier uniquement l'expéditeur",
      "Cliquer sur tous les liens pour les tester",
      "Vérifier l'adresse e-mail, les fautes d'orthographe et l'urgence du message",
      "Ignorer tous les e-mails inconnus"
    ],
    correctIndex: 2,
    explanation: "Les e-mails de phishing contiennent souvent des fautes d'orthographe, une adresse d'expéditeur suspecte et créent un sentiment d'urgence. Il est important de vérifier ces trois éléments."
  },
  {
    id: "phish-2",
    theme: "phishing",
    difficulty: "intermediate",
    question: "Que faire si vous avez cliqué sur un lien suspect ?",
    options: [
      "Ignorer et continuer à utiliser l'ordinateur",
      "Déconnecter l'appareil d'Internet, changer vos mots de passe et scanner votre système",
      "Éteindre l'ordinateur définitivement",
      "Partager le lien avec des amis pour vérification"
    ],
    correctIndex: 1,
    explanation: "En cas de clic sur un lien suspect, il est crucial de déconnecter l'appareil pour éviter la propagation de malware, changer les mots de passe depuis un autre appareil sécurisé, et scanner le système."
  },

  // Password Management Questions
  {
    id: "pass-1",
    theme: "passwords",
    difficulty: "beginner",
    question: "Quelle est la meilleure pratique pour créer un mot de passe fort ?",
    options: [
      "Utiliser votre date de naissance",
      "Utiliser le même mot de passe partout",
      "Créer une phrase complexe avec des caractères spéciaux et des chiffres",
      "Utiliser le nom de votre animal de compagnie"
    ],
    correctIndex: 2,
    explanation: "Un mot de passe fort doit contenir une combinaison de lettres majuscules et minuscules, de chiffres et de caractères spéciaux. Une phrase complexe est plus facile à retenir et plus sécurisée."
  },
  {
    id: "pass-2",
    theme: "passwords",
    difficulty: "advanced",
    question: "Quelle est la meilleure méthode pour gérer plusieurs mots de passe ?",
    options: [
      "Les écrire dans un carnet",
      "Utiliser un gestionnaire de mots de passe sécurisé",
      "Utiliser le même mot de passe avec des variations",
      "Les enregistrer dans un fichier texte sur l'ordinateur"
    ],
    correctIndex: 1,
    explanation: "Un gestionnaire de mots de passe sécurisé offre le meilleur compromis entre sécurité et facilité d'utilisation. Il crypte vos mots de passe et vous permet d'en générer des complexes facilement."
  },

  // Public WiFi Questions
  {
    id: "wifi-1",
    theme: "wifi",
    difficulty: "beginner",
    question: "Quelle précaution prendre lors de l'utilisation d'un WiFi public ?",
    options: [
      "Se connecter à n'importe quel réseau gratuit",
      "Utiliser un VPN et éviter les transactions sensibles",
      "Partager le réseau avec des amis",
      "Désactiver le pare-feu"
    ],
    correctIndex: 1,
    explanation: "L'utilisation d'un VPN crypte vos données et protège votre vie privée sur les réseaux WiFi publics. Il est également conseillé d'éviter les transactions bancaires et l'accès à des données sensibles."
  },
  {
    id: "wifi-2",
    theme: "wifi",
    difficulty: "intermediate",
    question: "Comment identifier un réseau WiFi public sécurisé ?",
    options: [
      "Choisir le réseau avec le signal le plus fort",
      "Vérifier l'authentification et confirmer le nom du réseau auprès de l'établissement",
      "Se connecter au réseau le plus populaire",
      "Utiliser uniquement des réseaux gratuits"
    ],
    correctIndex: 1,
    explanation: "Il est important de vérifier l'authenticité du réseau WiFi auprès de l'établissement pour éviter les réseaux malveillants qui imitent les réseaux légitimes (evil twin attacks)."
  }
];
