import { loadAllDistros } from '@/lib/distro-loader';
import DistroQuiz from '@/components/distro-quiz';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Your Perfect Linux Distro - Quiz',
  description: 'Answer 5 quick questions to discover which Linux distribution best matches your needs and experience level.',
};

export default async function QuizPage() {
  const distros = await loadAllDistros();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Linux Distro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Answer 5 quick questions and we&apos;ll recommend the best Linux distribution for your needs
          </p>
        </div>

        <DistroQuiz distros={distros} />
      </div>
    </main>
  );
}
