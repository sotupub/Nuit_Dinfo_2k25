import React, { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { quizService, Quiz, QuizQuestion } from '@/lib/services/quiz-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface QuizComponentProps {
  quizId?: string;
}

export function QuizComponent({ quizId }: QuizComponentProps) {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();
  const api = useApi();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (quizId) {
          const quiz = await quizService.getQuizById(quizId);
          setCurrentQuiz(quiz);
        } else {
          const quizzes = await quizService.getQuizzes();
          if (quizzes.length > 0) {
            setCurrentQuiz(quizzes[0]);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quiz",
          variant: "destructive",
        });
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
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

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    try {
      setIsSubmitting(true);
      const result = await quizService.submitQuiz({
        quizId: currentQuiz._id,
        answers: selectedAnswers
      });

      setScore(result.score);
      toast({
        title: "Quiz Submitted",
        description: `Your score: ${result.score}%`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentQuiz) {
    return <div className="text-white">Loading quiz...</div>;
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="glass-card glow p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">{currentQuiz.title}</h2>
          <Progress value={progress} className="mb-4" />
          <p className="text-sm text-white/80">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl mb-4 text-white">{currentQuestion.questionText}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswers[currentQuestionIndex] === option ? "default" : "outline"}
                className={`w-full justify-start text-left backdrop-blur-sm ${
                  selectedAnswers[currentQuestionIndex] === option 
                    ? 'bg-white/20 hover:bg-white/30 text-white' 
                    : 'bg-white/10 hover:bg-white/15 text-white/90'
                }`}
                onClick={() => handleAnswerSelect(currentQuestionIndex, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            Previous
          </Button>

          {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || Object.keys(selectedAnswers).length !== currentQuiz.questions.length}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              Next
            </Button>
          )}
        </div>

        {score !== null && (
          <div className="mt-6 p-4 rounded-lg glass-card">
            <h4 className="font-bold text-white">Quiz Complete!</h4>
            <p className="text-white/90">Your score: {score}%</p>
          </div>
        )}
      </Card>
    </div>
  );
}
