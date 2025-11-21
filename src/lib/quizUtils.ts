export const quizStatusConfig = {
  yet_to_start: {
    label: 'Not Started',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: '⏳'
  },
  ongoing: {
    label: 'In Progress',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: '🟢'
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: '✅'
  }
} as const;

export type QuizStatus = keyof typeof quizStatusConfig;
