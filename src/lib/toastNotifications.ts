import toast from 'react-hot-toast';

// Common toast notification patterns for the quiz app
export const toastNotifications = {
  // Success messages
  success: {
    quizCreated: () => toast.success('Quiz created successfully! 🎉', { duration: 4000 }),
    questionAdded: () => toast.success('New question added! ✏️'),
    questionDeleted: () => toast.success('Question deleted! 🗑️'),
    linkCopied: () => toast.success('Link copied to clipboard! 📋'),
    aiQuestionsGenerated: (count: number) => 
      toast.success(`Generated ${count} questions successfully! 🤖`, { duration: 4000 }),
    quizSubmitted: () => toast.success('Quiz submitted successfully! ✅'),
    answerSaved: () => toast.success('Answer saved! 💾', { duration: 2000 }),
  },

  // Error messages
  error: {
    missingTitle: () => toast.error('Please enter a quiz title'),
    noQuestions: () => toast.error('Please add at least one question'),
    invalidQuestions: () => toast.error('Please complete all question fields with valid values'),
    copyFailed: () => toast.error('Failed to copy link'),
    networkError: () => toast.error('Network error. Please check your connection.'),
    unauthorized: () => toast.error('You are not authorized to perform this action'),
    quizNotFound: () => toast.error('Quiz not found'),
    submissionFailed: () => toast.error('Failed to submit quiz. Please try again.'),
  },

  // Loading messages
  loading: {
    creatingQuiz: () => toast.loading('Creating your quiz...'),
    submittingQuiz: () => toast.loading('Submitting your answers...'),
    loadingQuiz: () => toast.loading('Loading quiz...'),
    savingAnswer: () => toast.loading('Saving answer...'),
  },

  // Info messages
  info: {
    timeWarning: (minutes: number) => 
      toast(`⏰ ${minutes} minute${minutes > 1 ? 's' : ''} remaining!`, {
        icon: '⚠️',
        duration: 3000,
      }),
    autoSave: () => toast('Auto-saved! 💾', { 
      icon: '💾',
      duration: 2000,
    }),
    quizStarting: () => toast('Quiz is starting! Good luck! 🍀', {
      duration: 3000,
    }),
  },

  // Warning messages
  warning: {
    unsavedChanges: () => toast('You have unsaved changes!', {
      icon: '⚠️',
      duration: 4000,
    }),
    timeAlmostUp: () => toast('Time is almost up! ⏰', {
      icon: '⚠️',
      duration: 3000,
    }),
  },

  // Custom toast with promise for async operations
  promise: {
    createQuiz: (promise: Promise<unknown>) =>
      toast.promise(promise, {
        loading: 'Creating quiz...',
        success: 'Quiz created successfully! 🎉',
        error: (err: unknown) => (err instanceof Error ? err.message : 'Failed to create quiz'),
      }),
    
    submitQuiz: (promise: Promise<unknown>) =>
      toast.promise(promise, {
        loading: 'Submitting quiz...',
        success: 'Quiz submitted successfully! ✅',
        error: (err: unknown) => (err instanceof Error ? err.message : 'Failed to submit quiz'),
      }),
  },
};

export default toastNotifications;
