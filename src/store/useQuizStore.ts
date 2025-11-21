import { create } from 'zustand';
import toast from 'react-hot-toast';
import { toastNotifications } from '@/lib/toastNotifications';
import api from '@/lib/axios';
import { Role } from '@/types/globaltypes';
import { useAuthStore } from './userAuthStore';
import { useWebSocketStore } from './useWebSocketStore';

interface Player {
  id: string;
  name: string;
  score: number;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  marks: number;
  timeLimit: number;
  quizId: string;
}

interface QuizAttempt {
  id: string;
  studentId: string;
  score: number;
  completedAt: string;
  // Add other attempt fields as needed
}

 export interface Quiz {
  id: string;
  title: string;
  slug: string;
  joinCode: string;
  state: 'yet_to_start' | 'ongoing' | 'completed';
  ownerId: string;
  maxScore: number;
  createdAt: string;
  questions: Question[];
  attempts: QuizAttempt[];
  _count: {
    attempts: number;
  };
}

interface GetQuizzesResponse {
  message: string;
  data: {
    quizzes: Quiz[];
    totalQuizzes: number;
  };
}

interface CreateQuizQuestion {
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  marks: number;
  timeLimit: number;
}

interface CreateQuizResponse {
  message: string;
  quizId: string;
}

 interface QuizState {
  // User session data
  username: string;
  email: string;
  institution: string;
  roomCode: string;
  isHost: boolean;
  score: number;
  players: Player[];
  currentQuestion: Question | null;
  quizStarted: boolean;
  role: Role | null;

  // Quiz creation
  isCreating: boolean;
  createdQuizId: string | null;
  createError: string | null;

  // Quiz management
  quizzes: Quiz[];
  isLoadingQuizzes: boolean;
  quizzesError: string | null;
  totalQuizzes: number;
  selectedQuiz: Quiz | null;
  isLoadingQuiz: boolean;
  quizError: string | null;

  // Actions for user session
  setUsername: (name: string) => void;
  setEmail: (email: string) => void;
  setInstitution: (inst: string) => void;
  setRole: (role: Role | null) => void;
  setRoomCode: (code: string) => void;
  setIsHost: (host: boolean) => void;
  incrementScore: () => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setQuizStarted: (started: boolean) => void;
  resetQuiz: () => void;

  // Quiz creation actions
  createQuiz: (title: string, questions: CreateQuizQuestion[]) => Promise<void>;
  clearCreateState: () => void;

  // Quiz management actions
  getQuizzes: () => Promise<void>;
  getQuizById: (quizId: string) => Promise<void>;
  setSelectedQuiz: (quiz: Quiz | null) => void;
  clearQuizzesState: () => void;
  cacheQuizToRedis: (quizId: string) => Promise<void>;
  updateQuizState: (quizId: string, newState: 'yet_to_start' | 'ongoing' | 'completed') => void;
}
 
