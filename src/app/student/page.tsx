'use client';

import { useState } from 'react';
import { Button } from '@/component/ui/button';
import QuizIdModal from '@/component/dashboard/quixModal';
import { useQuizStore } from '@/store/useQuizStore';

export default function StudentDashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const username = useQuizStore((state) => state.username);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold">
              Welcome, {username?.split(' ')[0]}
            </h1>
            <p className="text-gray-500 mt-1">Take quizzes and check your performance.</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-6 py-2 rounded-md transition"
          >
            + Start New Quiz
          </Button>
        </section>

        
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Performance</h2>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6 text-center text-gray-500 dark:text-gray-400">
            📊 Analytics will appear here once you complete a quiz.
          </div>
        </section>
      </main>

      
      <QuizIdModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
