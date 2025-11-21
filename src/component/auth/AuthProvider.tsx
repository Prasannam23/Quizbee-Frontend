'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/userAuthStore';
import LoadingSpinner from '@/component/ui/loading-spinner';

interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const { getMe, loading, isInitialized } = useAuthStore();

    useEffect(() => {
        if (!isInitialized) {
            getMe();
        }
    }, [getMe, isInitialized]);

    // Show loading spinner while checking authentication
    if (loading && !isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center space-y-4">
                    <LoadingSpinner size="lg" className="text-yellow-500" />
                    <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
