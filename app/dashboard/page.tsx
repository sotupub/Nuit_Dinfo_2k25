"use client";

import { useState, useEffect } from "react";
import { withAuth } from "@/components/auth/with-auth";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

// Mock data for initial render
const mockUserStats = {
  totalPoints: 750,
  completedChallenges: 15,
  timeSpent: 2500,
  skillLevel: 5,
  weeklyProgress: [
    { day: "Mon", progress: 20 },
    { day: "Tue", progress: 40 },
    { day: "Wed", progress: 45 },
    { day: "Thu", progress: 80 },
    { day: "Fri", progress: 100 }
  ],
  recentAchievements: [
    {
      id: 1,
      title: "Expert Phishing",
      description: "Score parfait sur le quiz de phishing",
      date: "2023-12-08"
    }
  ]
};

const mockAdminStats = {
  totalUsers: 150,
  activeUsers: 89,
  completionRate: 75,
  averageScore: 82,
  userGrowth: [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 120 },
    { month: "Mar", users: 150 }
  ],
  activityData: [
    { day: "Mon", active: 45 },
    { day: "Tue", active: 52 },
    { day: "Wed", active: 49 },
    { day: "Thu", active: 63 },
    { day: "Fri", active: 58 }
  ],
  topPerformers: [
    {
      id: 1,
      name: "John Doe",
      score: 95,
      progress: 98
    }
  ]
};

function DashboardPage() {
  const [isAdmin] = useState(false); // Replace with actual admin check
  const [userStats, setUserStats] = useState(mockUserStats);
  const [adminStats, setAdminStats] = useState(mockAdminStats);

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue={isAdmin ? "admin" : "user"} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="user">User Dashboard</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>}
        </TabsList>
        <TabsContent value="user">
          <UserDashboard userStats={userStats} />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="admin">
            <AdminDashboard adminStats={adminStats} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default withAuth(DashboardPage);
