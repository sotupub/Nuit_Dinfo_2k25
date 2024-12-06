import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  url: string;
  views?: number;
  likes?: number;
}

export function useVideos(category: string = 'All') {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/videos`, {
          params: { category: category !== 'All' ? category : undefined }
        });
        
        // Handle both data formats (direct array or nested in data object)
        const videoData = response.data.data || response.data;
        setVideos(Array.isArray(videoData) ? videoData : []);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch videos');
        console.error('Error fetching videos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [category]);

  const likeVideo = async (videoId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/videos/${videoId}/like`
      );
      const updatedVideo = response.data.data || response.data;
      
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, likes: (updatedVideo.likes || video.likes || 0) + 1 }
          : video
      ));
    } catch (err) {
      console.error('Error liking video:', err);
    }
  };

  const incrementViews = async (videoId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/videos/${videoId}/view`
      );
      const updatedVideo = response.data.data || response.data;
      
      setVideos(videos.map(video => 
        video.id === videoId 
          ? { ...video, views: (updatedVideo.views || video.views || 0) + 1 }
          : video
      ));
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  };

  return {
    videos,
    isLoading,
    error,
    likeVideo,
    incrementViews
  };
}
