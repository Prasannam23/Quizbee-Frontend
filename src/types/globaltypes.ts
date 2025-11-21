
export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPERADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  createdAt: string;
}

// WebSocket User type (different from auth User)
export interface WebSocketUser { 
    value: string; 
    score: number;
}

// Quiz Types
export interface Question {
    id?: string;
    question: string;
    options: string[];
    marks: number;
    timeLimit: number;
}
export type LiveUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isHost: boolean;
  score?: number;
};

export type LeaderboardData = Record<string, number>;

export interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    rank: number;
}

// Component Props Types
export interface LoadingSpinnerProps {
    message: string;
}

export interface TimerProps {
    timeLimit: number;
    onTimeUp: () => void;
    disabled?: boolean; // Optional prop to disable timer
}

export interface QuestionProps {
    question: Question;
    onAnswerSelect: (optionIndex: number) => void;
    selectedAnswer: number | null;
    isAnswered: boolean;
    disabled?: boolean; // Optional prop to disable interaction
}

export interface RankDisplayProps {
    rank: number;
    totalMarks: number;
}

export interface LeaderboardProps {
   
    users: WebSocketUser[];
}
export type startQuizPayload ={
   quizId: string;
}

export interface AnswerPayload {
  quizId: string;
  attemptId: string;
  userId: string;
  questionId: string;
  answer: number;
}