"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Waves, Award, Clock, Target, Brain, Trophy } from "lucide-react";
import "@/styles/water-theme.css";

interface UserStats {
  totalPoints: number;
  completedChallenges: number;
  timeSpent: number;
  skillLevel: number;
  weeklyProgress: { day: string; progress: number }[];
  recentAchievements: {
    id: number;
    title: string;
    description: string;
    date: string;
  }[];
}

export const UserDashboard = ({ userStats }: { userStats: UserStats }) => {
  const [stats, setStats] = useState<UserStats | null>(userStats);
  const [loading, setLoading] = useState(!userStats);

  useEffect(() => {
    // Fetch user stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/dashboard/user-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userStats) {
      fetchStats();
    }
  }, [userStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-lg">Loading dashboard data...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-red-500">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="water-theme p-6">
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 relative z-10">Dashboard</h1>
      
      <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Total Points</h3>
            </div>
            <p className="text-2xl font-bold animate-count">{stats.totalPoints}</p>
          </div>
        </Card>

        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Target className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Completed Challenges</h3>
            </div>
            <p className="text-2xl font-bold animate-count">{stats.completedChallenges}</p>
          </div>
        </Card>

        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Time Spent</h3>
            </div>
            <p className="text-2xl font-bold animate-count">{stats.timeSpent}h</p>
          </div>
        </Card>

        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Brain className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Skill Level</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold animate-count">{stats.skillLevel}%</p>
              <div className="water-progress">
                <div 
                  className="water-progress-bar"
                  style={{ width: `${stats.skillLevel}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats?.weeklyProgress || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)'
                  }}
                />
                <Bar
                  dataKey="progress"
                  fill="rgba(99,179,237,0.6)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent Achievements</h3>
            <div className="space-y-4">
              {stats?.recentAchievements?.map((achievement) => (
                <div key={achievement.id} className="achievement-item">
                  <div className="flex items-start space-x-3">
                    <Award className="h-6 w-6 text-blue-300" />
                    <div>
                      <p className="font-medium">{achievement.title}</p>
                      <p className="text-sm text-blue-200">{achievement.description}</p>
                      <p className="text-xs text-blue-200 mt-1">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-gray-500">No recent achievements</div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
