'use client';

import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { mockTopics, mockQuestions, Topic, PracticeQuestion } from '@/lib/mockDb';

export default function PracticeArena() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentQuestion, setCurrentQuestion] = useState<PracticeQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from mock database
    setTopics(mockTopics);
    setQuestions(mockQuestions);
    setLoading(false);
  }, []);

  const handleFilterChange = () => {
    let filtered = [...mockQuestions];
    
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(q => q.topic_id === selectedTopic);
    }
    
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty_level === selectedDifficulty);
    }
    
    setQuestions(filtered);
  };

  const selectQuestion = (question: PracticeQuestion) => {
    setCurrentQuestion(question);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
  };

  const submitAnswer = () => {
    if (!currentQuestion) return;
    
    const userAns = userAnswer.trim().toLowerCase();
    const correctAns = currentQuestion.correct_answer.trim().toLowerCase();
    
    // Support multiple correct answers separated by comma
    const correctVariants = correctAns.split(',').map(s => s.trim());
    const correct = correctVariants.some(variant => userAns.includes(variant));
    
    setIsCorrect(correct);
    setShowResult(true);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-400 bg-green-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'hard': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-green-400">Practice Arena</h1>
        <p className="text-gray-400 mb-8">Master Java OOP concepts with hands-on practice questions</p>

        {/* Filters */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Topic</label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleFilterChange}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question List */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Questions ({questions.length})</h2>
            
            {loading ? (
              <div className="text-gray-400">Loading questions...</div>
            ) : questions.length === 0 ? (
              <div className="text-gray-400">No questions found</div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {questions.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => selectQuestion(q)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentQuestion?.id === q.id
                        ? 'bg-blue-900/30 border-blue-500'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(q.difficulty_level)}`}>
                        {q.difficulty_level}
                      </span>
                      <span className="text-xs text-gray-500">{q.topics?.title}</span>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{q.question_text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Question Detail */}
          <div className="lg:col-span-2">
            {currentQuestion ? (
              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm px-3 py-1 rounded ${getDifficultyColor(currentQuestion.difficulty_level)}`}>
                      {currentQuestion.difficulty_level.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-400">{currentQuestion.topics?.title}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{currentQuestion.question_text}</h3>
                </div>

                {currentQuestion.code_snippet && (
                  <div className="border-b border-gray-700">
                    <div className="p-2 bg-gray-900 text-xs text-gray-400">Code Snippet</div>
                    <div className="h-48">
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

                <div className="p-4">
                  <label className="block text-sm text-gray-400 mb-2">Your Answer:</label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                  />
                  
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    className="mt-3 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white transition-colors"
                  >
                    Submit Answer
                  </button>

                  {showResult && (
                    <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? '✓' : '✗'}
                        </span>
                        <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      
                      {!isCorrect && (
                        <p className="text-gray-300 mb-2">
                          Correct answer: <span className="text-green-400 font-semibold">{currentQuestion.correct_answer}</span>
                        </p>
                      )}
                      
                      {currentQuestion.explanation && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-sm text-gray-400 mb-1">Explanation:</p>
                          <p className="text-gray-300">{currentQuestion.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-8 text-center">
                <p className="text-gray-400 mb-4">Select a question from the list to begin practicing</p>
                <div className="text-sm text-gray-500">
                  <p>✓ 20 practice questions available</p>
                  <p>✓ Covers all 10 Java OOP topics</p>
                  <p>✓ Interactive code snippets</p>
                  <p>✓ Instant feedback with explanations</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
