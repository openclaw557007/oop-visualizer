'use client';

import { useState, useEffect } from 'react';
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
  Globe,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { mockTopics, mockQuestions, Topic, PracticeQuestion } from '@/lib/barishalDb';

// Language type
 type Language = 'en' | 'bn';

// Translation helper
const t = (key: string, lang: Language) => {
  const translations: Record<string, Record<Language, string>> = {
    'practiceArena': {
      'en': 'Practice Arena',
      'bn': 'প্রাকটিস এরিয়া'
    },
    'masterJavaOOP': {
      'en': 'Master Java OOP through interactive challenges',
      'bn': 'ইন্টারেক্টিভ চ্যালেঞ্জের মাধ্যমে জাভা OOP শেখো'
    },
    'topic': {
      'en': 'Topic',
      'bn': 'টপিক'
    },
    'allTopics': {
      'en': 'All Topics',
      'bn': 'সব টপিক'
    },
    'difficulty': {
      'en': 'Difficulty',
      'bn': 'কঠিনতা'
    },
    'allLevels': {
      'en': 'All Levels',
      'bn': 'সব লেভেল'
    },
    'easy': {
      'en': 'Easy',
      'bn': 'সহজ'
    },
    'medium': {
      'en': 'Medium',
      'bn': 'মাঝারি'
    },
    'hard': {
      'en': 'Hard',
      'bn': 'কঠিন'
    },
    'applyFilters': {
      'en': 'Apply Filters',
      'bn': 'ফিল্টার প্রয়োগ করো'
    },
    'questions': {
      'en': 'questions',
      'bn': 'প্রশ্ন'
    },
    'yourAnswer': {
      'en': 'Your Answer',
      'bn': 'তোমার উত্তর'
    },
    'typeAnswer': {
      'en': 'Type your answer here...',
      'bn': 'এখানে উত্তর লিখো...'
    },
    'submit': {
      'en': 'Submit',
      'bn': 'জমা দাও'
    },
    'submitAnswer': {
      'en': 'Submit Answer',
      'bn': 'উত্তর জমা দাও'
    },
    'correct': {
      'en': 'Correct',
      'bn': 'সঠিক'
    },
    'incorrect': {
      'en': 'Incorrect',
      'bn': 'ভুল'
    },
    'correctAnswer': {
      'en': 'Correct answer',
      'bn': 'সঠিক উত্তর'
    },
    'explanation': {
      'en': 'Explanation',
      'bn': 'ব্যাখ্যা'
    },
    'showHint': {
      'en': 'Show Hint',
      'bn': 'হিন্ট দেখাও'
    },
    'hideHint': {
      'en': 'Hide Hint',
      'bn': 'হিন্ট লুকাও'
    },
    'next': {
      'en': 'Next',
      'bn': 'পরবর্তী'
    },
    'previous': {
      'en': 'Previous',
      'bn': 'পূর্ববর্তী'
    },
    'progress': {
      'en': 'Progress',
      'bn': 'প্রগ্রেস'
    },
    'achievements': {
      'en': 'Achievements',
      'bn': 'অর্জন'
    },
    'level': {
      'en': 'Level',
      'bn': 'লেভেল'
    },
    'streak': {
      'en': 'streak',
      'bn': 'স্ট্রিক'
    },
    'selectQuestion': {
      'en': 'Select a question to begin practicing',
      'bn': 'প্রাকটিস শুরু করতে একটি প্রশ্ন বেছে নাও'
    },
    'university': {
      'en': 'University of Barishal',
      'bn': 'বরিশাল বিশ্ববিদ্যালয়'
    },
    'courseCode': {
      'en': 'CSE-2107 / CSE-2108',
      'bn': 'সিএসই-২১০৭ / সিএসই-২১০৮'
    },
    'instructor': {
      'en': 'Instructor: Md. Rashid Al Asif',
      'bn': 'প্রশিক্ষক: মো. রাশিদ আল আসিফ'
    }
  };
  
  return translations[key]?.[lang] || key;
};

// ... rest of component code would go here
