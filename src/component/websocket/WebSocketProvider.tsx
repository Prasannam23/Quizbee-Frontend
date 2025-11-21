'use client';

import React from 'react';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

/**
 * WebSocketProvider - Wrapper component for WebSocket functionality
 * Provides WebSocket context to child components for real-time quiz features
 */
export default function WebSocketProvider({ children }: WebSocketProviderProps) {
  return <>{children}</>;
}
