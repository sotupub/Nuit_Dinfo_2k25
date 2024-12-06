"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const CATEGORIES = ["Environment", "Wildlife", "Conservation", "Education"];

export default function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const videoData = {
      title: formData.get("title"),
      description: formData.get("description"),
      thumbnail: formData.get("thumbnail"),
      url: formData.get("url"),
      category: formData.get("category"),
    };

    try {
      const response = await fetch("http://localhost:5000/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) throw new Error("Failed to create video");

      toast({
        title: "Success",
        description: "Video created successfully",
      });

      // Refresh video list
      fetchVideos();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create video",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/videos");
      const data = await response.json();
      setVideos(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch videos",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Videos</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Video</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input name="title" placeholder="Video Title" required />
              </div>
              <div>
                <Textarea
                  name="description"
                  placeholder="Video Description"
                  required
                />
              </div>
              <div>
                <Input name="thumbnail" placeholder="Thumbnail URL" required />
              </div>
              <div>
                <Input name="url" placeholder="Video URL" required />
              </div>
              <div>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Video"}
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
              <TableHead>Category</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Likes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video: any) => (
              <TableRow key={video._id}>
                <TableCell>{video.title}</TableCell>
                <TableCell>{video.category}</TableCell>
                <TableCell>{video.views}</TableCell>
                <TableCell>{video.likes}</TableCell>
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
