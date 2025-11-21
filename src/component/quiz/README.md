# Quiz Components Documentation

This directory contains all the separated quiz-related components for better code organization and maintainability.

## 📁 File Structure

```
src/component/quiz/
├── Timer.tsx           # Countdown timer with visual progress
├── QuestionCard.tsx    # Interactive question display
├── RankDisplay.tsx     # Student performance showcase
├── Leaderboard.tsx     # Live rankings display
├── index.ts           # Centralized exports
└── README.md          # This documentation
```

## 🧩 Components Overview

### 1. Timer Component (`Timer.tsx`)
**Purpose**: Real-time countdown timer for quiz questions

**Features**:
- Visual countdown with color-changing progress bar
- Automatic callback when time expires
- Smooth animations and transitions
- Time formatting (MM:SS)
- Visual indicators for time urgency

**Props**:
- `timeLimit`: number (in seconds)
- `onTimeUp`: () => void

### 2. QuestionCard Component (`QuestionCard.tsx`)
**Purpose**: Display quiz questions with interactive answer options

**Features**:
- Interactive option selection with visual feedback
- Disabled state after answering
- Letter-based option labels (A, B, C, D)
- Question metadata display (points, time limit)
- Confirmation states

**Props**:
- `question`: Question object
- `onAnswerSelect`: (optionIndex: number) => void
- `selectedAnswer`: number | null
- `isAnswered`: boolean

### 3. RankDisplay Component (`RankDisplay.tsx`)
**Purpose**: Show student's current performance and ranking

**Features**:
- Animated gradient backgrounds based on rank
- Performance indicators with emojis
- Current rank and total marks display
- Motivational messages
- Responsive design

**Props**:
- `rank`: number
- `totalMarks`: number

### 4. Leaderboard Component (`Leaderboard.tsx`)
**Purpose**: Live ranking display with real-time updates

**Features**:
- Real-time leaderboard updates
- Top 10 participants display
- Special styling for top 3 positions
- User name resolution from WebSocket users
- Empty state handling
- Smooth animations

**Props**:
- `leaderboard`: LeaderboardData (Record<string, number>)
- `users`: WebSocketUser[]

## 🔧 Usage Examples

### Basic Import
```tsx
import Timer from '@/component/quiz/Timer';
import QuestionCard from '@/component/quiz/QuestionCard';
import RankDisplay from '@/component/quiz/RankDisplay';
import Leaderboard from '@/component/quiz/Leaderboard';
```

### Centralized Import
```tsx
import { 
    Timer, 
    QuestionCard, 
    RankDisplay, 
    Leaderboard 
} from '@/component/quiz';
```

### Component Usage
```tsx
// Timer
<Timer 
    timeLimit={120} // 2 minutes in seconds
    onTimeUp={handleTimeExpired}
/>

// Question Card
<QuestionCard
    question={currentQuestion}
    onAnswerSelect={handleAnswerSelect}
    selectedAnswer={selectedAnswerIndex}
    isAnswered={hasAnswered}
/>

// Rank Display
<RankDisplay 
    rank={3} 
    totalMarks={85} 
/>

// Leaderboard
<Leaderboard 
    leaderboard={liveScores} 
    users={connectedUsers} 
/>
```

## 🎨 Styling Philosophy

All components follow a consistent design system:

- **Color Scheme**: Blue primary, gradient backgrounds, semantic colors
- **Typography**: Clear hierarchy, readable fonts
- **Spacing**: Consistent padding and margins using Tailwind classes
- **Animations**: Smooth transitions, meaningful micro-interactions
- **Responsive**: Mobile-first approach with desktop enhancements

## 📱 Responsive Design

- **Mobile**: Stacked layout, touch-friendly interactions
- **Tablet**: Optimized spacing and layout
- **Desktop**: Multi-column layouts, hover effects

## 🔄 State Management

Components are designed to be:
- **Stateless**: Most state is managed by parent components
- **Reactive**: Respond to prop changes immediately
- **Performant**: Minimal re-renders, efficient updates

## 🧪 Testing Considerations

When testing these components:
- Mock WebSocket connections
- Test timer functionality with fake timers
- Verify accessibility (keyboard navigation, screen readers)
- Test responsive breakpoints
- Validate user interactions

## 🚀 Performance Tips

- Use React.memo for components that receive stable props
- Implement useCallback for event handlers in parent components
- Consider virtualization for large leaderboards
- Optimize images and icons

## 🔮 Future Enhancements

Potential improvements:
- Animation libraries (Framer Motion)
- Advanced timer features (pause/resume)
- Sound effects for interactions
- Accessibility improvements
- Dark mode support
- Internationalization (i18n)

---

## 📝 Type Safety

All components use TypeScript with strict typing:
- Props are fully typed
- Internal state is typed
- Event handlers have proper signatures
- Integration with global type definitions

For type definitions, see: `src/types/globaltypes.ts`
