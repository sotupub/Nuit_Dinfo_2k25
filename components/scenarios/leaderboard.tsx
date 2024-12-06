"use client";

import { Trophy, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Leaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topUsers.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{index + 1}</span>
                <span>{user.name}</span>
              </div>
              <span className="font-semibold">{user.points} pts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const topUsers = [
  { id: 1, name: "Alice Smith", points: 2500 },
  { id: 2, name: "Bob Johnson", points: 2300 },
  { id: 3, name: "Carol White", points: 2100 },
  { id: 4, name: "David Brown", points: 1900 },
  { id: 5, name: "Eve Wilson", points: 1800 },
];