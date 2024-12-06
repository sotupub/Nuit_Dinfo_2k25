"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Wave, Fish, Anchor, Shell } from '@/components/ocean-icons';
import { useQuiz } from '@/hooks/useQuiz';

interface OceanQuizProps {
  quizId: string;
}

export function OceanQuiz({ quizId }: OceanQuizProps) {
  const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();
  const { submitQuizAnswer, quizzes } = useQuiz();
  const router = useRouter();

  useEffect(() => {
    if (quizId && quizzes.length > 0) {
      const quiz = quizzes.find(q => q._id === quizId);
      if (quiz) {
        setCurrentQuiz(quiz);
        // Reset state when quiz changes
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setScore(null);
      }
    }
  }, [quizId, quizzes]);

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNextQuiz = () => {
    if (!currentQuiz || quizzes.length === 0) return;
    
    // Find the index of the current quiz
    const currentIndex = quizzes.findIndex(q => q._id === currentQuiz._id);
    
    // If there's a next quiz, navigate to it
    if (currentIndex < quizzes.length - 1) {
      const nextQuiz = quizzes[currentIndex + 1];
      router.push(`/quiz?id=${nextQuiz._id}`);
    } else {
      // If this was the last quiz, show a completion message
      toast({
        title: "Congratulations! 🎉",
        description: "You've completed all available quizzes!",
        variant: "default",
      });
      router.push('/dashboard');
    }
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    try {
      setIsSubmitting(true);
      // Format answers to match the expected schema
      const formattedAnswers = Object.entries(selectedAnswers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const result = await submitQuizAnswer(currentQuiz._id, formattedAnswers);
      
      if (result.success) {
        setScore(result.score);
        toast({
          title: result.passed ? "Congratulations! 🎉" : "Keep practicing! 💪",
          description: result.message,
          variant: result.passed ? "default" : "destructive",
        });

        // If score is >= 70%, navigate to next quiz after a short delay
        if (result.score >= 70) {
          toast({
            title: "Moving to next quiz!",
            description: "Get ready for your next challenge...",
            variant: "default",
          });
          setTimeout(handleNextQuiz, 2000);
        }
      } else {
        throw new Error(result.message || 'Failed to submit quiz');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuiz) {
    return (
      <div className="ocean-loading flex flex-col items-center justify-center p-12">
        <Wave className="h-12 w-12 text-blue-400 animate-wave mb-4" />
        <p className="text-white text-lg">Loading your ocean adventure...</p>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  return (
    <div className="ocean-quiz-container min-h-[500px] rounded-xl p-6 relative overflow-hidden">
      <div className="ocean-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <Card className="ocean-quiz-card p-8">
          <div className="ocean-quiz-content">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-white">{currentQuiz.title}</h2>
              <div className="relative mb-6">
                <Progress value={progress} className="ocean-progress" />
                <p className="text-sm text-blue-200 mt-2">
                  Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl text-white">{currentQuestion.questionText}</h3>
                <div className="space-y-3">
                  <AnimatePresence mode="wait">
                    {currentQuestion.options.map((option: string, index: number) => (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant={selectedAnswers[currentQuestion._id] === option ? "default" : "outline"}
                          className={`w-full justify-start text-left ocean-option ${
                            selectedAnswers[currentQuestion._id] === option 
                              ? 'ocean-option-selected' 
                              : ''
                          }`}
                          onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                        >
                          <div className="flex items-center gap-3">
                            {index === 0 ? <Fish className="h-5 w-5" /> :
                             index === 1 ? <Shell className="h-5 w-5" /> :
                             index === 2 ? <Anchor className="h-5 w-5" /> :
                             <Wave className="h-5 w-5" />}
                            {option}
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="ocean-button"
              >
                Previous
              </Button>

              {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || Object.keys(selectedAnswers).length !== currentQuiz.questions.length}
                  className="ocean-button-primary"
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswers[currentQuestion._id]}
                  className="ocean-button-primary"
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {score !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6"
        >
          <Card className="ocean-quiz-card p-6">
            <div className="ocean-score-circle">
              <svg width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${score * 3.39} 339.292`}
                  className="text-blue-400"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="ocean-score-text">
                <span className="text-3xl font-bold">{score}%</span>
              </div>
            </div>
            <p className="text-center text-white mt-4">
              {score >= 70 ? "Great job! 🎉" : "Keep practicing! 💪"}
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
