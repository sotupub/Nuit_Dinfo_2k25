"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy } from "lucide-react";

const topUsers = [
  {
    name: "Sophie Martin",
    points: 2850,
    level: "Expert",
    rank: 1
  },
  {
    name: "Lucas Dubois",
    points: 2720,
    level: "Expert",
    rank: 2
  },
  {
    name: "Emma Bernard",
    points: 2680,
    level: "Expert",
    rank: 3
  },
  {
    name: "Thomas Laurent",
    points: 2540,
    level: "Avancé",
    rank: 4
  },
  {
    name: "Julie Petit",
    points: 2490,
    level: "Avancé",
    rank: 5
  }
];

export default function TopUsers() {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className={`h-4 w-4 ${getRankColor(rank)}`} />;
    }
    return <span className={`text-sm ${getRankColor(rank)}`}>#{rank}</span>;
  };

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-6">
        {topUsers.map((user) => (
          <div key={user.rank} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-6 text-center">
                {getRankIcon(user.rank)}
              </div>
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.level}</p>
              </div>
            </div>
            <div className="text-sm font-medium">{user.points} pts</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
