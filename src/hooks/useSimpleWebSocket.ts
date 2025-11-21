/**
 * Simplified WebSocket manager - no provider needed
 * Direct connection management where needed
 */

import { useEffect, useCallback, useState } from 'react';
import { useAuthStore } from '@/store/userAuthStore';

interface QuizWebSocketOptions {
  quizId: string;
  onMessage?: (data: Record<string, unknown>) => void;
  onError?: (error: string) => void;
  autoReconnect?: boolean;
}

export function useSimpleWebSocket({ 
  quizId, 
  onMessage, 
  onError,
  autoReconnect = true 
}: QuizWebSocketOptions) {
  const { user } = useAuthStore();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(() => {
    if (!user || socket || isConnecting) return;

    setIsConnecting(true);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        throw new Error('No auth token');
      }

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/quiz/${quizId}?token=${token}`);

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log(`✅ Connected to quiz ${quizId}`);
        
        // Join the quiz room
        ws.send(JSON.stringify({
          type: 'JOIN_ROOM',
          payload: {
            quizId,
            userId: user.id,
            userName: user.firstName || user.email.split('@')[0],
            role: user.role === 'ADMIN' ? 'TEACHER' : user.role
          }
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = () => {
        const error = 'WebSocket connection error';
        setIsConnecting(false);
        setIsConnected(false);
        onError?.(error);
        console.error(`❌ ${error} for quiz ${quizId}`);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        console.log(`🔌 Disconnected from quiz ${quizId}`);
        
        // Auto-reconnect if enabled
        if (autoReconnect) {
          setTimeout(() => {
            setSocket(null);
            connect();
          }, 3000);
        }
      };

      setSocket(ws);
    } catch (error) {
      setIsConnecting(false);
      const errorMsg = error instanceof Error ? error.message : 'Connection failed';
      onError?.(errorMsg);
    }
  }, [user, socket, isConnecting, quizId, onMessage, onError, autoReconnect]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const sendMessage = useCallback((message: Record<string, unknown>) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message: WebSocket not connected');
    }
  }, [socket, isConnected]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage
  };
}
