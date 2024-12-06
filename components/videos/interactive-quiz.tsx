"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion, QuizTheme, DifficultyLevel, UserQuizProgress } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveQuizProps {
  questions: QuizQuestion[];
  theme: QuizTheme;
  userProgress?: UserQuizProgress;
  onComplete: (score: number, progress: Partial<UserQuizProgress>) => void;
}

export function InteractiveQuiz({ 
  questions, 
  theme, 
  userProgress, 
  onComplete 
}: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>([]);

  // Filter and sort questions based on theme and difficulty
  useEffect(() => {
    const themedQuestions = questions.filter(q => q.theme === theme);
    const difficulty = userProgress?.currentLevel || 'beginner';
    
    // Prioritize questions based on difficulty and completion status
    const sortedQuestions = themedQuestions.sort((a, b) => {
      if (a.difficulty === difficulty && b.difficulty !== difficulty) return -1;
      if (b.difficulty === difficulty && a.difficulty !== difficulty) return 1;
      if (userProgress?.completedQuestions.includes(a.id)) return 1;
      if (userProgress?.completedQuestions.includes(b.id)) return -1;
      return 0;
    });

    setFilteredQuestions(sortedQuestions);
  }, [questions, theme, userProgress]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    if (answerIndex === filteredQuestions[currentQuestion].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalScore = ((score + (selectedAnswer === filteredQuestions[currentQuestion].correctIndex ? 1 : 0)) / filteredQuestions.length) * 100;
      
      // Update progress
      const updatedProgress: Partial<UserQuizProgress> = {
        themeScores: {
          ...(userProgress?.themeScores || {}),
          [theme]: finalScore
        },
        completedQuestions: [
          ...(userProgress?.completedQuestions || []),
          filteredQuestions[currentQuestion].id
        ],
        currentLevel: determineNewLevel(finalScore, userProgress?.currentLevel)
      };
      
      onComplete(finalScore, updatedProgress);
    }
  };

  const determineNewLevel = (score: number, currentLevel: DifficultyLevel = 'beginner'): DifficultyLevel => {
    if (score >= 80) {
      return currentLevel === 'beginner' ? 'intermediate' : 'advanced';
    } else if (score <= 40) {
      return currentLevel === 'advanced' ? 'intermediate' : 'beginner';
    }
    return currentLevel;
  };

  const progress = ((currentQuestion + 1) / filteredQuestions.length) * 100;
  const currentQ = filteredQuestions[currentQuestion];

  if (!currentQ) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No questions available</h2>
          <p className="text-muted-foreground">Try selecting a different theme or difficulty level.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Knowledge Check</h2>
            <div className="flex gap-2">
              <Badge variant="outline">{theme}</Badge>
              <Badge variant="secondary">{currentQ.difficulty}</Badge>
            </div>
          </div>
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {filteredQuestions.length}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQ.question}</h3>

          <div className="space-y-2">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={showExplanation 
                  ? index === currentQ.correctIndex 
                    ? "default"
                    : index === selectedAnswer 
                      ? "destructive"
                      : "outline"
                  : "outline"
                }
                className={cn(
                  "w-full justify-start",
                  showExplanation && index === currentQ.correctIndex && "bg-green-100",
                  showExplanation && index === selectedAnswer && index !== currentQ.correctIndex && "bg-red-100"
                )}
                onClick={() => !showExplanation && handleAnswerSelect(index)}
                disabled={showExplanation}
              >
                <div className="flex items-center gap-2">
                  {showExplanation && (
                    index === currentQ.correctIndex 
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : index === selectedAnswer 
                        ? <XCircle className="w-4 h-4 text-red-500" />
                        : <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                  {option}
                </div>
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-4 space-y-4">
              <div className={cn(
                "p-4 rounded-lg",
                selectedAnswer === currentQ.correctIndex ? "bg-green-100" : "bg-red-100"
              )}>
                <p className="text-sm">{currentQ.explanation}</p>
              </div>
              <Button onClick={handleNext}>
                {currentQuestion < filteredQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}