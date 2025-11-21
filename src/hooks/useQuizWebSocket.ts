/**
 * On-demand WebSocket hook for quiz rooms
 * Only connects when actually needed
 */

import { useEffect, useRef, useCallback } from 'react';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { useAuthStore } from '@/store/userAuthStore';

interface UseQuizWebSocketOptions {
  quizId: string;
  enabled?: boolean;
  autoConnect?: boolean;
}

export function useQuizWebSocket({ 
  quizId, 
  enabled = true, 
  autoConnect = true 
}: UseQuizWebSocketOptions) {
  const { user } = useAuthStore();
  const {
    connect,
    joinRoom,
    loading,
    currentQuestion,
    quizStarted,
    liveUsers,
    leaderboard,
    totalmarks,
    rank,
    sendMessage,
    roomJoined,
  } = useWebSocketStore();

  const hasJoinedRoom = useRef(false);

  // Connect to WebSocket when needed
  const connectToQuiz = useCallback(async () => {
    if (!user || !enabled) return;

    try {
      // Connect if not already connected
      if (loading || !quizStarted) {
        connect();
        
        // Wait a moment for connection to establish
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Join specific quiz room
      if (!hasJoinedRoom.current && quizStarted) {
        hasJoinedRoom.current = true;
        joinRoom(quizId, false);
      }
    } catch (error) {
      console.error('Failed to connect to quiz WebSocket:', error);
    }
  }, [user, enabled, quizId, quizStarted, loading, connect, joinRoom]);

  // Disconnect and cleanup
  const disconnectFromQuiz = useCallback(() => {
    hasJoinedRoom.current = false;
  }, []);

  // Auto-connect when enabled
  useEffect(() => {
    if (enabled && autoConnect && user) {
      connectToQuiz();
    }

    return () => {
      if (enabled) {
        disconnectFromQuiz();
      }
    };
  }, [enabled, autoConnect, user, connectToQuiz, disconnectFromQuiz]);

  return {
    // Connection methods
    connectToQuiz,
    disconnectFromQuiz,
    
    // Connection state
    isConnected: quizStarted && roomJoined,
    isConnecting: loading,
    
    // Quiz data from store
    currentQuestion,
    quizStarted,
    liveUsers,
    leaderboard,
    totalmarks,
    rank,
    
    // Quiz actions
    sendMessage,
    
    // Raw store access for advanced usage
    store: useWebSocketStore
  };
}
