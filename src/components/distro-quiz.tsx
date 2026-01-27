'use client';

import { useState } from 'react';
import { DistroSchema } from '@/types/distro.schema';
import Link from 'next/link';
import { z } from 'zod';

type Distro = z.infer<typeof DistroSchema>;

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    weight: string[];
  }[];
}

const questions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'What is your experience level with Linux?',
    options: [
      { value: 'beginner', label: 'Beginner - New to Linux', weight: ['beginner'] },
      { value: 'intermediate', label: 'Intermediate - Some Linux experience', weight: ['intermediate'] },
      { value: 'advanced', label: 'Advanced - Comfortable with command line', weight: ['advanced'] },
    ],
  },
  {
    id: 'purpose',
    question: 'What will you primarily use Linux for?',
    options: [
      { value: 'daily', label: 'Daily computing (web browsing, office work)', weight: ['daily', 'stable'] },
      { value: 'programming', label: 'Software development & programming', weight: ['development', 'programming'] },
      { value: 'gaming', label: 'Gaming & entertainment', weight: ['gaming'] },
      { value: 'server', label: 'Server & enterprise applications', weight: ['server', 'enterprise'] },
      { value: 'creative', label: 'Creative work (design, video editing)', weight: ['creative'] },
    ],
  },
  {
    id: 'interface',
    question: 'What kind of interface do you prefer?',
    options: [
      { value: 'windows-like', label: 'Windows-like (familiar and easy)', weight: ['windows-like', 'beginner-friendly'] },
      { value: 'mac-like', label: 'macOS-like (elegant and polished)', weight: ['mac-like', 'elegant'] },
      { value: 'minimal', label: 'Minimal & lightweight', weight: ['lightweight', 'minimal'] },
      { value: 'customizable', label: 'Highly customizable', weight: ['customizable', 'advanced'] },
    ],
  },
  {
    id: 'installation',
    question: 'How do you plan to install Linux?',
    options: [
      { value: 'virtual', label: 'Virtual Machine (VirtualBox, VMware)', weight: ['vm-friendly'] },
      { value: 'dual-boot', label: 'Dual boot (alongside Windows/macOS)', weight: ['dual-boot'] },
      { value: 'usb-live', label: 'Try first from USB (live mode)', weight: ['live-usb'] },
      { value: 'full-install', label: 'Full installation (replace existing OS)', weight: ['full-install'] },
    ],
  },
  {
    id: 'system',
    question: 'What are your system specifications?',
    options: [
      { value: 'old', label: 'Older hardware (4GB RAM or less)', weight: ['lightweight', 'low-resource'] },
      { value: 'moderate', label: 'Moderate hardware (4-8GB RAM)', weight: ['moderate'] },
      { value: 'modern', label: 'Modern hardware (8GB+ RAM)', weight: ['modern', 'feature-rich'] },
      { value: 'high-end', label: 'High-end hardware (gaming PC/workstation)', weight: ['high-performance'] },
    ],
  },
];

interface DistroQuizProps {
  distros: Distro[];
}

export default function DistroQuiz({ distros }: DistroQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const getRecommendedDistros = () => {
    const scores: Record<string, number> = {};
    
    // Collect all weights from user's answers
    const userWeights: string[] = [];
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = questions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.value === value);
      if (option) {
        userWeights.push(...option.weight);
      }
    });

    // Score each distro based on matches
    distros.forEach(distro => {
      let score = 0;
      
      // Match target users
      const experienceAnswer = answers['experience'];
      if (experienceAnswer) {
        const targetUserMap: Record<string, string> = {
          'beginner': 'beginner',
          'intermediate': 'intermediate',
          'advanced': 'advanced',
        };
        const mappedAnswer = targetUserMap[experienceAnswer];
        if (mappedAnswer && distro.target_users.includes(mappedAnswer as any)) {
          score += 10;
        }
      }

      // Match tags
      if (distro.tags) {
        userWeights.forEach(weight => {
          if (distro.tags?.some(tag => tag.toLowerCase().includes(weight.toLowerCase()) || 
                                       weight.toLowerCase().includes(tag.toLowerCase()))) {
            score += 5;
          }
        });
      }

      // Bonus for specific matches
      const purposeAnswer = answers['purpose'];
      if (purposeAnswer === 'gaming' && distro.name.toLowerCase().includes('garuda')) score += 15;
      if (purposeAnswer === 'gaming' && distro.name.toLowerCase().includes('pop')) score += 10;
      if (purposeAnswer === 'server' && ['centos', 'rocky', 'alma'].some(s => distro.name.toLowerCase().includes(s))) score += 15;
      if (purposeAnswer === 'programming' && ['ubuntu', 'fedora', 'pop'].some(s => distro.name.toLowerCase().includes(s))) score += 10;
      if (purposeAnswer === 'daily' && ['mint', 'ubuntu', 'zorin'].some(s => distro.name.toLowerCase().includes(s))) score += 10;

      // Interface preferences
      const interfaceAnswer = answers['interface'];
      if (interfaceAnswer === 'windows-like' && ['zorin', 'mint'].some(s => distro.name.toLowerCase().includes(s))) score += 12;
      if (interfaceAnswer === 'mac-like' && ['elementary'].some(s => distro.name.toLowerCase().includes(s))) score += 15;
      if (interfaceAnswer === 'minimal' && ['lubuntu', 'xubuntu', 'lite'].some(s => distro.name.toLowerCase().includes(s))) score += 12;
      if (interfaceAnswer === 'customizable' && ['arch', 'manjaro', 'endeavour'].some(s => distro.name.toLowerCase().includes(s))) score += 12;

      // System specs
      const systemAnswer = answers['system'];
      if (systemAnswer === 'old' && distro.min_ram_mb <= 1024) score += 15;
      if (systemAnswer === 'moderate' && distro.min_ram_mb <= 2048) score += 10;
      if (systemAnswer === 'modern' && distro.min_ram_mb <= 4096) score += 5;
      if (systemAnswer === 'high-end' && distro.min_ram_mb >= 4096) score += 10;

      scores[distro.id] = score;
    });

    // Sort by score and return top 5
    return distros
      .map(distro => ({ distro, score: scores[distro.id] || 0 }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  };

  if (showResults) {
    const recommendations = getRecommendedDistros();
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Your Personalized Recommendations
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Based on your answers, here are the best Linux distributions for you:
          </p>

          <div className="space-y-6 mb-8">
            {recommendations.map((rec, index) => (
              <div key={rec.distro.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {index === 0 && '🏆 '}
                      {rec.distro.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Match Score: {rec.score}/100
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    {rec.distro.family}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {rec.distro.install_guide_markdown}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {rec.distro.desktop_environments.slice(0, 3).map(de => (
                    <span key={de} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                      {de}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm">
                    RAM: {rec.distro.min_ram_mb}MB min
                  </span>
                </div>

                <div className="flex gap-3">
                  <Link 
                    href={`/distros/${rec.distro.id}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <a 
                    href={rec.distro.official_docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    Official Site
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
            >
              Start Over
            </button>
            <Link
              href="/distros/compare"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-center"
            >
              Compare Distros
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map(option => (
            <button
              key={option.value}
              onClick={() => handleAnswer(question.id, option.value)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[question.id] === option.value
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[question.id] === option.value
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {answers[question.id] === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[question.id]}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
