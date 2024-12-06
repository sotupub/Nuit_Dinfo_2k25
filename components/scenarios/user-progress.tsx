"use client";

import { Award, Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UserProgressProps {
  currentLevel: number;
  totalScenarios: number;
}

export function UserProgress({ currentLevel, totalScenarios }: UserProgressProps) {
  const progress = (currentLevel / totalScenarios) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Level {currentLevel}</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className="flex flex-col items-center p-2 rounded-lg bg-secondary/50"
                title={badge.description}
              >
                <Star className="w-6 h-6 mb-1" />
                <span className="text-xs text-center">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const badges = [
  { name: "Beginner", description: "Complete your first scenario" },
  { name: "Explorer", description: "Complete 5 scenarios" },
  { name: "Expert", description: "Complete all scenarios" },
];