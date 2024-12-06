"use client";

import { useState } from "react";
import { PlayCircle, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VideoType } from "@/lib/types";

interface VideoPlayerProps {
  video: VideoType;
  onComplete: () => void;
}

export function VideoPlayer({ video, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showDecision, setShowDecision] = useState(false);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    setCurrentTime(video.currentTime);

    // Show decision point at specific timestamps
    if (video.currentTime >= video.duration * 0.5 && !showDecision) {
      video.pause();
      setIsPlaying(false);
      setShowDecision(true);
    }

    // Complete video
    if (video.currentTime >= video.duration) {
      onComplete();
    }
  };

  const handleDecisionClick = (isCorrect: boolean) => {
    setShowDecision(false);
    if (isCorrect) {
      setIsPlaying(true);
      const videoElement = document.querySelector("video");
      if (videoElement) {
        videoElement.play();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <video
          src={video.url}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {!isPlaying && !showDecision && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-0 m-auto w-16 h-16 rounded-full"
            onClick={() => {
              const videoElement = document.querySelector("video");
              if (videoElement) {
                videoElement.play();
              }
            }}
          >
            <PlayCircle className="w-12 h-12" />
          </Button>
        )}

        {showDecision && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card className="p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4">{video.decisionPoint.question}</h3>
              <div className="space-y-2">
                {video.decisionPoint.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleDecisionClick(index === video.decisionPoint.correctIndex)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{video.title}</h2>
        <p className="text-muted-foreground">{video.description}</p>
      </div>
    </div>
  );
}