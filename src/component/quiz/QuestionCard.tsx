

"use client";

import { QuestionProps } from "@/types/globaltypes";

export default function QuestionCard({
    question,
    onAnswerSelect,
    selectedAnswer,
    isAnswered,
    disabled
}: QuestionProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            {/* Question Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 leading-relaxed">
                    {question?.question || "jfrbj"}
                </h2>
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        💎 {question?.marks || 89} points
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        ⏱️ {question?.timeLimit || 1} min
                    </span>
                </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
                {question?.options?.length > 0 ? (
                    question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => !isAnswered && onAnswerSelect(index)}
                            // disabled={isAnswered}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 group ${selectedAnswer === index
                                ? "border-blue-500 bg-blue-50 text-blue-800 shadow-md"
                                : isAnswered
                                    ? "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm cursor-pointer"
                                }`}
                        >
                            <div className="flex items-center">
                                {/* Option Letter Circle */}
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center text-sm font-bold transition-all duration-200 ${selectedAnswer === index
                                        ? "border-blue-500 bg-blue-500 text-white"
                                        : isAnswered
                                            ? "border-gray-300 bg-gray-100 text-gray-500"
                                            : "border-gray-400 text-gray-600 group-hover:border-blue-400 group-hover:text-blue-600"
                                        }`}
                                >
                                    {String.fromCharCode(65 + index)}
                                </span>

                                {/* Option Text */}
                                <span className="font-medium flex-1">
                                    {option}
                                </span>

                                {/* Selection Indicator */}
                                {selectedAnswer === index && (
                                    <span className="text-blue-500 ml-2">
                                        ✓
                                    </span>
                                )}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                        No options available for this question
                    </div>
                )}
            </div>

            {/* Answer Status */}
            {isAnswered && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                        <span className="mr-2">✅</span>
                        <span className="font-medium">
                            Answer submitted! Waiting for next question...
                        </span>
                    </div>
                </div>
            )}

            {!isAnswered && !disabled && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center text-blue-800">
                        <span className="mr-2">💡</span>
                        <span className="text-sm">
                            Select an option above to submit your answer
                        </span>
                    </div>
                </div>
            )}
            {disabled && !isAnswered && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center text-red-800">
                        <span className="mr-2">⏰</span>
                        <span className="text-sm">
                            Time is up! You cannot select an answer now.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
