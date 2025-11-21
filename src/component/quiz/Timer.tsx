
"use client";

import { useState, useEffect } from "react";
import { TimerProps } from "@/types/globaltypes";
import { useWebSocketStore } from "@/store/useWebSocketStore";

export default function Timer({ timeLimit, onTimeUp }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const { currentQuestion } = useWebSocketStore();

    useEffect(() => {

        setTimeLeft(timeLimit);
    }, [timeLimit, currentQuestion]);

    useEffect(() => {

        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }


        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);


        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    // Calculate progress percentage for visual bar
    const progressPercentage = (timeLeft / timeLimit) * 100;

    // Determine bar color based on remaining time
    const getBarColor = () => {
        if (progressPercentage > 60) return "from-green-400 to-green-500";
        if (progressPercentage > 30) return "from-yellow-400 to-orange-400";
        return "from-red-400 to-red-500";
    };

    // Determine text color based on remaining time
    const getTextColor = () => {
        if (timeLeft <= 10) return "text-red-600";
        if (timeLeft <= 30) return "text-orange-600";
        return "text-green-600";
    };

    return (
        <div className="w-full mb-6 bg-white rounded-lg shadow-lg p-4">
            {/* Timer Header */}
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                    Time Remaining
                </span>
                <span className={`text-2xl font-bold ${getTextColor()} transition-colors duration-300`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                    className={`bg-gradient-to-r ${getBarColor()} h-full rounded-full transition-all duration-1000 ease-linear`}
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            {/* Time Status Text */}
            <div className="mt-2 text-center">
                {timeLeft <= 0 && (
                    <span className="text-red-600 font-bold">
                        Times up
                    </span>)}
                {timeLeft <= 10 && (
                    <span className="text-sm text-red-600 font-medium animate-pulse">
                        ⚠️ Time almost up!
                    </span>
                )}
                {timeLeft > 10 && timeLeft <= 30 && (
                    <span className="text-sm text-orange-600 font-medium">
                        🏃‍♂️ Hurry up!
                    </span>
                )}
                {timeLeft > 30 && (
                    <span className="text-sm text-gray-600">
                        📝 Take your time
                    </span>
                )}
            </div>
        </div>
    );
}
