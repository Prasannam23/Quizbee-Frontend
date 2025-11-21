import { create } from 'zustand';
import toast from 'react-hot-toast';
import { getCookie } from '@/utils/getToken';
import { useAuthStore } from './userAuthStore';
import { Question ,LiveUser, startQuizPayload, WebSocketUser } from '@/types/globaltypes';



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
    set({ loading: true });

    const token = getCookie('token');
    if (!token) {
      toast.error('Login required');
      set({ loading: false });
      return;
    }

    const loadingToastId = toast.loading('Connecting to WebSocket...');

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WEB_SOCKET_URL}?token=${token}`
    );

    console.log('Connecting to WebSocket:', ws);
    set({ socket: ws });

    ws.onopen = () => {
      set({ loading: false });
      toast.success('Connected to WebSocket', { id: loadingToastId });
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log('WebSocket message received:', msg.type , msg?.payload , msg);

      switch (msg.type) {
        case 'Leaderboard':
          set({ leaderboard: msg.payload.topPlayers ,totalmarks: Math.round(msg.payload.selfScore?.score||0) });
          set({rank:msg.payload.selfScore?.rank||-1 })
          break;
        case "QUIZ_STARTED" :{
          toast.success('Quiz started ');
          set({
            quizStarted: true,
            attemptId: msg.payload?.attemptId,
          });
          break;
        }
        case 'QUIZ_ONGOING':{
          toast.success('Quiz is ongoing ');
          set({
            quizStarted: true,
            attemptId: msg.payload?.attemptId,
          });
          break;
        }
        case 'NEW_QUESTION':
          console.log('NEW_QUESTION received:', msg.payload);
          set({ currentQuestion: msg.payload });
          break;

        case 'USERS_IN_ROOM': {
          const users: LiveUser[] = msg.payload.users;
          const usersMap = new Map(users.map((user) => [user.id, user]));
          set({ roomJoined: true, liveUsers: usersMap });
          break;
        }
        case 'NEW_USER':{
          const newUser: LiveUser = msg.payload.user;
          get().addOrUpdateLiveUser(newUser);
          break;
        }

        case 'USER_JOINED': {
          const user: LiveUser = msg.payload.user;
          get().addOrUpdateLiveUser(user);
          break;
        }


        case 'USER_LEFT': {
          const userId: string = msg.payload.userId;
          get().removeLiveUser(userId);
          break;
        }

        case 'rank':
          set({
            totalmarks: msg.data,
            rank: msg.rank,
          });
          break;
      }
    };

    ws.onerror = (err: Event) => {
      set({ loading: false });
      console.error('WebSocket error:', err);
      toast.error('WebSocket error', { id: loadingToastId });
    };

    ws.onclose = (error: CloseEvent) => {
      console.error('WebSocket closed:', error);
      toast.error('WebSocket connection closed', { id: loadingToastId });
      set({ socket: null });

      setTimeout(() => {
        get().connect(); // Reconnect
      }, 3000);
    };
  },

  joinRoom: (quizId: string, isHost?: boolean) => {
    const { sendMessage } = get();

    set({ loading: true });
    const toastId = toast.loading('Joining quiz room...');

    sendMessage('JOIN_ROOM', {
      quizId,
      userId: useAuthStore.getState().user?.id || '',
      isHost: isHost || false,
    });

    toast.dismiss(toastId);
  },

  sendMessage: (type: string, payload: startQuizPayload | Record<string, unknown>) => {
    const socket = get().socket;

    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = { type, payload };
      socket.send(JSON.stringify(message));
      toast.success(`Message sent: ${type}`)
    } else {
      toast.error('WebSocket is not connected');
    }
  },

  setLiveUsers: (users: LiveUser[]) =>
    set({
      liveUsers: new Map(users.map((u) => [u.id, u])),
    }),

  addOrUpdateLiveUser: (user: LiveUser) =>
    set((state) => {
      const updated = new Map(state.liveUsers);
      updated.set(user.id, user);
      return { liveUsers: updated };
    }),

  removeLiveUser: (userId: string) =>
    set((state) => {
      const updated = new Map(state.liveUsers);
      updated.delete(userId);
      return { liveUsers: updated };
    }),

  setLeaderboard: (data) => set({ leaderboard: data }),
  setQuestion: (q) => set({ currentQuestion: q }),
}));
