'use client';

import { useEffect, useState } from 'react';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { useAuthStore } from '@/store/userAuthStore';

interface StudentQuizInterfaceProps {
  quizId: string;
}

export default function StudentQuizInterface({ quizId }: StudentQuizInterfaceProps) {
  const { user } = useAuthStore();
  const { currentQuestion, quizStarted, sendMessage } = useWebSocketStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (user && !isReady) {
      // Join the quiz room
      sendMessage('JOIN_ROOM', {
        quizId,
        userId: user.id,
        userName: user.firstName || user.email.split('@')[0],
        role: user.role === 'ADMIN' ? 'TEACHER' : user.role,
      });
      setIsReady(true);
    }
  }, [user, quizId, isReady, sendMessage]);

  if (!quizStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Waiting for quiz to start...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {currentQuestion ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-3 border rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading question...</p>
          </div>
        )}
      </div>
    </div>
  );
}
