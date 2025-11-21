"use client"

import React from 'react';
import { Card, CardContent } from '@/component/ui/card';
import { Clock, Hash, Target, CheckCircle } from 'lucide-react';

interface Question {
    id: number;
    type: 'mcq';
    options: [string, string, string, string];
    text: string;
    marks: number;
    time: number;
    correctAnswer: number;
}

interface QuizSidebarProps {
    questions: Question[];
    onQuestionClick: (index: number) => void;
}

export default function QuizSidebar({ questions, onQuestionClick }: QuizSidebarProps) {
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    const totalTime = questions.reduce((sum, q) => sum + q.time, 0);

    return (
        <div className="w-full h-full flex flex-col gap-4">
            {/* Quiz Summary */}
            <Card className="p-4">
                <CardContent className="p-0">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Quiz Overview</h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Hash className="w-4 h-4" />
                            <span>{questions.length} Questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Target className="w-4 h-4" />
                            <span>{totalMarks} Total Marks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{totalTime} Minutes</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <Card className="flex-1">
                <CardContent className="p-4">
                    <h3 className="text-md font-medium text-gray-800 mb-3">Questions</h3>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {questions.map((question, index) => (
                            <div
                                key={question.id}
                                onClick={() => onQuestionClick(index)}
                                className="p-3 rounded-lg border border-gray-100 bg-white/30 hover:bg-white/50 cursor-pointer transition-all duration-200 hover:shadow-sm group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium text-gray-700">
                                                Question {index + 1}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 space-y-1">
                                            <div className="flex items-center gap-1">
                                                <Target className="w-3 h-3" />
                                                <span>{question.marks} marks</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{question.time} min</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" />
                                                <span>Answer: {String.fromCharCode(65 + question.correctAnswer)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-purple-400 transition-colors"></div>
                                </div>

                                {/* Question preview */}
                                <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                                    {question.text.length > 50
                                        ? `${question.text.substring(0, 50)}...`
                                        : question.text
                                    }
                                </div>
                            </div>
                        ))}

                        {questions.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No questions added yet</p>
                                <p className="text-xs">Add questions manually or use AI generator</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
