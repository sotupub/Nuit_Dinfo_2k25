import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trophy, Lock, Timer, Loader2, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useScenarios, Step } from "@/hooks/useScenarios";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

interface ScenarioCardProps {
  scenario: {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    points: number;
    completionTime: number;
    steps?: Step[];
  };
  isLocked: boolean;
  onComplete: (points: number) => void;
  className?: string;
}

export function ScenarioCard({ scenario, isLocked, onComplete, className }: ScenarioCardProps) {
  const { submitAnswer, updateProgress } = useScenarios();
  const { isAuthenticated } = useAuth();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleOpenScenario = async () => {
    if (isLocked) return;
    if (!isAuthenticated) {
      setError('Authentication required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (!scenario.steps || scenario.steps.length === 0) {
        throw new Error('No steps found for this scenario');
      }

      // Sort steps by order
      const sortedSteps = [...scenario.steps].sort((a, b) => a.order - b.order);
      setSteps(sortedSteps);
      setStartTime(new Date());
      setCurrentStep(0);
      setScore({ correct: 0, total: sortedSteps.length });
      setShowDialog(true);
    } catch (error) {
      console.error("Failed to load scenario:", error);
      setError(error instanceof Error ? error.message : 'Failed to load scenario');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setCurrentStep(0);
    setSelectedAnswer(null);
    setFeedback("");
    setIsCorrect(null);
    setScore({ correct: 0, total: steps.length });
  };

  const handleScenarioComplete = async (finalScore: number) => {
    try {
      const timeSpent = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;
      await updateProgress(scenario._id, finalScore, timeSpent);
      onComplete(finalScore);
      setShowResults(true);
    } catch (error) {
      console.error('Failed to save progress:', error);
      setError('Failed to save your progress. Please try again.');
    }
  };

  const handleAnswerSubmit = async (choiceIndex: number) => {
    if (!steps[currentStep]) return;
    
    try {
      setSelectedAnswer(choiceIndex);
      setError(null); // Clear any previous errors
      
      const response = await submitAnswer(scenario._id, currentStep, choiceIndex);
      
      setIsCorrect(response.isCorrect);
      setFeedback(response.feedback);

      if (response.isCorrect) {
        setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      }

      // Wait for 1.5 seconds before moving to next question or showing results
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setSelectedAnswer(null);
          setFeedback("");
          setIsCorrect(null);
        } else {
          const finalScore = Math.round((score.correct + (response.isCorrect ? 1 : 0)) / steps.length * scenario.points);
          handleScenarioComplete(finalScore);
        }
      }, 1500);
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setError(error instanceof Error ? error.message : 'Failed to submit answer');
      setSelectedAnswer(null);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{scenario.title}</span>
          {isLocked ? (
            <Lock className="h-5 w-5 text-gray-400" />
          ) : (
            <Trophy className="h-5 w-5 text-yellow-400" />
          )}
        </CardTitle>
        <CardDescription>{scenario.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Badge variant={
            scenario.difficulty === 'easy' ? 'default' :
            scenario.difficulty === 'medium' ? 'secondary' : 'destructive'
          }>
            {scenario.difficulty}
          </Badge>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            <span className="text-sm text-gray-500">{scenario.completionTime} min</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleOpenScenario}
          disabled={isLocked || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isLocked ? (
            'Locked'
          ) : !isAuthenticated ? (
            'Login Required'
          ) : (
            'Start Challenge'
          )}
        </Button>
        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
        )}
      </CardFooter>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{scenario.title} - Step {currentStep + 1}/{steps.length}</DialogTitle>
            <DialogDescription>
              {!showResults ? (
                <div className="space-y-4">
                  <Progress value={(currentStep / steps.length) * 100} className="w-full" />
                  <p className="text-lg mt-4">{steps[currentStep]?.content}</p>
                  <div className="grid gap-3 mt-4">
                    {steps[currentStep]?.choices.map((choice, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === index 
                          ? isCorrect === null 
                            ? "secondary"
                            : isCorrect 
                              ? "success" 
                              : "destructive"
                          : "outline"}
                        className="w-full text-left justify-start h-auto py-3 px-4"
                        onClick={() => !selectedAnswer && handleAnswerSubmit(index)}
                        disabled={selectedAnswer !== null}
                      >
                        <div className="flex items-center gap-2">
                          {selectedAnswer === index && (
                            isCorrect === null ? null :
                            isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )
                          )}
                          <span>{choice.text}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                  {feedback && (
                    <div className={cn(
                      "p-4 mt-4 rounded-lg",
                      isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    )}>
                      {feedback}
                    </div>
                  )}
                  {error && (
                    <div className="p-4 mt-4 rounded-lg bg-red-50 text-red-700">
                      {error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <Trophy className="h-16 w-16 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Challenge Complete!
                  </h3>
                  <p>
                    You scored {score.correct} out of {score.total} questions correctly.
                  </p>
                  <Button onClick={handleCloseDialog} className="w-full">
                    Close
                  </Button>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
}