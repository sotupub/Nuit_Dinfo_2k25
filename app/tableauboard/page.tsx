"use client";

import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function TableauboardPage() {
  const { user } = useAuth();
  const { userStats, adminStats, loading, error } = useDashboardStats();

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-xl font-semibold">Please log in to view your dashboard</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-pulse text-xl font-semibold">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-xl font-semibold text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">
          {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
        </h1>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
      >
        {user.role === 'admin' && adminStats ? (
          <AdminDashboard stats={adminStats} />
        ) : userStats ? (
          <UserDashboard userProgress={userStats} />
        ) : (
          <div>No dashboard data available</div>
        )}
      </motion.div>
    </div>
  );
}
