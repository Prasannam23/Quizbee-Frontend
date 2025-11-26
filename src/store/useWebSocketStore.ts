import { create } from 'zustand';
import toast from 'react-hot-toast';
import { getToken } from '@/utils/getToken';
import { useAuthStore } from './userAuthStore';
import { Question, LiveUser, startQuizPayload, WebSocketUser } from '@/types/globaltypes';

interface QuizStore {
  socket: WebSocket | null;
  loading: boolean;
  attemptId?: string;
  quizStarted: boolean;
  liveUsers: Map<string, LiveUser>;
  leaderboard: WebSocketUser[];
  currentQuestion: Question | null;
  roomJoined: boolean;
  totalmarks: number;
  rank: number;
  connect: () => void;
  disconnect: () => void;
  joinRoom: (quizId: string, isHost?: boolean) => void;
  sendMessage: (type: string, payload: startQuizPayload | Record<string, unknown>) => void;
  setLiveUsers: (users: LiveUser[]) => void;
  addOrUpdateLiveUser: (user: LiveUser) => void;
  removeLiveUser: (userId: string) => void;
  setLeaderboard: (data: WebSocketUser[]) => void;
  setQuestion: (q: Question) => void;
}

export const useWebSocketStore = create<QuizStore>((set, get) => ({
  socket: null,
  loading: false,
  quizStarted: false,
  attemptId: undefined,
  liveUsers: new Map(),
  leaderboard: [],
  currentQuestion: null,
  roomJoined: false,
  totalmarks: 0,
  rank: 0,

  connect: () => {
    const { socket } = get();

    // Prevent multiple connections
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    set({ loading: true });
    const token = getToken();
    if (!token) {
      toast.error("Login required");
      set({ loading: false });
      return;
    }

    const loadingToastId = toast.loading("Connecting to WebSocket...");
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}?token=${token}`);
    set({ socket: ws });

    ws.onopen = () => {
      set({ loading: false });
      toast.success("Connected to WebSocket", { id: loadingToastId });
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log("WebSocket message received:", msg.type, msg?.payload);

      switch (msg.type) {
        case 'Leaderboard':
          set({ 
            leaderboard: msg.payload.topPlayers, 
            totalmarks: Math.round(msg.payload.selfScore?.score || 0),
            rank: msg.payload.selfScore?.rank || -1
          });
          break;

        case 'QUIZ_STARTED':
        case 'QUIZ_ONGOING':
          toast.success(msg.type === 'QUIZ_STARTED' ? 'Quiz started' : 'Quiz is ongoing');
          set({
            quizStarted: true,
            attemptId: msg.payload?.attemptId
          });
          break;

        case 'NEW_QUESTION':
          set({ currentQuestion: msg.payload });
          break;

        case 'USERS_IN_ROOM': {
          const users: LiveUser[] = msg.payload.users;
          set({ roomJoined: true, liveUsers: new Map(users.map(u => [u.id, u])) });
          break;
        }

        case 'NEW_USER':
        case 'USER_JOINED':
          get().addOrUpdateLiveUser(msg.payload.user);
          break;

        case 'USER_LEFT':
          get().removeLiveUser(msg.payload.userId);
          break;

        case 'rank':
          set({ totalmarks: msg.data, rank: msg.rank });
          break;

        default:
          console.warn(`Unknown WS type: ${msg.type}`);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      toast.error("WebSocket error", { id: loadingToastId });
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
      set({ socket: null });
      toast.error("WebSocket disconnected", { id: loadingToastId });

      // Reconnect only if not manually closed
      if (!event.wasClean) {
        setTimeout(() => get().connect(), 3000);
      }
    };
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null });
      console.log("WebSocket manually disconnected");
    }
  },

  joinRoom: (quizId: string, isHost?: boolean) => {
    const { sendMessage } = get();
    set({ loading: true });
    const toastId = toast.loading("Joining quiz room...");

    sendMessage('JOIN_ROOM', {
      quizId,
      userId: useAuthStore.getState().user?.id || '',
      isHost: isHost || false
    });

    toast.dismiss(toastId);
  },

  sendMessage: (type: string, payload: startQuizPayload | Record<string, unknown>) => {
    const socket = get().socket;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, payload }));
      toast.success(`Message sent: ${type}`);
    } else {
      toast.error("WebSocket is not connected");
    }
  },

  setLiveUsers: (users: LiveUser[]) => {
    set({ liveUsers: new Map(users.map(u => [u.id, u])) });
  },

  addOrUpdateLiveUser: (user: LiveUser) => {
    set((state) => {
      const updated = new Map(state.liveUsers);
      updated.set(user.id, user);
      return { liveUsers: updated };
    });
  },

  removeLiveUser: (userId: string) => {
    set((state) => {
      const updated = new Map(state.liveUsers);
      updated.delete(userId);
      return { liveUsers: updated };
    });
  },

  setLeaderboard: (data) => set({ leaderboard: data }),
  setQuestion: (q) => set({ currentQuestion: q }),
}));
