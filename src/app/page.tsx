'use client';

import { Button } from '@/component/ui/button';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  const username = useQuizStore((state) => state);

  const handleNavigation = () => {
    if (!username) {
      router.push('/auth/signup');
    } else {
      router.push('/dashboard');
    }
  };
  useEffect(() => {
    // handleNavigation();
  }, [username])

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-16" onClick={() => { console.log(username) }}>
      <section className="max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-gray-600">ScoreBee 🐝</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ScoreBee is your intelligent platform for creating, managing, and analyzing quizzes in real time.
          Whether you&apos;re an educator or a student, we simplify assessments and boost learning.
        </p>

        <Button
          onClick={handleNavigation}
          className="mt-4 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          Get Started
        </Button>
      </section>

      {/* Features */}
      <section className="mt-24 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Secure Quiz Hosting</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Host quizzes with protected access codes. Ensure fair and secure participation.
          </p>
        </div>
        <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Instantly view score breakdowns, participation trends, and question-level insights.
          </p>
        </div>
        <div className="border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Smart Questioning</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Build quizzes using multiple types – MCQ, coding, subjective – all in one place.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-28 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold">Transform how you assess knowledge</h2>
        <p className="text-gray-600 dark:text-gray-400">
          ScoreBee enables seamless exam creation, student monitoring, and performance review.
        </p>
        <Button
          onClick={handleNavigation}
          className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          Launch Dashboard
        </Button>
      </section>
    </main>
  );
}
