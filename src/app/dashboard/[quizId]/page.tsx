'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/userAuthStore';
import LoadingSpinner from '@/component/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';


import {
    Trophy,
    BookOpen,
    ArrowLeft,
    AlertCircle
} from 'lucide-react';
import QuestionList from './questionList';
import { useWebSocketStore } from '@/store/useWebSocketStore';
import { WaitingScreen } from '@/app/student/[quizId]/waitingCompenet';
import { Leaderboard } from '@/component/quiz';



export default function QuizDetailPage() {
    const router = useRouter();
    const params = useParams();
    const quizId = params.quizId as string;

    const { user } = useAuthStore();
    const { selectedQuiz, isLoadingQuiz, quizError, getQuizById, cacheQuizToRedis, } = useQuizStore();
    const { roomJoined, liveUsers, quizStarted, sendMessage, leaderboard } = useWebSocketStore();
    useEffect(() => {
        if (quizId && quizId !== selectedQuiz?.id) {
            getQuizById(quizId);
        }
    }, [quizId, selectedQuiz?.id, getQuizById]);
    const startQuiz = () => {
        sendMessage('START_QUIZ', { quizId });
    }


    const handleBackToDashboard = () => {
        router.push('/dashboard');
    };
    const handleCacheQuiz = async () => {
        await cacheQuizToRedis(quizId);
    }
    const isTeacher = user?.role === 'TEACHER';


    const quizState = (selectedQuiz?.state) || 'yet_to_start';
    useEffect(() => {
        if (quizState === 'ongoing') {
            cacheQuizToRedis(quizId);
        }

    }, [quizState, quizId, cacheQuizToRedis])

    if (isLoadingQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <div className="flex flex-col items-center space-y-6 p-8">
                    <LoadingSpinner size="lg" className="text-blue-600" />
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Loading Quiz Details
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Please wait while we fetch the quiz information...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (quizError || !selectedQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <Card className="w-full max-w-md mx-4">
                    <CardContent className="p-8 text-center">
                        <div className="mb-6">
                            <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Quiz Not Found
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {quizError || 'The quiz you are looking for does not exist or has been removed.'}
                            </p>
                        </div>
                        <Button
                            onClick={handleBackToDashboard}
                            className="w-full"
                            variant="default"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }


    if (quizState === 'ongoing') {
        return (
            <div>
                <Leaderboard users={leaderboard} />
            </div>
        );
    }
    if (roomJoined) {
        return (
            <WaitingScreen
                liveUsers={liveUsers} quizStarted={quizStarted} isHost={true} start={startQuiz} />
        )
    }


    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <div className="sticky top-0 z-10 h-fit    dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={handleBackToDashboard}
                            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Dashboard</span>
                        </Button>


                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">



                    {/* Sidebar */}
                    <div className="xl:col-span-2 space-y-6 sticky  top-4">
                        <ScrollArea className="h-[calc(100vh-12rem)]">
                            <div className="space-y-6 pr-2">

                                {isTeacher && selectedQuiz.state === 'yet_to_start' && (
                                    <button onClick={handleCacheQuiz} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                        Enter Quiz Room
                                    </button>
                                )}

                                {/* Quick Stats */}
                                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-slate-900 dark:text-slate-100 text-lg flex items-center space-x-2">
                                            <Trophy className="w-5 h-5" />
                                            <span>Quick Stats</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 dark:text-slate-400">Status</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {quizState}
                                                </Badge>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 dark:text-slate-400">Quiz ID</span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {selectedQuiz.id}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 dark:text-slate-400">Questions</span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {selectedQuiz.questions.length}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 dark:text-slate-400">Max Score</span>
                                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {selectedQuiz.maxScore} pts
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-slate-500 dark:text-slate-400">Join Code</span>
                                                <Badge className="font-mono bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800">
                                                    {selectedQuiz.joinCode}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                            </div>
                        </ScrollArea>
                    </div>
                    {/* Main Content */}
                    <div className="xl:col-span-2 ">




                        {(isTeacher || selectedQuiz.state === 'yet_to_start') && (
                            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5" />
                                        <span>Quiz Questions ({selectedQuiz.questions.length})</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <ScrollArea className="h-[600px] px-6 pb-6">
                                        <div className="space-y-4">
                                            {selectedQuiz.questions.map((question, index) => (
                                                <QuestionList key={question.id} isTeacher={isTeacher} question={question} index={index} />
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>

    );
}