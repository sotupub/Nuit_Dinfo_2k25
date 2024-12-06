"use client";

import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Trophy, Star, Zap, Target, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScenarioCard } from "@/components/scenarios/scenario-card";
import { Leaderboard } from "@/components/scenarios/leaderboard";
import { UserProgress } from "@/components/scenarios/user-progress";
import { useScenarios } from "@/hooks/useScenarios";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

type UserLevel = 'beginner' | 'explorer' | 'expert';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ScenariosPage() {
  const { scenarios, loading, error, fetchScenarios } = useScenarios();
  const [totalPoints, setTotalPoints] = useState(0);
  const [userLevel, setUserLevel] = useState<UserLevel>('beginner');
  const [levelProgress, setLevelProgress] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);

  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  // Calculate level thresholds
  const LEVEL_THRESHOLDS = {
    beginner: { min: 0, max: 500, title: 'Ocean Explorer', icon: '🌊' },
    explorer: { min: 500, max: 1000, title: 'Marine Guardian', icon: '🐋' },
    expert: { min: 1000, max: 2000, title: 'Ocean Master', icon: '🌎' },
  };

  // Function to check if a scenario should be locked
  const isScenarioLocked = (difficulty: string) => {
    if (difficulty === 'easy') return false;
    if (difficulty === 'medium' || difficulty === 'hard') return totalPoints < 500;
    return false;
  };

  const updateProgress = (newPoints: number) => {
    const oldLevel = userLevel;
    let newLevel = userLevel;
    
    // Determine new level based on points
    if (newPoints >= LEVEL_THRESHOLDS.expert.min) {
      newLevel = 'expert';
    } else if (newPoints >= LEVEL_THRESHOLDS.explorer.min) {
      newLevel = 'explorer';
    }

    // Calculate progress percentage within current level
    const currentThreshold = LEVEL_THRESHOLDS[newLevel];
    const pointsInLevel = newPoints - currentThreshold.min;
    const levelRange = currentThreshold.max - currentThreshold.min;
    const progress = (pointsInLevel / levelRange) * 100;
    
    // Update states
    setTotalPoints(newPoints);
    setLevelProgress(Math.min(progress, 100));
    
    // Show level up animation if level changed
    if (newLevel !== oldLevel) {
      setUserLevel(newLevel);
      setShowLevelUpAnimation(true);
      setTimeout(() => setShowLevelUpAnimation(false), 3000);
    }
  };

  // Handle scenario completion
  const handleScenarioComplete = (points: number, scenarioId: string) => {
    if (!completedScenarios.includes(scenarioId)) {
      const newTotalPoints = totalPoints + points;
      updateProgress(newTotalPoints);
      setCompletedScenarios(prev => [...prev, scenarioId]);
    }
  };

  const getCurrentLevelInfo = () => {
    const levelInfo = LEVEL_THRESHOLDS[userLevel];
    const nextLevel = userLevel === 'beginner' ? 'explorer' : userLevel === 'explorer' ? 'expert' : null;
    const pointsToNext = nextLevel ? LEVEL_THRESHOLDS[nextLevel].min - totalPoints : 0;
    
    return {
      title: levelInfo.title,
      icon: levelInfo.icon,
      pointsToNext,
      nextLevelTitle: nextLevel ? LEVEL_THRESHOLDS[nextLevel].title : 'Max Level',
      currentPoints: totalPoints,
      levelMin: levelInfo.min,
      levelMax: levelInfo.max,
    };
  };

  // Filter scenarios based on selected difficulty
  const filteredScenarios = scenarios.filter(scenario => 
    selectedDifficulty === 'all' || scenario.difficulty === selectedDifficulty
  );

  return (
    <div className="min-h-screen p-6 relative bg-gradient-to-b from-[#0a192f] to-[#112240]">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f]/90 via-[#112240]/80 to-[#1a365d]/70" />
        <div className="absolute inset-0 bg-[url('/waves-pattern.svg')] bg-repeat-x animate-wave opacity-5" />
        {/* Dark overlay pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5" />
      </div>

      <div className="container mx-auto space-y-8 relative z-10">
        {/* Level Progress Section */}
        <div className="bg-[#112240]/80 rounded-lg p-6 backdrop-blur-sm border border-[#1e3a5f]">
          <div className="space-y-4">
            {/* Level Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getCurrentLevelInfo().icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-[#ccd6f6]">
                    {getCurrentLevelInfo().title}
                  </h2>
                  <p className="text-sm text-[#8892b0]">
                    {totalPoints} points total
                  </p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className="bg-[#64ffda]/10 text-[#64ffda] border-[#64ffda]/20"
              >
                Level {userLevel === 'beginner' ? 1 : userLevel === 'explorer' ? 2 : 3}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#8892b0]">
                <span>{getCurrentLevelInfo().levelMin} pts</span>
                <span>{getCurrentLevelInfo().levelMax} pts</span>
              </div>
              <div className="relative">
                <Progress 
                  value={levelProgress} 
                  className="h-3 bg-[#1e3a5f]"
                />
                {showLevelUpAnimation && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#64ffda] text-[#0a192f] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    Level Up! 🎉
                  </motion.div>
                )}
              </div>
              {getCurrentLevelInfo().pointsToNext > 0 && (
                <p className="text-sm text-[#8892b0] text-center">
                  {getCurrentLevelInfo().pointsToNext} points to {getCurrentLevelInfo().nextLevelTitle}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Header Section with Enhanced Dark Design */}
        <motion.div 
          variants={item} 
          className="glass-card p-8 rounded-2xl text-center border border-[#1e3a5f]/30 bg-[#0a192f]/40"
        >
          <div className="flex items-center justify-center mb-4">
            <span className="text-5xl filter drop-shadow-glow">{getCurrentLevelInfo().icon}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#64ffda] to-[#63b3ed] bg-clip-text text-transparent">
            Ocean Conservation Scenarios
          </h1>
          <p className="text-[#8892b0]">
            Master ocean conservation through interactive challenges
          </p>
        </motion.div>

        {/* Progress Section with Enhanced Dark Theme */}
        <motion.div 
          variants={item} 
          className="glass-card glow p-6 rounded-xl border border-[#1e3a5f]/30 bg-[#0a192f]/40"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold text-[#ccd6f6]">
                  {getCurrentLevelInfo().title}
                </h3>
                <p className="text-[#8892b0]">
                  {totalPoints} Total Points
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#8892b0]">Next Level</p>
                <p className="font-medium text-[#ccd6f6]">
                  {getCurrentLevelInfo().nextLevelTitle}
                  {getCurrentLevelInfo().pointsToNext > 0 && 
                    ` (${getCurrentLevelInfo().pointsToNext} points to go)`}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <Progress 
                value={levelProgress} 
                className="h-3 bg-[#1e3a5f]/30"
                indicatorClassName="bg-gradient-to-r from-[#64ffda] to-[#63b3ed]"
              />
              <div className="absolute -top-2 left-0 w-full flex justify-between px-2">
                {Object.entries(LEVEL_THRESHOLDS).map(([level, info], index) => (
                  <div
                    key={level}
                    className={`w-4 h-4 rounded-full ${
                      totalPoints >= info.min
                        ? 'bg-[#64ffda]'
                        : 'bg-[#1e3a5f]/50'
                    } transition-colors duration-300 shadow-glow`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content with Dark Theme */}
        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="glass-card p-1 rounded-lg border border-[#1e3a5f]/30 bg-[#0a192f]/40">
            <TabsTrigger 
              value="scenarios" 
              className="data-[state=active]:bg-[#1e3a5f]/40 transition-colors duration-300 text-[#ccd6f6]"
            >
              Scenarios
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard" 
              className="data-[state=active]:bg-[#1e3a5f]/40 transition-colors duration-300 text-[#ccd6f6]"
            >
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios">
            <motion.div variants={container} className="space-y-6">
              {/* Difficulty Filters with Dark Theme */}
              <div className="flex gap-4 flex-wrap">
                {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                  <Badge
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty as any)}
                    className={`glass-card cursor-pointer capitalize transition-all duration-300 border border-[#1e3a5f]/30 ${
                      selectedDifficulty === difficulty
                        ? 'bg-[#1e3a5f]/40 scale-105 text-[#64ffda]'
                        : 'bg-[#0a192f]/40 hover:bg-[#1e3a5f]/30 hover:scale-105 text-[#8892b0]'
                    }`}
                  >
                    {difficulty === 'all' ? '🌊 All' :
                     difficulty === 'easy' ? '🐟 Easy' :
                     difficulty === 'medium' ? '🐋 Medium' : '🌊 Hard'}
                  </Badge>
                ))}
              </div>

              {/* Scenarios Grid with Dark Theme */}
              <motion.div 
                variants={container}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredScenarios.map((scenario) => (
                  <motion.div key={scenario._id} variants={item}>
                    <ScenarioCard
                      scenario={scenario}
                      isLocked={isScenarioLocked(scenario.difficulty)}
                      onComplete={(points) => handleScenarioComplete(points, scenario._id)}
                      userLevel={userLevel}
                      className="glass-card glow h-full transform transition-all duration-300 hover:scale-[1.02] border border-[#1e3a5f]/30 bg-[#0a192f]/40"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <motion.div 
              variants={item} 
              className="glass-card p-6 rounded-xl border border-[#1e3a5f]/30 bg-[#0a192f]/40"
            >
              <Leaderboard 
                className="bg-gradient-to-r from-[#1e3a5f]/10 to-[#64ffda]/5"
                userPoints={totalPoints}
                userLevel={getCurrentLevelInfo().title}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}