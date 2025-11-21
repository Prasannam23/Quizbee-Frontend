'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { useAuthStore } from '@/store/userAuthStore';

type QuizIdModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function QuizIdModal({ isOpen, onClose }: QuizIdModalProps) {
  const [quizId, setQuizId] = useState('');
  const router = useRouter();
  const { user } = useAuthStore();
  const { sendMessage } = useWebSocketStore((state) => state);


  const handleStart = () => {
    if (quizId.trim()) {
      sendMessage('JOIN_ROOM', {
        quizId: quizId,
        isHost: false,
        userId: user?.id,
      })
      setTimeout(() => {
        router.push(`/student/${quizId}`);
      }, 2000);
      setQuizId('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Enter Quiz ID</h2>
        <input
          type="text"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          placeholder="e.g. quiz-abc123"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            className="bg-black text-white dark:bg-white dark:text-black"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}
