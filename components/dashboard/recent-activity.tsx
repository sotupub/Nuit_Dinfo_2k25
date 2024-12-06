"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentActivities = [
  {
    user: "Alice Martin",
    action: "a complété le module",
    target: "Sécurité des Mots de Passe",
    time: "il y a 2 minutes",
    score: 95
  },
  {
    user: "Thomas Dubois",
    action: "a terminé le quiz",
    target: "Phishing Avancé",
    time: "il y a 5 minutes",
    score: 88
  },
  {
    user: "Marie Laurent",
    action: "a débloqué le badge",
    target: "Expert en Cybersécurité",
    time: "il y a 10 minutes"
  },
  {
    user: "Lucas Bernard",
    action: "a commencé le scénario",
    target: "Protection des Données",
    time: "il y a 15 minutes"
  },
  {
    user: "Sophie Petit",
    action: "a obtenu la certification",
    target: "Sécurité Réseau Niveau 1",
    time: "il y a 20 minutes"
  }
];

export default function RecentActivity() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">
                {activity.user.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user}
              </p>
              <p className="text-sm text-muted-foreground">
                {activity.action} <span className="font-medium text-primary">{activity.target}</span>
                {activity.score && ` avec un score de ${activity.score}%`}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
