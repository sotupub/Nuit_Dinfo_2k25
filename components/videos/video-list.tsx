import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle } from "lucide-react";
import { VideoType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VideoListProps {
  videos: VideoType[];
  selectedVideo: VideoType;
  onSelect: (video: VideoType) => void;
}

export function VideoList({ videos, selectedVideo, onSelect }: VideoListProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Video Lessons</h2>
      <div className="space-y-2">
        {videos.map((video) => (
          <Button
            key={video.id}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              selectedVideo.id === video.id && "bg-secondary"
            )}
            onClick={() => onSelect(video)}
          >
            <div className="flex items-center space-x-2">
              {video.completed ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <PlayCircle className="w-4 h-4" />
              )}
              <span>{video.title}</span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
}