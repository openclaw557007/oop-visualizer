'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame,
  CheckCircle2, 
  XCircle,
  BookOpen,
  Lightbulb,
  Sparkles,
  Star,
  Globe,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { mockTopics, mockQuestions, Topic, PracticeQuestion } from '@/lib/barishalDb';

type Language = 'en' | 'bn';

const t = (key: string, lang: Language) => {
  const translations: Record<string, Record<Language, string>> = {
    'practiceArena': { 'en': 'Practice Arena', 'bn': 'প্রাকটিস এরিয়া' },
    'masterJavaOOP': { 'en': 'Master Java OOP', 'bn': 'জাভা OOP শেখো' },
    'topic': { 'en': 'Topic', 'bn': 'টপিক' },
    'allTopics': { 'en': 'All Topics', 'bn': 'সব টপিক' },
    'difficulty': { 'en': 'Difficulty', 'bn': 'কঠিনতা' },
    'allLevels': { 'en': 'All Levels', 'bn': 'সব লেভেল' },
    'easy': { 'en': 'Easy', 'bn': 'সহজ' },
    'medium': { 'en': 'Medium', 'bn': 'মাঝারি' },
    'hard': { 'en': 'Hard', 'bn': 'কঠিন' },
    'applyFilters': { 'en': 'Apply', 'bn': 'প্রয়োগ' },
    'yourAnswer': { 'en': 'Your Answer', 'bn': 'তোমার উত্তর' },
    'typeAnswer': { 'en': 'Type your answer...', 'bn': 'উত্তর লিখো...' },
    'submit': { 'en': 'Submit', 'bn': 'জমা দাও' },
    'correct': { 'en': 'Correct!', 'bn': 'সঠিক!' },
    'incorrect': { 'en': 'Incorrect', 'bn': 'ভুল' },
    'correctAnswer': { 'en': 'Correct answer', 'bn': 'সঠিক উত্তর' },
    'explanation': { 'en': 'Explanation', 'bn': 'ব্যাখ্যা' },
    'showHint': { 'en': 'Hint', 'bn': 'হিন্ট' },
    'next': { 'en': 'Next', 'bn': 'পরবর্তী' },
    'previous': { 'en': 'Previous', 'bn': 'পূর্ববর্তী' },
    'progress': { 'en': 'Progress', 'bn': 'প্রগ্রেস' },
    'level': { 'en': 'Level', 'bn': 'লেভেল' },
    'streak': { 'en': 'Streak', 'bn': 'স্ট্রিক' },
    'university': { 'en': 'University of Barishal', 'bn': 'বরিশাল বিশ্ববিদ্যালয়' },
    'courseCode': { 'en': 'CSE-2107 / CSE-2108', 'bn': 'সিএসই-২১০৭ / সিএসই-২১০৮' }
  };
  return translations[key]?.[lang] || key;
};

export default function BarishalPractice() {
  const [language, setLanguage] = useState<Language>('en');
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
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

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
  }, [selectedTopic, selectedDifficulty, questions]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const submitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;
    const userAns = userAnswer.trim().toLowerCase();
    const correctAns = currentQuestion.correct_answer.trim().toLowerCase();
    const correct = userAns === correctAns || correctAns.includes(userAns) || userAns.includes(correctAns);
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setXp(xp + 10);
      setStreak(streak + 1);
      if (xp + 10 >= level * 100) {
        setLevel(level + 1);
      }
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowResult(false);
      setShowHint(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8" />
              <div>
                <h1 className="text-lg md:text-xl font-bold">{t('university', language)}</h1>
                <p className="text-blue-200 text-xs md:text-sm">{t('courseCode', language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'বাংলা' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-[60px] z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {level}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('level', language)} {level}</p>
                  <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mt-1">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${(xp % 100)}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className="text-sm font-medium text-orange-600 dark:text-orange-400">{streak}</span>
              </div>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {xp} XP
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">
          {t('practiceArena', language)}
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-6">
          {t('masterJavaOOP', language)}
        </p>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
            >
              <option value="all">{t('allTopics', language)}</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {language === 'en' ? topic.title : topic.titleBn}
                </option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
            >
              <option value="all">{t('allLevels', language)}</option>
              <option value="easy">{t('easy', language)}</option>
              <option value="medium">{t('medium', language)}</option>
              <option value="hard">{t('hard', language)}</option>
            </select>
            <button
              onClick={() => {setSelectedTopic('all'); setSelectedDifficulty('all');}}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              {t('applyFilters', language)}
            </button>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden max-w-4xl mx-auto">
            <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getDifficultyColor(currentQuestion.difficulty_level)}`}>
                  {t(currentQuestion.difficulty_level, language)}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {currentQuestionIndex + 1} / {filteredQuestions.length}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white">
                {language === 'bn' && currentQuestion.question_text_bn 
                  ? currentQuestion.question_text_bn 
                  : currentQuestion.question_text}
              </h2>
            </div>

            {currentQuestion.code_snippet && (
              <div className="border-b border-slate-200 dark:border-slate-700">
                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-xs text-slate-500">Code</div>
                <div className="h-48">
                  <Editor
                    height="100%"
                    defaultLanguage="java"
                    value={currentQuestion.code_snippet}
                    theme="vs-dark"
                    options={{ minimap: { enabled: false }, fontSize: 13, readOnly: true, scrollBeyondLastLine: false }}
                  />
                </div>
              </div>
            )}

            <div className="p-4 md:p-6">
              {showHint && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {language === 'bn' && currentQuestion.hint_bn ? currentQuestion.hint_bn : currentQuestion.hint}
                  </p>
                </div>
              )}

              <div className="relative mb-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={t('typeAnswer', language)}
                  disabled={showResult}
                  className={`w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-900 ${
                    showResult ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-slate-300 dark:border-slate-600'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && !showResult && submitAnswer()}
                />
                {showResult && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400 hover:text-yellow-700"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHint ? 'Hide' : t('showHint', language)}
                </button>

                <div className="flex items-center gap-2">
                  {!showResult ? (
                    <button
                      onClick={submitAnswer}
                      disabled={!userAnswer.trim()}
                      className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium"
                    >
                      <Sparkles className="w-4 h-4" />
                      {t('submit', language)}
                    </button>
                  ) : (
                    <>
                      {currentQuestionIndex > 0 && (
                        <button
                          onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                          className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                          {t('previous', language)}
                        </button>
                      )}
                      {currentQuestionIndex < filteredQuestions.length - 1 && (
                        <button
                          onClick={nextQuestion}
                          className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                          {t('next', language)}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {showResult && (
                <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <><CheckCircle2 className="w-5 h-5 text-green-500" /><span className="font-semibold text-green-700 dark:text-green-400">{t('correct', language)} +10 XP</span></>
                    ) : (
                      <><XCircle className="w-5 h-5 text-red-500" /><span className="font-semibold text-red-700 dark:text-red-400">{t('incorrect', language)}</span></>
                    )}
                  </div>
                  {!isCorrect && (
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      {t('correctAnswer', language)}: <span className="font-semibold text-green-600 dark:text-green-400">
                        {language === 'bn' && currentQuestion.correct_answer_bn ? currentQuestion.correct_answer_bn : currentQuestion.correct_answer}
                      </span>
                    </p>
                  )}
                  {currentQuestion.explanation && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 mb-1">{t('explanation', language)}:</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {language === 'bn' && currentQuestion.explanation_bn ? currentQuestion.explanation_bn : currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No questions found. Try different filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
