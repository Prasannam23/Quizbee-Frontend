/**
 * Quiz State Management - Centralized logic for quiz states
 * Handles state transitions, UI configurations, and business logic
 */

import { 
    Clock, 
    Play, 
    CheckCircle, 
    AlertCircle, 
    Users, 
    Pause,
    RotateCcw
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type QuizState = 
    | 'draft'           // Quiz is being created/edited
    | 'yet_to_start'    // Quiz is ready but not started
    | 'waiting_room'    // Quiz room created, waiting for participants
    | 'countdown'       // Pre-quiz countdown (3-2-1)
    | 'ongoing'         // Quiz is actively running
    | 'paused'          // Quiz is temporarily paused
    | 'completed'       // Quiz finished successfully
    | 'cancelled'       // Quiz was cancelled
    | 'error';          // Quiz encountered an error

export interface QuizStateConfig {
    variant: 'default' | 'secondary' | 'outline' | 'destructive';
    icon: LucideIcon;
    text: string;
    description: string;
    className: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    allowedActions: string[];
    nextStates: QuizState[];
}

export class QuizStateManager {
    private static stateConfigs: Record<QuizState, QuizStateConfig> = {
        draft: {
            variant: 'outline',
            icon: AlertCircle,
            text: 'Draft',
            description: 'Quiz is being created or edited',
            className: 'bg-gray-50 text-gray-700 border-gray-300 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-600',
            bgColor: 'bg-gray-50 dark:bg-gray-900',
            borderColor: 'border-gray-300 dark:border-gray-600',
            textColor: 'text-gray-700 dark:text-gray-400',
            allowedActions: ['edit', 'delete', 'publish'],
            nextStates: ['yet_to_start']
        },

        yet_to_start: {
            variant: 'secondary',
            icon: Clock,
            text: 'Ready to Start',
            description: 'Quiz is ready and waiting for teacher to create room',
            className: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-700',
            bgColor: 'bg-blue-50 dark:bg-blue-950',
            borderColor: 'border-blue-300 dark:border-blue-700',
            textColor: 'text-blue-700 dark:text-blue-400',
            allowedActions: ['create_room', 'edit', 'delete'],
            nextStates: ['waiting_room', 'cancelled']
        },

        waiting_room: {
            variant: 'secondary',
            icon: Users,
            text: 'Waiting for Students',
            description: 'Room created, students can join using the join code',
            className: 'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-700',
            bgColor: 'bg-yellow-50 dark:bg-yellow-950',
            borderColor: 'border-yellow-300 dark:border-yellow-700',
            textColor: 'text-yellow-700 dark:text-yellow-400',
            allowedActions: ['start_quiz', 'cancel', 'kick_participant'],
            nextStates: ['countdown', 'cancelled']
        },

        countdown: {
            variant: 'default',
            icon: RotateCcw,
            text: 'Starting Soon',
            description: 'Quiz will begin in a few seconds',
            className: 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-700',
            bgColor: 'bg-orange-50 dark:bg-orange-950',
            borderColor: 'border-orange-300 dark:border-orange-700',
            textColor: 'text-orange-700 dark:text-orange-400',
            allowedActions: ['cancel'],
            nextStates: ['ongoing', 'cancelled']
        },

        ongoing: {
            variant: 'default',
            icon: Play,
            text: 'In Progress',
            description: 'Quiz is currently active and students are answering questions',
            className: 'bg-green-50 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400 dark:border-green-700',
            bgColor: 'bg-green-50 dark:bg-green-950',
            borderColor: 'border-green-300 dark:border-green-700',
            textColor: 'text-green-700 dark:text-green-400',
            allowedActions: ['next_question', 'pause', 'end_quiz', 'kick_participant'],
            nextStates: ['paused', 'completed', 'cancelled']
        },

        paused: {
            variant: 'secondary',
            icon: Pause,
            text: 'Paused',
            description: 'Quiz is temporarily paused by the teacher',
            className: 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-700',
            bgColor: 'bg-purple-50 dark:bg-purple-950',
            borderColor: 'border-purple-300 dark:border-purple-700',
            textColor: 'text-purple-700 dark:text-purple-400',
            allowedActions: ['resume', 'end_quiz', 'cancel'],
            nextStates: ['ongoing', 'completed', 'cancelled']
        },

        completed: {
            variant: 'outline',
            icon: CheckCircle,
            text: 'Completed',
            description: 'Quiz has finished successfully',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-700',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950',
            borderColor: 'border-emerald-300 dark:border-emerald-700',
            textColor: 'text-emerald-700 dark:text-emerald-400',
            allowedActions: ['view_results', 'export_results', 'delete'],
            nextStates: []
        },

        cancelled: {
            variant: 'destructive',
            icon: AlertCircle,
            text: 'Cancelled',
            description: 'Quiz was cancelled before completion',
            className: 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-700',
            bgColor: 'bg-red-50 dark:bg-red-950',
            borderColor: 'border-red-300 dark:border-red-700',
            textColor: 'text-red-700 dark:text-red-400',
            allowedActions: ['delete', 'restart'],
            nextStates: ['yet_to_start']
        },

        error: {
            variant: 'destructive',
            icon: AlertCircle,
            text: 'Error',
            description: 'Quiz encountered an error and needs attention',
            className: 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-700',
            bgColor: 'bg-red-50 dark:bg-red-950',
            borderColor: 'border-red-300 dark:border-red-700',
            textColor: 'text-red-700 dark:text-red-400',
            allowedActions: ['retry', 'cancel', 'delete'],
            nextStates: ['yet_to_start', 'cancelled']
        }
    };

    /**
     * Get configuration for a quiz state
     */
    static getStateConfig(state: QuizState): QuizStateConfig {
        const config = this.stateConfigs[state];
        if (!config) {
            console.warn(`Unknown quiz state: ${state}`);
            return this.stateConfigs.error;
        }
        return config;
    }

    /**
     * Check if an action is allowed for the current state
     */
    static isActionAllowed(state: QuizState, action: string): boolean {
        const config = this.getStateConfig(state);
        return config.allowedActions.includes(action);
    }

    /**
     * Check if state transition is valid
     */
    static canTransitionTo(from: QuizState, to: QuizState): boolean {
        const config = this.getStateConfig(from);
        return config.nextStates.includes(to);
    }

    /**
     * Get user-friendly instructions for each state
     */
    static getStateInstructions(state: QuizState, userRole: 'TEACHER' | 'STUDENT'): {
        title: string;
        steps: string[];
        canProceed: boolean;
    } {
        switch (state) {
            case 'yet_to_start':
                return userRole === 'TEACHER' 
                    ? {
                        title: 'Ready to Launch',
                        steps: [
                            'Click "Create Room" to set up the quiz session',
                            `Share join code with students`,
                            'Wait for students to join the room',
                            'Click "Start Quiz" when everyone is ready'
                        ],
                        canProceed: true
                    }
                    : {
                        title: 'Waiting for Teacher',
                        steps: [
                            'The teacher will start the quiz soon',
                            'Make sure you have a stable internet connection',
                            'Stay on this page to join automatically',
                            'Be ready to answer questions quickly'
                        ],
                        canProceed: false
                    };

            case 'waiting_room':
                return userRole === 'TEACHER'
                    ? {
                        title: 'Students Joining',
                        steps: [
                            'Students are joining using the join code',
                            'Monitor participant list on the right',
                            'You can remove participants if needed',
                            'Click "Start Quiz" when ready to begin'
                        ],
                        canProceed: true
                    }
                    : {
                        title: 'Joined Successfully',
                        steps: [
                            'You are now in the quiz room',
                            'Waiting for teacher to start the quiz',
                            'Questions will appear automatically',
                            'Answer quickly for bonus points'
                        ],
                        canProceed: false
                    };

            case 'ongoing':
                return userRole === 'TEACHER'
                    ? {
                        title: 'Quiz in Progress',
                        steps: [
                            'Monitor student progress and responses',
                            'Move to next question when ready',
                            'Use pause if you need a break',
                            'End quiz when all questions are completed'
                        ],
                        canProceed: true
                    }
                    : {
                        title: 'Answer the Questions',
                        steps: [
                            'Read each question carefully',
                            'Select your answer before time runs out',
                            'Faster correct answers get bonus points',
                            'Wait for the next question to appear'
                        ],
                        canProceed: false
                    };

            case 'completed':
                return {
                    title: 'Quiz Completed',
                    steps: [
                        'All questions have been answered',
                        'Final scores are being calculated',
                        'View detailed results and analytics',
                        'Export results if needed'
                    ],
                    canProceed: false
                };

            default:
                return {
                    title: 'Quiz Status',
                    steps: ['Please wait for further instructions'],
                    canProceed: false
                };
        }
    }

    /**
     * Get progress percentage for the current state
     */
    static getProgressPercentage(state: QuizState, currentQuestion?: number, totalQuestions?: number): number {
        switch (state) {
            case 'draft':
                return 0;
            case 'yet_to_start':
                return 10;
            case 'waiting_room':
                return 20;
            case 'countdown':
                return 25;
            case 'ongoing':
                if (currentQuestion && totalQuestions) {
                    return 30 + (currentQuestion / totalQuestions) * 60;
                }
                return 50;
            case 'paused':
                return 50;
            case 'completed':
                return 100;
            case 'cancelled':
            case 'error':
                return 0;
            default:
                return 0;
        }
    }
}

/**
 * Hook for using quiz state management
 */
export function useQuizState(initialState: QuizState = 'yet_to_start') {
    const config = QuizStateManager.getStateConfig(initialState);
    
    return {
        config,
        isActionAllowed: (action: string) => QuizStateManager.isActionAllowed(initialState, action),
        canTransitionTo: (newState: QuizState) => QuizStateManager.canTransitionTo(initialState, newState),
        getInstructions: (userRole: 'TEACHER' | 'STUDENT') => QuizStateManager.getStateInstructions(initialState, userRole),
        getProgress: (currentQ?: number, totalQ?: number) => QuizStateManager.getProgressPercentage(initialState, currentQ, totalQ)
    };
}
