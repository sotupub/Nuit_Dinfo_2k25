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
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Users, Activity, BookOpen, Award, TrendingUp, UserCheck } from "lucide-react";
import "@/styles/water-theme.css";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  completionRate: number;
  averageScore: number;
  userGrowth: { month: string; users: number }[];
  activityData: { day: string; active: number }[];
  topPerformers: {
    id: number;
    name: string;
    score: number;
    progress: number;
  }[];
}

export const AdminDashboard = ({ adminStats }: { adminStats: AdminStats }) => {
  const [stats, setStats] = useState<AdminStats | null>(adminStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    if (!adminStats) fetchStats();
  }, [adminStats]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="water-theme p-6">
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 relative z-10">Admin Dashboard</h1>
      
      <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Total Users</h3>
            </div>
            <p className="text-2xl font-bold animate-count">{stats.totalUsers}</p>
          </div>
        </Card>

        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <UserCheck className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Active Users</h3>
            </div>
            <p className="text-2xl font-bold animate-count">{stats.activeUsers}</p>
          </div>
        </Card>

        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Completion Rate</h3>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold animate-count">{stats.completionRate}%</p>
              <div className="water-progress">
                <div 
                  className="water-progress-bar"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="glass-card stats-card glow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-6 w-6 text-blue-300" />
              <h3 className="text-sm font-medium">Average Score</h3>
            </div>
            <p className="text-2xl font-bold animate-count">{stats.averageScore}%</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="glass-card">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">User Growth</h3>
            <div className="h-[300px] chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
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
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="rgba(99,179,237,0.8)"
                    strokeWidth={2}
                    dot={{ fill: 'rgba(99,179,237,0.8)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="glass-card">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Daily Active Users</h3>
            <div className="h-[300px] chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.activityData}>
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
                    dataKey="active"
                    fill="rgba(79,209,197,0.6)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      <Card className="glass-card">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Top Performers</h3>
          <div className="space-y-4">
            {stats.topPerformers.map((user) => (
              <div key={user.id} className="achievement-item">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-300" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-blue-200">Score: {user.score}</p>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="water-progress">
                      <div 
                        className="water-progress-bar"
                        style={{ width: `${user.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
