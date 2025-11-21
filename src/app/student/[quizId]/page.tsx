"use client";



import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useWebSocketStore } from "@/store/useWebSocketStore";
import { useAuthStore } from "@/store/userAuthStore";
import LoadingSpinner from "@/component/ui/loading-spinner";

// Import separated components
import {
    Timer as QuizTimer,
    QuestionCard as QuizQuestionCard,
    RankDisplay as QuizRankDisplay,
    Leaderboard as QuizLeaderboard
} from "@/component/quiz";
import { WaitingScreen } from "./waitingCompenet";
import toast from "react-hot-toast";



export default function StudentQuizPage() {

    const params = useParams();
    const quizId = params.quizId as string;


    const {
        socket,
        loading,
        quizStarted,
        liveUsers,
        leaderboard,
        currentQuestion,
        roomJoined,
        totalmarks,
        rank,
        attemptId,
        connect,
        joinRoom,
        sendMessage,
    } = useWebSocketStore();

    // Auth store for user ID
    const { user } = useAuthStore();

    // Local component state
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [disabled, setDisabled] = useState(false);


    useEffect(() => {
        if (!socket) {
            connect();
        }
    }, [socket, connect]);


    useEffect(() => {
        if (socket && quizId && !roomJoined && !loading) {
            joinRoom(quizId);
        }
    }, [socket, quizId, roomJoined, loading, joinRoom]);


    useEffect(() => {

        // Reset answer state for new question
        toast.success('New question received');
        console.log('New question received:', currentQuestion);
        setSelectedAnswer(null);

        setIsAnswered(false);
        setDisabled(false);

    }, [currentQuestion?.id, currentQuestion]); // Reset when question changes


    const handleAnswerSelect = (optionIndex: number) => {
        if (isAnswered || !currentQuestion || !attemptId || !user?.id) return;

        setSelectedAnswer(optionIndex);
        setIsAnswered(true);

        // Send answer with proper payload structure
        sendMessage('ANSWER', {
            quizId,
            attemptId,
            userId: user.id,
            questionId: currentQuestion.id || currentQuestion.question, // Use question ID if available, fallback to question text
            answer: optionIndex
        });
    };


    const handleTimeUp = () => {
        if (!isAnswered && currentQuestion && attemptId && user?.id) {
            setDisabled(true)
            toast.error('Time is up! Answer not submitted.');
        }
    };


    if (!roomJoined) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100" onClick={() => (console.log(liveUsers))}>
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Joining Quiz Room
                    </h3>
                    <p className="text-gray-600">
                        Please wait while we connect you to the quiz...
                    </p>
                </div>
            </div>
        );
    }


    if (!quizStarted) {
        return (
            <WaitingScreen liveUsers={liveUsers} quizStarted={quizStarted} />

        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Quiz Room: {quizId}
                            </h1>

                        </div>


                        <div className="text-right">
                            <div className="text-sm text-gray-600">Your Score</div>
                            <div className="text-2xl font-bold text-blue-600">{totalmarks}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">

                <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">

                    <div className="lg:col-span-3 space-y-6">

                        {currentQuestion && (
                            <QuizTimer
                                timeLimit={(currentQuestion.timeLimit || 1) * 60}
                                onTimeUp={handleTimeUp}
                                disabled={disabled}
                            />
                        )}


                        {isAnswered && (
                            <QuizRankDisplay
                                rank={rank}
                                totalMarks={totalmarks}
                            />
                        )}


                        {currentQuestion && (
                            <QuizQuestionCard
                                question={currentQuestion}
                                onAnswerSelect={handleAnswerSelect}
                                selectedAnswer={selectedAnswer}
                                isAnswered={isAnswered}
                                disabled={disabled}
                            />
                        )}
                    </div>


                    <div className="lg:col-span-1">
                        <QuizLeaderboard

                            users={leaderboard}
                        />
                    </div>
                </div>


                <div className="lg:hidden space-y-6">
                    {/* Timer - only show when there's a current question */}
                    {currentQuestion && (
                        <QuizTimer
                            timeLimit={(currentQuestion.timeLimit || 1) * 60} // Convert minutes to seconds
                            onTimeUp={handleTimeUp}
                        />
                    )}


                    {isAnswered && (
                        <QuizRankDisplay
                            rank={rank}
                            totalMarks={totalmarks}
                        />
                    )}

                    {
                        currentQuestion && (<QuizQuestionCard
                            question={currentQuestion}
                            onAnswerSelect={handleAnswerSelect}
                            selectedAnswer={selectedAnswer}
                            isAnswered={isAnswered}
                        />
                        )

                    }

                    <QuizLeaderboard

                        users={leaderboard}
                    />
                </div>
            </div>
        </div>
    );
}