import { useAuthStore } from '@/store/userAuthStore';

export const useUserRole = () => {
  const { user, loading, isInitialized } = useAuthStore();

  return {
    user,
    loading,
    isInitialized,
    isAuthenticated: !!user,
    role: user?.role,
    isTeacher: user?.role === 'TEACHER',
    isStudent: user?.role === 'STUDENT',
    isAdmin: user?.role === 'ADMIN',
    isSuperAdmin: user?.role === 'SUPERADMIN',
  };
};
