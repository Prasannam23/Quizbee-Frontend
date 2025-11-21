"use client"

import React, { useState } from 'react';
import { toastNotifications } from '@/lib/toastNotifications';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/component/ui/button';
import { Input } from '@/component/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateQuizQuestions, initializeGemini, validateApiKey, getApiKeyFromEnv, type GeneratedQuestion } from '@/lib/gemini';

interface AIQuizGeneratorProps {
    onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

export default function AIQuizGenerator({ onQuestionsGenerated }: AIQuizGeneratorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [topic, setTopic] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState('5');
    const [difficulty, setDifficulty] = useState('medium');
    const [marksPerQuestion, setMarksPerQuestion] = useState('10');
    const [timePerQuestion, setTimePerQuestion] = useState('2');
    const [error, setError] = useState('');
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [manualApiKey, setManualApiKey] = useState('');

    // Check if API key is available in environment
    const envApiKey = getApiKeyFromEnv();

    const handleGenerateQuestions = async () => {
        setError('');

        // Check for API key
        const apiKeyToUse = envApiKey || manualApiKey;

        if (!apiKeyToUse) {
            setShowApiKeyInput(true);
            setError('API key is required. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment or enter it manually.');
            return;
        }

        if (!validateApiKey(apiKeyToUse)) {
            setError('Invalid API key format. Make sure it starts with "AIza"');
            return;
        }

        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        if (topic.trim().split(' ').length > 10) {
            setError('Topic should be maximum 10 words');
            return;
        } try {
            setIsLoading(true);

            // Initialize Gemini with API key
            initializeGemini(apiKeyToUse);

            // Generate questions
            const questions = await generateQuizQuestions({
                topic: topic.trim(),
                numberOfQuestions: parseInt(numberOfQuestions),
                difficulty: difficulty as 'easy' | 'medium' | 'hard',
                marksPerQuestion: parseInt(marksPerQuestion),
                timePerQuestion: parseInt(timePerQuestion),
            });

            // Pass questions to parent component
            onQuestionsGenerated(questions);

            // Show success message
            toastNotifications.success.aiQuestionsGenerated(questions.length);

            // Close modal and reset form
            setIsOpen(false);
            setTopic('');
            setError('');
            setShowApiKeyInput(false);
            setManualApiKey('');

        } catch (error) {
            console.error('Error generating questions:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate questions';
            setError(errorMessage);
            // Use generic error toast for AI generation errors
            toastNotifications.error.networkError();
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setTopic('');
        setError('');
        setShowApiKeyInput(false);
        setManualApiKey('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => {
            setIsOpen(open);
            if (!open) resetForm();
        }}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        AI Quiz Generator
                    </DialogTitle>
                    <DialogDescription>
                        Generate quiz questions automatically using Gemini AI. Enter a topic and let AI create engaging questions for you.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Show API key status or input */}
                    {!envApiKey && (
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="apiKey">Gemini API Key</Label>
                                <span className="text-xs text-orange-500">Not found in environment</span>
                            </div>
                            {showApiKeyInput ? (
                                <>
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        placeholder="Enter your Gemini API key"
                                        value={manualApiKey}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualApiKey(e.target.value)}
                                        className="bg-white/50 border-gray-200"
                                    />
                                    <p className="text-xs text-gray-500">
                                        Get your API key from{' '}
                                        <a
                                            href="https://makersuite.google.com/app/apikey"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-500 hover:underline"
                                        >
                                            Google AI Studio
                                        </a>
                                    </p>
                                </>
                            ) : (
                                <p className="text-xs text-gray-600 p-2 bg-yellow-50 rounded border">
                                    Set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file or click &quot;Generate Questions&quot; to enter manually.
                                </p>
                            )}
                        </div>
                    )}

                    {envApiKey && (
                        <div className="p-2 bg-green-50 rounded border border-green-200">
                            <span className="text-xs text-green-600 flex items-center gap-1">
                                ✓ API key loaded from environment
                            </span>
                        </div>
                    )}

                    {/* Topic Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="topic">Topic (max 10 words)</Label>
                        <Input
                            id="topic"
                            placeholder="e.g., JavaScript fundamentals, World History, Biology"
                            value={topic}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
                            className="bg-white/50 border-gray-200"
                            maxLength={100}
                        />
                        <p className="text-xs text-gray-500">
                            {topic.trim().split(' ').filter(word => word.length > 0).length}/10 words
                        </p>
                    </div>

                    {/* Number of Questions */}
                    <div className="grid gap-2">
                        <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                        <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">3 Questions</SelectItem>
                                <SelectItem value="5">5 Questions</SelectItem>
                                <SelectItem value="10">10 Questions</SelectItem>
                                <SelectItem value="15">15 Questions</SelectItem>
                                <SelectItem value="20">20 Questions</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Difficulty */}
                    <div className="grid gap-2">
                        <Label htmlFor="difficulty">Difficulty Level</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Marks and Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="marks">Marks per Question</Label>
                            <Select value={marksPerQuestion} onValueChange={setMarksPerQuestion}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 marks</SelectItem>
                                    <SelectItem value="10">10 marks</SelectItem>
                                    <SelectItem value="15">15 marks</SelectItem>
                                    <SelectItem value="20">20 marks</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time">Time per Question (min)</Label>
                            <Select value={timePerQuestion} onValueChange={setTimePerQuestion}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 minute</SelectItem>
                                    <SelectItem value="2">2 minutes</SelectItem>
                                    <SelectItem value="3">3 minutes</SelectItem>
                                    <SelectItem value="5">5 minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGenerateQuestions}
                        disabled={isLoading || !topic.trim() || (!envApiKey && !manualApiKey.trim())}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate Questions
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