export const useQuizStore = create<QuizState>((set) => ({
  // User session data
  username: '',
  email: '',
  institution: '',
  roomCode: '',
  isHost: false,
  score: 0,
  players: [],
  currentQuestion: null,
  quizStarted: false,
  role: null,

  // Quiz creation
  isCreating: false,
  createdQuizId: null,
  createError: null,

  // Quiz management
  quizzes: [],
  isLoadingQuizzes: false,
  quizzesError: null,
  totalQuizzes: 0,
  selectedQuiz: null,
  isLoadingQuiz: false,
  quizError: null,

  setUsername: (name) => set({ username: name }),
  setEmail: (email) => set({ email }),
  setInstitution: (inst) => set({ institution: inst }),
  setRole: (role) => set({ role }),
  setRoomCode: (code) => set({ roomCode: code }),
  setIsHost: (host) => set({ isHost: host }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  setPlayers: (players) => set({ players }),
  addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setQuizStarted: (started) => set({ quizStarted: started }),

  resetQuiz: () =>
    set({
      username: '',
      email: '',
      institution: '',
      role: null,
      roomCode: '',
      isHost: false,
      score: 0,
      players: [],
      currentQuestion: null,
      quizStarted: false,
    }),

  createQuiz: async (title: string, questions: CreateQuizQuestion[]) => {
    set({ isCreating: true, createError: null, createdQuizId: null });

    const loadingToast = toastNotifications.loading.creatingQuiz();

    try {
      const maxScore = questions.reduce((total, q) => total + q.marks, 0);

      const response = await api.post<CreateQuizResponse>('/quiz/create', {
        title,
        maxScore,
        questions,
      });

      toast.dismiss(loadingToast);
      toastNotifications.success.quizCreated();

      set({
        isCreating: false,
        createdQuizId: response.data.quizId,
        createError: null,
      });
    } catch (error: unknown) {
      toast.dismiss(loadingToast);

      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to create quiz'
        : 'Failed to create quiz';
      toast.error(errorMessage);

      set({
        isCreating: false,
        createError: errorMessage,
        createdQuizId: null,
      });
    }
  },
  getQuiz :async () => {
    try {
      const response = await api.get('/quiz/get');
      console.log('Quiz fetched successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to fetch quiz:', error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to fetch quiz'
        : 'Failed to fetch quiz';
      throw new Error(errorMessage);
    }
  },

  clearCreateState: () =>
    set({
      isCreating: false,
      createdQuizId: null,
      createError: null,
    }),

  // Quiz management actions
  getQuizzes: async () => {
    set({ isLoadingQuizzes: true, quizzesError: null });

    try {
      const response = await api.get<GetQuizzesResponse>('/quiz/get');
      
      set({
        quizzes: response.data.data.quizzes,
        totalQuizzes: response.data.data.totalQuizzes,
        isLoadingQuizzes: false,
        quizzesError: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to fetch quizzes'
        : 'Failed to fetch quizzes';
      
      set({
        quizzes: [],
        totalQuizzes: 0,
        isLoadingQuizzes: false,
        quizzesError: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  getQuizById: async (quizId: string) => {
    set({ isLoadingQuiz: true, quizError: null });

    try {
      const response = await api.get<{ message: string; data: Quiz }>(`/quiz/${quizId}`);
      
      set({
        selectedQuiz: response.data.data,
        isLoadingQuiz: false,
        quizError: null,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to fetch quiz'
        : 'Failed to fetch quiz';
        console.log('Error fetching quiz:', errorMessage);
      set({
        selectedQuiz: null,
        isLoadingQuiz: false,
        quizError: errorMessage,
      });

      toast.error(errorMessage);
    }
  },

  setSelectedQuiz: (quiz: Quiz | null) => set({ selectedQuiz: quiz }),

  clearQuizzesState: () =>
    set({
      quizzes: [],
      isLoadingQuizzes: false,
      quizzesError: null,
      totalQuizzes: 0,
      selectedQuiz: null,
      isLoadingQuiz: false,
      quizError: null,
    }),

  cacheQuizToRedis: async (quizId: string) => {
    try {
      const response = await api.get(`/redis/cache/${quizId}`);
      console.log('Quiz cached to Redis:', response.data);
      // get().updateQuizState(quizId, 'ongoing');
      const userId = useAuthStore.getState().user?.id;
         const sendMessage = useWebSocketStore.getState().sendMessage;
    sendMessage('JOIN_ROOM', {
      quizId,
      userId:userId,
      isHost:true,
    });
      toast.success('Quiz room created  successfully now you can start the quiz');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to cache quiz'
        : 'Failed to cache quiz';
      console.error('Error caching quiz:', errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },

  updateQuizState: (quizId: string, newState: 'yet_to_start' | 'ongoing' | 'completed') => {
    set((state) => ({
      quizzes: state.quizzes.map(quiz => 
        quiz.id === quizId ? { ...quiz, state: newState } : quiz
      ),
      selectedQuiz: state.selectedQuiz?.id === quizId 
        ? { ...state.selectedQuiz, state: newState }
        : state.selectedQuiz
    }));
  },
}));
