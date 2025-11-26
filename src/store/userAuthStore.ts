// stores/auth.store.ts
import { create } from "zustand";
import api from "@/lib/axios";
import { User, Role } from "@/types/globaltypes";
import { AxiosError } from "axios";

export type { Role };

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;

  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  login: (email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
}

interface ErrorResponse {
  error?: string;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,
  isInitialized: false,

  // -----------------------------
  // REGISTER FIXED
  // -----------------------------
  register: async (name, email, password, role) => {
    try {
      set({ loading: true });

      const res = await api.post("/auth/register", { name, email, password, role });
      console.log("📦 REGISTER RESPONSE:", res.data);

      // Extract token
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("💾 Token saved during REGISTER:", token);
      }

      set({ user: res.data.user, error: null, isInitialized: true });
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      set({
        error: err?.response?.data?.error || "Registration failed",
        isInitialized: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------
  // LOGIN FIXED
  // -----------------------------
  login: async (email, password, role) => {
    try {
      set({ loading: true });

      const res = await api.post(`/auth/login?role=${role}`, { email, password });

      console.log("📦 LOGIN RESPONSE:", res.data);

      // Extract token EXACTLY from backend response
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("💾 Token saved during LOGIN:", token);
      }

      set({ user: res.data.user, error: null, isInitialized: true });
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      set({
        error: err?.response?.data?.error || "Login failed",
        isInitialized: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  // -----------------------------
  // LOGOUT
  // -----------------------------
  logout: async () => {
    try {
      localStorage.removeItem("token");
      await api.post("/auth/logout");
      set({ user: null, isInitialized: true });
    } catch {
      // Silently handle logout errors
    }
  },

  // -----------------------------
  // GET ME
  // -----------------------------
  getMe: async () => {
    try {
      set({ loading: true });
      const res = await api.get("/user/me");
      set({ user: res.data.user, error: null, isInitialized: true });
    } catch {
      set({ user: null, error: "Not authenticated", isInitialized: true });
    } finally {
      set({ loading: false });
    }
  },
}));