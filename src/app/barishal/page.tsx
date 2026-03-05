'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Code2, 
  MemoryStick, 
  Menu,
  GraduationCap,
  Globe,
  BookOpen
} from 'lucide-react';
import 'reactflow/dist/style.css';

export default function BarishalHome() {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  
  const t = (key: string) => {
    const translations: Record<string, Record<'en' | 'bn', string>> = {
      'welcome': {
        'en': 'Welcome to University of Barishal OOP Learning Platform',
        'bn': 'বরিশাল বিশ্ববিদ্যালয় OOP লার্নিং প্ল্যাটফর্মে স্বাগতম'
      },
      'course': {
        'en': 'CSE-2107 / CSE-2108: Object Oriented Programming',
        'bn': 'সিএসই-২১০৭ / সিএসই-২১০৮: অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং'
      },
      'instructor': {
        'en': 'Instructor: Md. Rashid Al Asif',
        'bn': 'প্রশিক্ষক: মো. রাশিদ আল আসিফ'
      },
      'department': {
        'en': 'Department of Computer Science and Engineering',
        'bn': 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং বিভাগ'
      },
      'modules': {
        'en': 'Course Modules',
        'bn': 'কোর্স মডিউল'
      },
      'startPractice': {
        'en': 'Start Practice',
        'bn': 'প্রাকটিস শুরু করো'
      },
      'visualizer': {
        'en': 'Memory Visualizer',
        'bn': 'মেমরি ভিজুয়ালাইজার'
      }
    };
    return translations[key]?.[language] || key;
  };

  const modules = [
    { id: 1, title: 'Java History & Features', titleBn: 'জাভার ইতিহাস ও বৈশিষ্ট্য', icon: '📜' },
    { id: 2, title: 'Classes, Objects & Methods', titleBn: 'ক্লাস, অবজেক্ট ও মেথড', icon: '📦' },
    { id: 3, title: 'Inheritance', titleBn: 'ইনহেরিটেন্স', icon: '🧬' },
    { id: 4, title: 'Interfaces', titleBn: 'ইন্টারফেস', icon: '📋' },
    { id: 5, title: 'Packages', titleBn: 'প্যাকেজ', icon: '📁' },
    { id: 6, title: 'Advanced Topics', titleBn: 'অ্যাডভান্সড টপিক', icon: '⚡' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header with University Branding */}
      <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* University Logo Area */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold">{t('university')}</h1>
                <p className="text-blue-200 text-sm md:text-base">{t('department')}</p>
              </div>
            </div>
            
            {/* Course Info & Language Toggle */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-semibold">{t('course')}</p>
                <p className="text-blue-200 text-sm">{t('instructor')}</p>
              </div>
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6"
          >
            {t('welcome')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
          >
            {t('course')}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/barishal/practice"
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-blue-500/25"
            >
              <BookOpen className="w-5 h-5" />
              {t('startPractice')}
            </a>
            <a
              href="/"
              className="flex items-center gap-2 px-8 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-xl font-semibold text-lg transition-colors"
            >
              <Code2 className="w-5 h-5" />
              {t('visualizer')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white text-center mb-8">
          {t('modules')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
            >
              <div className="text-4xl mb-4">{module.icon}</div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                Module {module.id}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {language === 'en' ? module.title : module.titleBn}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2026 University of Barishal | Department of CSE</p>
          <p className="text-sm mt-2">CSE-2107 / CSE-2108 - Object Oriented Programming</p>
        </div>
      </footer>
    </div>
  );
}
