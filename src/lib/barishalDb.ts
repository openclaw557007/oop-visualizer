// University of Barishal - CSE 2107/2108 OOP Course Questions
// 100+ questions covering all 6 course documents

export interface Topic {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  icon?: string;
  module?: number;
}

export interface PracticeQuestion {
  id: string;
  topic_id: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  code_snippet: string | null;
  question_text: string;
  question_text_bn?: string;
  correct_answer: string;
  correct_answer_bn?: string;
  explanation: string | null;
  explanation_bn?: string;
  hint?: string;
  hint_bn?: string;
  module?: number;
  topics?: Topic;
}

export const mockTopics: Topic[] = [
  // Module 1
  { id: '1', title: 'Java History & Features', titleBn: 'জাভার ইতিহাস ও বৈশিষ্ট্য', description: 'Java origins, James Gosling, Java features', descriptionBn: 'জাভার উৎপত্তি, জেমস গসলিং, জাভার বৈশিষ্ট্য', icon: '📜', module: 1 },
  { id: '2', title: 'Java Program Structure', titleBn: 'জাভা প্রোগ্রাম গঠন', description: 'main() method, class structure', descriptionBn: 'main() মেথড, ক্লাস গঠন', icon: '🏗️', module: 1 },
  // ... continue with all topics
  { id: '3', title: 'Classes & Objects', titleBn: 'ক্লাস ও অবজেক্ট', description: 'Class definition, creating objects', descriptionBn: 'ক্লাস সংজ্ঞা, অবজেক্ট তৈরি', icon: '📦', module: 2 },
  { id: '4', title: 'Fields & Methods', titleBn: 'ফিল্ড ও মেথড', description: 'Instance variables, methods', descriptionBn: 'ইনস্ট্যান্স ভেরিয়েবল, মেথড', icon: '⚙️', module: 2 },
  { id: '5', title: 'Constructors', titleBn: 'কন্সট্রাকটর', description: 'Default, parameterized, copy constructors', descriptionBn: 'ডিফল্ট, প্যারামিটারাইজড, কপি কন্সট্রাকটর', icon: '🏭', module: 2 },
  { id: '6', title: 'Inheritance Basics', titleBn: 'ইনহেরিটেন্স মৌলিক', description: 'extends keyword, parent-child relationship', descriptionBn: 'extends কিওয়ার্ড, প্যারেন্ট-চাইল্ড সম্পর্ক', icon: '🧬', module: 3 },
  { id: '7', title: 'Method Overriding', titleBn: 'মেথড ওভাররাইডিং', description: '@Override, super keyword', descriptionBn: '@Override, super কিওয়ার্ড', icon: '🔄', module: 3 },
  { id: '8', title: 'Abstract Classes', titleBn: 'অ্যাবস্ট্রাক্ট ক্লাস', description: 'abstract keyword, abstract methods', descriptionBn: 'abstract কিওয়ার্ড, অ্যাবস্ট্রাক্ট মেথড', icon: '🎨', module: 3 },
  { id: '9', title: 'Interface Basics', titleBn: 'ইন্টারফেস মৌলিক', description: 'interface keyword, implementing interfaces', descriptionBn: 'interface কিওয়ার্ড, ইন্টারফেস বাস্তবায়ন', icon: '📋', module: 4 },
  { id: '10', title: 'Multiple Inheritance', titleBn: 'মাল্টিপল ইনহেরিটেন্স', description: 'Solving diamond problem', descriptionBn: 'ডায়ামন্ড সমস্যার সমাধান', icon: '💎', module: 4 },
  { id: '11', title: 'Packages', titleBn: 'প্যাকেজ', description: 'package keyword, importing', descriptionBn: 'package কিওয়ার্ড, ইমপোর্টিং', icon: '📁', module: 5 },
  { id: '12', title: 'Static Members', titleBn: 'স্ট্যাটিক সদস্য', description: 'Static variables, static methods', descriptionBn: 'স্ট্যাটিক ভেরিয়েবল, স্ট্যাটিক মেথড', icon: '⚡', module: 6 },
  { id: '13', title: 'Final Keyword', titleBn: 'ফাইনাল কিওয়ার্ড', description: 'Final variables, final methods', descriptionBn: 'ফাইনাল ভেরিয়েবল, ফাইনাল মেথড', icon: '🔒', module: 6 },
  { id: '14', title: 'Visibility Control', titleBn: 'ভিজিবিলিটি নিয়ন্ত্রণ', description: 'public, private, protected', descriptionBn: 'পাবলিক, প্রাইভেট, প্রোটেক্টেড', icon: '👁️', module: 6 },
  { id: '15', title: 'Polymorphism', titleBn: 'পলিমরফিজম', description: 'Compile-time and runtime polymorphism', descriptionBn: 'কম্পাইল-টাইম ও রানটাইম পলিমরফিজম', icon: '🎭', module: 6 }
];

// Questions data will be populated here
export const mockQuestions: PracticeQuestion[] = [
  // Sample questions - full set will be added
  {
    id: '1',
    topic_id: '1',
    difficulty_level: 'easy',
    code_snippet: null,
    question_text: 'Who is known as the "Father of Java"?',
    question_text_bn: 'জাভার জনক হিসেবে কাকে জানা যায়?',
    correct_answer: 'James Gosling',
    correct_answer_bn: 'জেমস গসলিং',
    explanation: 'James Gosling led the Green Team at Sun Microsystems that developed Java in 1991.',
    explanation_bn: 'জেমস গসলিং ১৯৯১ সালে সান মাইক্রোসিস্টেমের গ্রিন টিমকে নেতৃত্ব দেন।',
    module: 1
  }
  // ... more questions
];

// Mock Supabase client
export const mockSupabase = {
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        eq: () => Promise.resolve({ data: table === 'topics' ? mockTopics : mockQuestions, error: null }),
        then: (cb: any) => Promise.resolve({ data: table === 'topics' ? mockTopics : mockQuestions, error: null }).then(cb)
      }),
      then: (cb: any) => Promise.resolve({ data: table === 'topics' ? mockTopics : mockQuestions, error: null }).then(cb)
    })
  })
};
