"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminHeader from "@/components/admin/admin-header";
import VideoManager from "@/components/admin/video-manager";
import QuizManager from "@/components/admin/quiz-manager";
import ScenarioManager from "@/components/admin/scenario-manager";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading) {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (user?.role !== 'admin') {
          router.push('/dashboard');
        }
      }
    };

    checkAdminAccess();
  }, [isAuthenticated, user, router, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            <VideoManager />
          </TabsContent>
          
          <TabsContent value="quizzes">
            <QuizManager />
          </TabsContent>
          
          <TabsContent value="scenarios">
            <ScenarioManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
