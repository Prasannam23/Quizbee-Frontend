'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/userAuthStore';
import LoadingSpinner from '@/component/ui/loading-spinner';
import { Card } from '@/component/ui/card';

interface QuizCardProps {
    quiz: {
        id: string;
        title: string;
        joinCode: string;
        state: 'yet_to_start' | 'ongoing' | 'completed';
        maxScore: number;
        createdAt: string;
        questions: Array<{
            id: string;
            question: string;
            options: string[];
            marks: number;
            timeLimit: number;
        }>;
        _count: {
            attempts: number;
        };
    };
    userRole: 'TEACHER' | 'STUDENT' | 'ADMIN' | 'SUPERADMIN' | null;
}

function QuizCard({ quiz, userRole }: QuizCardProps) {
    const router = useRouter();

    const handleQuizClick = () => {
        if (userRole === 'TEACHER') {
            // For teachers, redirect to quiz management page
            router.push(`/dashboard/${quiz.id}`);
        } else {
            // For students, redirect to quiz taking page
            router.push(`/test/${quiz.id}`);
        }
    };

    const getStatusColor = (state: string) => {
        switch (state) {
            case 'yet_to_start':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'ongoing':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'completed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getStatusText = (state: string) => {
        switch (state) {
            case 'yet_to_start':
                return 'Not Started';
            case 'ongoing':
                return 'In Progress';
            case 'completed':
                return 'Completed';
            default:
                return state;
        }
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700">
            <div onClick={handleQuizClick} className="space-y-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {quiz.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.state)}`}>
                        {getStatusText(quiz.state)}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                        <span>Join Code:</span>
                        <span className="font-mono font-bold text-yellow-600 dark:text-yellow-400">
                            {quiz.joinCode}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Questions:</span>
                        <span className="font-medium">{quiz.questions.length}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Max Score:</span>
                        <span className="font-medium">{quiz.maxScore} points</span>
                    </div>

                    {userRole === 'TEACHER' && (
                        <div className="flex justify-between">
                            <span>Attempts:</span>
                            <span className="font-medium">{quiz._count.attempts}</span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <span>Created:</span>
                        <span className="font-medium">
                            {new Date(quiz.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {userRole === 'TEACHER' ? (
                            quiz.state === 'yet_to_start' ? (
                                'Click to start quiz and manage participants'
                            ) : quiz.state === 'ongoing' ? (
                                'Quiz in progress - View live participants'
                            ) : (
                                'View results and analytics'
                            )
                        ) : (
                            quiz.state === 'yet_to_start' ? (
                                'Quiz not started yet'
                            ) : quiz.state === 'ongoing' ? (
                                'Click to join the quiz'
                            ) : (
                                'Quiz completed'
                            )
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default function QuizList() {
    const { user } = useAuthStore();
    const {
        quizzes,
        isLoadingQuizzes,
        quizzesError,
        totalQuizzes,
        getQuizzes
    } = useQuizStore();

    useEffect(() => {
        getQuizzes();
    }, [getQuizzes]);

    if (isLoadingQuizzes) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center space-y-4">
                    <LoadingSpinner size="lg" className="text-yellow-500" />
                    <p className="text-gray-600 dark:text-gray-400">Loading quizzes...</p>
                </div>
            </div>
        );
    }

    if (quizzesError) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 dark:text-red-400 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">Error Loading Quizzes</h3>
                    <p className="text-sm">{quizzesError}</p>
                </div>
                <button
                    onClick={getQuizzes}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold mb-2">No Quizzes Found</h3>
                    <p className="text-sm">
                        {user?.role === 'TEACHER'
                            ? "You haven't created any quizzes yet. Create your first quiz to get started!"
                            : "No quizzes are available at the moment. Check back later!"
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user?.role === 'TEACHER' ? 'My Quizzes' : 'Available Quizzes'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {totalQuizzes} {totalQuizzes === 1 ? 'quiz' : 'quizzes'} total
                    </p>
                </div>

                <button
                    onClick={getQuizzes}
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                    <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        userRole={user?.role || null}
                    />
                ))}
            </div>
        </div>
    );
}
