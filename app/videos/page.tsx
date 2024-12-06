"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Heart, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/hooks/use-videos";
import { Skeleton } from "@/components/ui/skeleton";

const categories = ["All", "Environment", "Wildlife", "Conservation", "Education"];

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const { videos, isLoading, error, likeVideo, incrementViews } = useVideos(activeCategory);

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId);
    incrementViews(videoId);
  };

  const selectedVideoData = videos.find(v => v.id === selectedVideo);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001F3F] to-[#003366] text-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/ocean-waves.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold mb-4"
          >
            Ocean Conservation Videos
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-200 max-w-2xl"
          >
            Dive into our collection of educational videos about marine life and conservation
          </motion.p>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-10 bg-[#001F3F]/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-6 py-2 rounded-full transition-all whitespace-nowrap
                  ${activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white/80'}
                `}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="text-red-400 text-center py-8">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-xl overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))
          ) : (
            videos.map((video) => (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Video Info Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                      <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                      <p className="text-sm text-blue-200 line-clamp-2 mb-4">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={() => handleVideoClick(video.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Watch Now
                          </Button>
                          <span className="flex items-center text-sm text-blue-200">
                            <Clock className="w-4 h-4 mr-1" />
                            {video.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-blue-200">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              likeVideo(video.id);
                            }}
                            className="flex items-center gap-1 hover:text-blue-400"
                          >
                            <Heart className="w-4 h-4" />
                            {video.likes || 0}
                          </button>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {video.views || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideoData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl"
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden"
              >
                <Button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
                <iframe
                  src={selectedVideoData.url}
                  className="w-full h-full"
                  allowFullScreen
                  title={selectedVideoData.title}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}