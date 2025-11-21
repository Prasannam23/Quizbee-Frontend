'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/userAuthStore';
import LoadingSpinner from '@/component/ui/loading-spinner';
import { Card, CardContent } from '@/component/ui/card';
import { Button } from '@/component/ui/button';
import WebSocketProvider from '@/component/websocket/WebSocketProvider';
import StudentQuizInterface from '@/component/quiz/StudentQuizInterface';

export default function StudentTestPage() {
    const params = useParams();
    const quizId = params.quizId as string;

    const { user } = useAuthStore();
    const { selectedQuiz, isLoadingQuiz, quizError, getQuizById } = useQuizStore();

    useEffect(() => {
        if (quizId) {
            getQuizById(quizId);
        }
    }, [quizId, getQuizById]);

    const handleBackToStudent = () => {
        window.location.href = '/student';
    };

    if (isLoadingQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center space-y-4">
                    <LoadingSpinner size="lg" className="text-blue-500" />
                    <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (quizError || !selectedQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <div className="text-red-600 dark:text-red-400 mb-4">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold mb-2">Quiz Not Found</h3>
                            <p className="text-sm mb-4">{quizError || 'The quiz you are looking for does not exist or has ended.'}</p>
                        </div>
                        <Button onClick={handleBackToStudent} className="bg-blue-600 text-white hover:bg-blue-700">
                            Back to Student Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Check if user is a student
    if (user?.role !== 'STUDENT') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <div className="text-yellow-600 dark:text-yellow-400 mb-4">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                            <p className="text-sm mb-4">Only students can access this quiz page.</p>
                        </div>
                        <Button onClick={handleBackToStudent} className="bg-blue-600 text-white hover:bg-blue-700">
                            Go to Student Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show quiz info for completed quiz
    if (selectedQuiz.state === 'completed') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="text-gray-600 dark:text-gray-400 mb-4">
                                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-lg font-semibold mb-2">Quiz Completed</h3>
                                <p className="text-sm mb-4">This quiz has already ended.</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold mb-2">{selectedQuiz.title}</h4>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p>Total Questions: {selectedQuiz.questions.length}</p>
                                    <p>Max Score: {selectedQuiz.maxScore} points</p>
                                </div>
                            </div>
                            <Button onClick={handleBackToStudent} className="bg-blue-600 text-white hover:bg-blue-700">
                                Back to Student Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Render the student quiz interface for active/waiting quizzes
    return (
        <WebSocketProvider>
            <StudentQuizInterface quizId={quizId} />
        </WebSocketProvider>
    );
}