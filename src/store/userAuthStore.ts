import { create } from 'zustand';
import api from '@/lib/axios';
import { User, Role } from '@/types/globaltypes';

export type { Role };

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  register: (name:string, email: string, password: string, role: Role) => Promise<void>;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  isInitialized: false,

  register: async (name, email, password, role) => {
    try {
      set({ loading: true });
      const res = await api.post('/auth/register', {name, email, password, role });
      set({ user: res.data.user, error: null, isInitialized: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Registration failed'
        : 'Registration failed';
      set({ error: errorMessage, isInitialized: true });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password, role) => {
    try {
      set({ loading: true });
      const res = await api.post(`/auth/login?role=${role}`, { email, password });
      set({ user: res.data.user, error: null, isInitialized: true });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Login failed'
        : 'Login failed';
      set({ error: errorMessage, isInitialized: true });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isInitialized: true });
    } catch (err: unknown) {
      console.error('Logout failed:', err);
      set({ user: null, isInitialized: true });
    }
  },

  getMe: async () => {
    try {
      set({ loading: true });
      const res = await api.get('/user/me');
      set({ user: res.data.user, error: null, isInitialized: true });
    } catch {
      set({ user: null, error: 'Not authenticated', isInitialized: true });
    } finally {
      set({ loading: false });
    }
  }
}));
