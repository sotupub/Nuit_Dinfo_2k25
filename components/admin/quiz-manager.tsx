"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function QuizManager() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const quizData = {
      title: formData.get("title"),
      description: formData.get("description"),
      questions: [
        {
          text: formData.get("question1"),
          options: [
            formData.get("q1_option1"),
            formData.get("q1_option2"),
            formData.get("q1_option3"),
            formData.get("q1_option4"),
          ],
          correctAnswer: formData.get("q1_correct"),
        },
        // Add more questions as needed
      ],
    };

    try {
      const response = await fetch("http://localhost:5000/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      if (!response.ok) throw new Error("Failed to create quiz");

      toast({
        title: "Success",
        description: "Quiz created successfully",
      });

      // Refresh quiz list
      fetchQuizzes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/quizzes");
      const data = await response.json();
      setQuizzes(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Quizzes</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Quiz</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input name="title" placeholder="Quiz Title" required />
              </div>
              <div>
                <Textarea
                  name="description"
                  placeholder="Quiz Description"
                  required
                />
              </div>
              
              {/* Question 1 */}
              <div className="space-y-2 border p-4 rounded-lg">
                <h3 className="font-semibold">Question 1</h3>
                <Input name="question1" placeholder="Question Text" required />
                <div className="grid grid-cols-2 gap-2">
                  <Input name="q1_option1" placeholder="Option 1" required />
                  <Input name="q1_option2" placeholder="Option 2" required />
                  <Input name="q1_option3" placeholder="Option 3" required />
                  <Input name="q1_option4" placeholder="Option 4" required />
                </div>
                <Input 
                  name="q1_correct" 
                  placeholder="Correct Answer (1-4)" 
                  type="number" 
                  min="1" 
                  max="4" 
                  required 
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Quiz"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz: any) => (
              <TableRow key={quiz._id}>
                <TableCell>{quiz.title}</TableCell>
                <TableCell>{quiz.questions?.length || 0} questions</TableCell>
                <TableCell>
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="mr-2">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
