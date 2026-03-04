'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Target, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ArrowLeft,
  Filter,
  BookOpen,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
  Lock,
  Unlock,
  Timer,
  TrendingUp
} from 'lucide-react';
import { mockTopics, mockQuestions, Topic, PracticeQuestion } from '@/lib/mockDb';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UserStats {
  xp: number;
  level: number;
  streak: number;
  correctAnswers: number;
  totalAttempts: number;
  badges: string[];
  unlockedTopics: string[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: UserStats) => boolean;
  unlocked: boolean;
}

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// ACHIEVEMENTS SYSTEM
// ============================================================================

const createAchievements = (stats: UserStats): Achievement[] => [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Answer your first question correctly',
    icon: <Star className="w-5 h-5" />,
    condition: (s) => s.correctAnswers >= 1,
    unlocked: stats.correctAnswers >= 1
  },
  {
    id: 'streak-starter',
    name: 'On Fire',
    description: 'Get a 3-answer streak',
    icon: <Flame className="w-5 h-5" />,
    condition: (s) => s.streak >= 3,
    unlocked: stats.streak >= 3
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Answer 10 questions correctly',
    icon: <Trophy className="w-5 h-5" />,
    condition: (s) => s.correctAnswers >= 10,
    unlocked: stats.correctAnswers >= 10
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 5 questions in under 30 seconds each',
    icon: <Zap className="w-5 h-5" />,
    condition: () => false, // Would need timing tracking
    unlocked: false
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Get 5 consecutive correct answers',
    icon: <Target className="w-5 h-5" />,
    condition: (s) => s.streak >= 5,
    unlocked: stats.streak >= 5
  }
];

// ============================================================================
// XP SYSTEM
// ============================================================================

const calculateXP = (difficulty: string, isCorrect: boolean, streak: number): number => {
  if (!isCorrect) return 0;
  
  const baseXP = {
    easy: 10,
    medium: 20,
    hard: 30
  };
  
  const streakBonus = Math.min(streak * 2, 10); // Max 10 bonus
  return baseXP[difficulty as keyof typeof baseXP] + streakBonus;
};

const getLevelFromXP = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

