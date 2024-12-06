"use client";

import { Progress } from "@/components/ui/progress";

const modules = [
  {
    name: "Fondamentaux de la Cybersécurité",
    progress: 100,
    status: "completed"
  },
  {
    name: "Sécurité des Mots de Passe",
    progress: 85,
    status: "in-progress"
  },
  {
    name: "Protection contre le Phishing",
    progress: 75,
    status: "in-progress"
  },
  {
    name: "Sécurité des Réseaux",
    progress: 60,
    status: "in-progress"
  },
  {
    name: "Protection des Données",
    progress: 45,
    status: "in-progress"
  },
  {
    name: "Sécurité Mobile",
    progress: 30,
    status: "in-progress"
  },
  {
    name: "Réponse aux Incidents",
    progress: 0,
    status: "locked"
  }
];

export default function ModuleProgress() {
  return (
    <div className="space-y-8">
      {modules.map((module, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {module.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {module.status === 'completed' ? 'Complété' :
                 module.status === 'in-progress' ? 'En cours' : 'Verrouillé'}
              </p>
            </div>
            <span className="text-sm font-medium">
              {module.progress}%
            </span>
          </div>
          <Progress
            value={module.progress}
            className="h-2"
          />
        </div>
      ))}
    </div>
  );
}
