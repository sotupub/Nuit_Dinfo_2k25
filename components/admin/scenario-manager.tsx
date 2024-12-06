"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Cookies from 'js-cookie';
import { Loader2 } from "lucide-react";

interface Scenario {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  completionTime: number;
  steps: {
    order: number;
    content: string;
    choices: {
      text: string;
      isCorrect: boolean;
      feedback: string;
    }[];
  }[];
}

export default function ScenarioManager() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(true);
  const { toast } = useToast();

  const fetchScenarios = async () => {
    try {
      setIsLoadingScenarios(true);
      const response = await fetch("http://localhost:5000/api/scenarios");

      if (!response.ok) {
        throw new Error('Failed to fetch scenarios');
      }

      const data = await response.json();
      setScenarios(data);
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch scenarios",
        variant: "destructive",
      });
    } finally {
      setIsLoadingScenarios(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const scenarioData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      difficulty: formData.get("difficulty"),
      points: Number(formData.get("points")),
      completionTime: Number(formData.get("completionTime")),
      steps: [{
        order: 1,
        content: formData.get("step1_content"),
        choices: [
          {
            text: formData.get("step1_choice1"),
            isCorrect: formData.get("step1_correct") === "1",
            feedback: formData.get("step1_feedback1")
          },
          {
            text: formData.get("step1_choice2"),
            isCorrect: formData.get("step1_correct") === "2",
            feedback: formData.get("step1_feedback2")
          },
          {
            text: formData.get("step1_choice3"),
            isCorrect: formData.get("step1_correct") === "3",
            feedback: formData.get("step1_feedback3")
          }
        ]
      }]
    };

    try {
      const token = Cookies.get('accessToken');
      if (!token) {
        throw new Error('Please login first');
      }

      const response = await fetch("http://localhost:5000/api/scenarios", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(scenarioData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create scenario');
      }

      toast({
        title: "Success",
        description: "Scenario created successfully",
      });

      fetchScenarios();
    } catch (error) {
      console.error('Error creating scenario:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create scenario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingScenarios) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scenarios</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Scenario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Scenario</DialogTitle>
              <DialogDescription>
                Add a new scenario to the learning platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <input
                    name="title"
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="cybersecurity">Cybersecurity</option>
                    <option value="marine-life">Marine Life</option>
                    <option value="conservation">Conservation</option>
                    <option value="pollution">Pollution</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <select
                    name="difficulty"
                    required
                    className="w-full p-2 border rounded"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Points</label>
                  <input
                    name="points"
                    type="number"
                    required
                    min="1"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Completion Time (minutes)</label>
                  <input
                    name="completionTime"
                    type="number"
                    required
                    min="1"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    required
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Step 1</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    name="step1_content"
                    required
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Choice 1</label>
                    <input
                      name="step1_choice1"
                      type="text"
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      name="step1_feedback1"
                      type="text"
                      placeholder="Feedback for choice 1"
                      required
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Choice 2</label>
                    <input
                      name="step1_choice2"
                      type="text"
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      name="step1_feedback2"
                      type="text"
                      placeholder="Feedback for choice 2"
                      required
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Choice 3</label>
                    <input
                      name="step1_choice3"
                      type="text"
                      required
                      className="w-full p-2 border rounded"
                    />
                    <input
                      name="step1_feedback3"
                      type="text"
                      placeholder="Feedback for choice 3"
                      required
                      className="w-full p-2 border rounded mt-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Correct Answer</label>
                    <select
                      name="step1_correct"
                      required
                      className="w-full p-2 border rounded"
                    >
                      <option value="1">Choice 1</option>
                      <option value="2">Choice 2</option>
                      <option value="3">Choice 3</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create Scenario
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <Card key={scenario._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{scenario.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {scenario.category} • {scenario.difficulty} • {scenario.points} points
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{scenario.steps?.length || 0} steps</span>
                <span>{scenario.completionTime} min</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
