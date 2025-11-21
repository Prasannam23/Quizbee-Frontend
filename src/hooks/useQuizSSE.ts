/**
 * Hybrid approach: SSE for updates + WebSocket for interactions
 * More efficient for quiz scenarios
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuthStore } from '@/store/userAuthStore';

interface QuizEvent {
  type: 'QUESTION_CHANGE' | 'QUIZ_START' | 'QUIZ_END' | 'LEADERBOARD_UPDATE';
  data: Record<string, unknown>;
}

interface UseQuizSSEOptions {
  quizId: string;
  enabled?: boolean;
}

export function useQuizSSE({ quizId, enabled = true }: UseQuizSSEOptions) {
  const { user } = useAuthStore();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!user || !enabled || eventSourceRef.current) return;

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No auth token');
      }

      // Create SSE connection for quiz updates
      const eventSource = new EventSource(
        `/api/quiz/${quizId}/events?token=${token}`
      );

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('✅ SSE connected to quiz:', quizId);
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        setError('SSE connection failed');
        console.error('❌ SSE error for quiz:', quizId);
      };

      // Listen for quiz events
      eventSource.onmessage = (event) => {
        try {
          const quizEvent: QuizEvent = JSON.parse(event.data);
          handleQuizEvent(quizEvent);
        } catch (err) {
          console.error('Failed to parse SSE event:', err);
        }
      };

      eventSourceRef.current = eventSource;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, [user, enabled, quizId]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const handleQuizEvent = (event: QuizEvent) => {
    // Handle different quiz events
    switch (event.type) {
      case 'QUESTION_CHANGE':
        // Update current question in store
        console.log('Question changed:', event.data);
        break;
      case 'QUIZ_START':
        // Update quiz state
        console.log('Quiz started:', event.data);
        break;
      case 'QUIZ_END':
        // Handle quiz end
        console.log('Quiz ended:', event.data);
        break;
      case 'LEADERBOARD_UPDATE':
        // Update leaderboard
        console.log('Leaderboard updated:', event.data);
        break;
    }
  };

  // Send answer via HTTP POST (more reliable than WebSocket)
  const submitAnswer = useCallback(async (answerData: Record<string, unknown>) => {
    try {
      const response = await fetch(`/api/quiz/${quizId}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      return await response.json();
    } catch (error) {
      console.error('Answer submission failed:', error);
      throw error;
    }
  }, [quizId]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    submitAnswer
  };
}
