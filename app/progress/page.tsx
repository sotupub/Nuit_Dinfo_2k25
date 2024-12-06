"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Droplet, Waves, Activity, BookOpen, Shield, BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import "@/styles/water-theme.css";

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const { data, loading: progressLoading, error } = useProgress();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (data) {
      const numbers = document.querySelectorAll('.animate-count');
      numbers.forEach(num => {
        num.classList.remove('animate-count');
        void num.offsetWidth; // Trigger reflow
        num.classList.add('animate-count');
      });
    }
  }, [data]);

  if (authLoading || progressLoading) {
    return (
      <div className="water-theme p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="glass-card">
              <div className="p-4">
                <Skeleton className="h-4 w-1/2 bg-blue-200/20" />
                <Skeleton className="h-8 w-20 mt-4 bg-blue-200/20" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (error) {
    return (
      <div className="water-theme p-6">
        <Alert variant="destructive" className="glass-card border-red-400/50">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="water-theme p-6">
        <Alert className="glass-card">
          <AlertTitle>No Progress Data</AlertTitle>
          <AlertDescription>Start your learning journey to see your progress!</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="water-theme p-6 space-y-6">
      {/* Overall Progress Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card p-4">
          <div className="space-y-2">
            <div className="text-sm text-blue-200">Overall Progress</div>
            <div className="text-2xl font-bold animate-count">
              {data.overallProgress}%
            </div>
            <Progress value={data.overallProgress} className="progress-water" />
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="space-y-2">
            <div className="text-sm text-blue-200">Total Points</div>
            <div className="text-2xl font-bold animate-count">
              {data.totalPoints}
            </div>
            <div className="flex items-center text-blue-200">
              <Shield className="mr-2 h-4 w-4" />
              <span className="text-xs">Security Points</span>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="space-y-2">
            <div className="text-sm text-blue-200">Hours Spent</div>
            <div className="text-2xl font-bold animate-count">
              {data.hoursSpent}
            </div>
            <div className="flex items-center text-blue-200">
              <Activity className="mr-2 h-4 w-4" />
              <span className="text-xs">Learning Time</span>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="space-y-2">
            <div className="text-sm text-blue-200">Completed Modules</div>
            <div className="text-2xl font-bold animate-count">
              {data.completedModules}
            </div>
            <div className="flex items-center text-blue-200">
              <BookOpen className="mr-2 h-4 w-4" />
              <span className="text-xs">Learning Progress</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Skill Levels Section */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-100">Skill Levels</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(data.skillLevels).map(([skill, level]) => (
            <div key={skill} className="space-y-2">
              <div className="flex justify-between text-sm text-blue-200">
                <span className="capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span>{level}%</span>
              </div>
              <Progress value={level} className="progress-water" />
            </div>
          ))}
        </div>
      </Card>

      {/* Weekly Activity Chart */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-100">Weekly Activity</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" className="grid-water" />
              <XAxis dataKey="day" stroke="#93c5fd" />
              <YAxis stroke="#93c5fd" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(147, 197, 253, 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Achievements */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-100">Recent Achievements</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.recentAchievements.map((achievement) => (
            <Card key={achievement.id} className="glass-card-inner p-4">
              <div className="flex items-start space-x-4">
                <div className="achievement-icon">
                  {achievement.icon === 'droplet' ? <Droplet className="h-6 w-6" /> :
                   achievement.icon === 'waves' ? <Waves className="h-6 w-6" /> :
                   <Shield className="h-6 w-6" />}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-100">{achievement.title}</h4>
                  <p className="text-sm text-blue-200">{achievement.description}</p>
                  <p className="text-xs text-blue-300">{achievement.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Learning Path */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-100">Learning Path</h3>
        <div className="space-y-4">
          {data.learningPath.map((module) => (
            <div key={module.module} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-100">{module.module}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  module.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                  module.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                </span>
              </div>
              <Progress 
                value={module.progress} 
                className={`progress-water ${
                  module.status === 'locked' ? 'opacity-50' : ''
                }`}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
