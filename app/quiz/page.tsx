"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { OceanQuiz } from "@/components/quiz/OceanQuiz";
import { useQuiz } from "@/hooks/useQuiz";
import { Loader2 } from "lucide-react";

function QuizPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { quizzes, loading: quizLoading } = useQuiz();
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get('id');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // If no quiz ID is provided and we have quizzes, redirect to the first quiz
    if (!quizId && !quizLoading && quizzes.length > 0) {
      router.push(`/quiz?id=${quizzes[0]._id}`);
    }
  }, [quizId, quizLoading, quizzes, router]);

  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#001F3F] to-[#003366] flex items-center justify-center">
        <div className="ocean-loading">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white mt-4">Loading your ocean adventure...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001F3F] to-[#003366] py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Ocean Conservation Quiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-blue-200"
          >
            Test your knowledge about ocean conservation and cybersecurity
          </motion.p>
        </div>

        {quizId ? (
          <OceanQuiz quizId={quizId} />
        ) : (
          <div className="text-center text-white">
            <p>No quiz selected. Please wait while we redirect you...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default QuizPage;
