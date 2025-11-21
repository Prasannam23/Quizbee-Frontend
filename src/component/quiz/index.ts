// ============================================================================
// QUIZ COMPONENTS INDEX - Central export file for all quiz-related components
// ============================================================================
// This file provides a single import point for all quiz components,
// making it easier to import multiple components in other files.
// ============================================================================

export { default as Timer } from './Timer';
export { default as QuestionCard } from './QuestionCard';
export { default as RankDisplay } from './RankDisplay';
export { default as Leaderboard } from './Leaderboard';

// Re-export types for convenience
export type {
    TimerProps,
    QuestionProps,
    RankDisplayProps,
    LeaderboardProps
} from '@/types/globaltypes';