const getXPForNextLevel = (level: number): number => {
  return level * 100;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PracticeArena() {
  // State
  const [questions] = useState<PracticeQuestion[]>(mockQuestions);
  const [topics] = useState<Topic[]>(mockTopics);
  const [filteredQuestions, setFilteredQuestions] = useState<PracticeQuestion[]>(mockQuestions);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showHint, setShowHint] = useState(false);
  
  // Gamification State
  const [stats, setStats] = useState<UserStats>({
    xp: 0,
    level: 1,
    streak: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    badges: [],
    unlockedTopics: []
  });
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  
  // Timer
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Initialize achievements
  useEffect(() => {
    setAchievements(createAchievements(stats));
  }, [stats]);
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Filter questions
  useEffect(() => {
    let filtered = [...questions];
    
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topic_id === selectedTopic);
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty_level === selectedDifficulty);
    }
    
    setFilteredQuestions(filtered);
    setCurrentQuestionIndex(0);
    resetQuestion();
  }, [selectedTopic, selectedDifficulty, questions]);
  
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  
  const resetQuestion = () => {
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
    setShowHint(false);
    setStartTime(Date.now());
    setElapsedTime(0);
  };
  
  const triggerConfetti = () => {
    const end = Date.now() + 1000;
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];
    
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };
  
  const submitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    
    const userAns = userAnswer.trim().toLowerCase();
    const correctAns = currentQuestion.correct_answer.trim().toLowerCase();
    const correctVariants = correctAns.split(',').map(s => s.trim());
    const isAnsCorrect = correctVariants.some(variant => userAns.includes(variant));
    
    setIsCorrect(isAnsCorrect);
    setShowResult(true);
    
    // Update stats
    setStats(prev => {
      const newStreak = isAnsCorrect ? prev.streak + 1 : 0;
      const newCorrect = isAnsCorrect ? prev.correctAnswers + 1 : prev.correctAnswers;
      const earnedXP = calculateXP(currentQuestion.difficulty_level, isAnsCorrect, newStreak);
      const newXP = prev.xp + earnedXP;
      const newLevel = getLevelFromXP(newXP);
      
      // Check for new badges
      const newStats = {
        ...prev,
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        correctAnswers: newCorrect,
        totalAttempts: prev.totalAttempts + 1
      };
      
      // Check achievements
      const newAchievements = createAchievements(newStats);
      const newlyUnlockedAchievements = newAchievements.filter(
        a => a.unlocked && !achievements.find(oa => oa.id === a.id)?.unlocked
      );
      
      if (newlyUnlockedAchievements.length > 0) {
        setNewlyUnlocked(newlyUnlockedAchievements.map(a => a.id));
        setShowAchievementModal(true);
        setTimeout(() => triggerConfetti(), 300);
      }
      
      return newStats;
    });
    
    if (isAnsCorrect) {
      triggerConfetti();
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestion();
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      resetQuestion();
    }
  };
  
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-rose-600';
      default: return 'from-slate-500 to-slate-600';
    }
  };
  
  const getDifficultyBadge = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  // Calculate XP progress
  const xpForNextLevel = getXPForNextLevel(stats.level);
  const xpProgress = (stats.xp % 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-20">
      {/* Achievement Modal */}
      <AnimatePresence>
        {showAchievementModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowAchievementModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700/50 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Achievement Unlocked!</h2>
              <p className="text-slate-400 mb-6">You've earned new badges!</p>
              <div className="space-y-3">
                {achievements.filter(a => newlyUnlocked.includes(a.id)).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                      {achievement.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{achievement.name}</p>
                      <p className="text-sm text-slate-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowAchievementModal(false)}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Level & XP */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                  {stats.level}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold">Level {stats.level}</p>
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{xpProgress}/100 XP</p>
                </div>
              </div>
              
              {/* Streak */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 rounded-full border border-orange-500/30">
                <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-orange-400' : 'text-slate-400'}`} />
                <span className="font-semibold text-orange-400">{stats.streak}</span>
                <span className="text-sm text-slate-400 hidden sm:inline">streak</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Target className="w-4 h-4" />
                <span>{stats.correctAnswers}/{stats.totalAttempts} correct</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Trophy className="w-4 h-4" />
                <span>{achievements.filter(a => a.unlocked).length}/{achievements.length} badges</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Practice Arena
          </h1>
          <p className="text-slate-400">Master Java OOP through interactive challenges</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex flex-wrap gap-3"
        >
          <motion.div variants={itemVariants} className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Topics</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </select>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span>{filteredQuestions.length} questions</span>
          </motion.div>
        </motion.div>

        {/* Main Question Card */}
        <AnimatePresence mode="wait">
          {currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-6 border-b border-slate-700/50">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyBadge(currentQuestion.difficulty_level)}`}>
                      {currentQuestion.difficulty_level.toUpperCase()}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {currentQuestion.topics?.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      <span>{elapsedTime}s</span>
                    </div>
                    <div className="text-slate-600">
                      Question {currentQuestionIndex + 1} of {filteredQuestions.length}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mt-4 leading-relaxed">
                  {currentQuestion.question_text}
                </h2>
              </div>

              {/* Code Snippet */}
              {currentQuestion.code_snippet && (
                <div className="border-b border-slate-700/50">
                  <div className="px-4 py-2 bg-slate-900/50 text-xs text-slate-400 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Code Snippet
                  </div>
                  <div className="h-48 sm:h-56">
                    <Editor
                      height="100%"
                      defaultLanguage="java"
                      value={currentQuestion.code_snippet}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        lineNumbers: 'on',
                        readOnly: true,
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Answer Section */}
              <div className="p-6">
                {/* Hint */}
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-200">
                        Think about the access modifiers and how they affect visibility across different scopes.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={showResult}
                    className={`w-full px-4 py-3 bg-slate-900/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none transition-all ${
                      showResult
                        ? isCorrect
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-red-500/50 bg-red-500/10'
                        : 'border-slate-700 focus:border-indigo-500'
                    }`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !showResult) submitAnswer();
                      if (e.key === 'ArrowRight' && showResult) nextQuestion();
                    }}
                  />
                  {showResult && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      disabled={showResult}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {!showResult ? (
                      <button
                        onClick={submitAnswer}
                        disabled={!userAnswer.trim()}
                        className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
                      >
                        <Sparkles className="w-4 h-4" />
                        Submit
                      </button>
                    ) : (
                      <>
                        {currentQuestionIndex > 0 && (
                          <button
                            onClick={prevQuestion}
                            className="flex items-center gap-1 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            Prev
                          </button>
                        )}
                        {currentQuestionIndex < filteredQuestions.length - 1 && (
                          <button
                            onClick={nextQuestion}
                            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 rounded-lg font-semibold transition-all"
                          >
                            Next
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Result Feedback */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-4 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="font-semibold text-green-400">Correct! +{calculateXP(currentQuestion.difficulty_level, true, stats.streak)} XP</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-400" />
                            <span className="font-semibold text-red-400">Incorrect</span>
                          </>
                        )}
                      </div>
                      
                      {!isCorrect && (
                        <p className="text-slate-300 mb-2">
                          Correct answer: <span className="text-green-400 font-semibold">{currentQuestion.correct_answer}</span>
                        </p>
                      )}
                      
                      {currentQuestion.explanation && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <p className="text-sm text-slate-400 mb-1">Explanation:</p>
                          <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="px-6 pb-6">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span>Progress</span>
                  <span className="ml-auto">{currentQuestionIndex + 1} / {filteredQuestions.length}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                <Filter className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className="text-slate-400">Try adjusting your filters to see more questions.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                className={`p-4 rounded-xl border text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                    : 'bg-slate-800/50 border-slate-700/50 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-500/30 text-yellow-400' : 'bg-slate-700 text-slate-500'
                }`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="w-5 h-5" />}
                </div>
                <p className="text-sm font-medium mb-1">{achievement.name}</p>
                <p className="text-xs text-slate-400">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
