import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the AI model
let genAI: GoogleGenerativeAI | null = null;

export function initializeGemini(apiKey?: string) {
  const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API key not found. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment or provide it manually.');
  }
  genAI = new GoogleGenerativeAI(key);
}

export function getApiKeyFromEnv(): string | null {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
}

export interface GeneratedQuestion {
  id: number;
  type: 'mcq';
  text: string;
  options: [string, string, string, string];
  correctAnswer: number;
  marks: number;
  time: number;
}

export interface QuizGenerationRequest {
  topic: string;
  numberOfQuestions: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  marksPerQuestion?: number;
  timePerQuestion?: number;
}

interface ApiQuestionResponse {
  text: string;
  options: [string, string, string, string];
  correctAnswer: number;
}

export async function generateQuizQuestions(
  request: QuizGenerationRequest
): Promise<GeneratedQuestion[]> {
  if (!genAI) {
    throw new Error('Gemini AI not initialized. Please provide API key.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Generate ${request.numberOfQuestions} multiple choice questions about "${request.topic}".

Requirements:
- Each question should be ${request.difficulty || 'medium'} difficulty
- Each question should have exactly 4 options (A, B, C, D)
- Include the correct answer index (0-3)
- Questions should be educational and relevant to the topic
- Avoid ambiguous questions

Format your response as a JSON array with this exact structure:
[
  {
    "text": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  }
]

Topic: ${request.topic}
Number of questions: ${request.numberOfQuestions}
Difficulty: ${request.difficulty || 'medium'}

Return only the JSON array, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const questionsData: ApiQuestionResponse[] = JSON.parse(jsonMatch[0]);
    
    // Transform to our format
    const questions: GeneratedQuestion[] = questionsData.map((q: ApiQuestionResponse, index: number) => ({
      id: index + 1,
      type: 'mcq' as const,
      text: q.text,
      options: q.options as [string, string, string, string],
      correctAnswer: q.correctAnswer,
      marks: request.marksPerQuestion || 10,
      time: request.timePerQuestion || 2,
    }));

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey.trim().length > 0 && apiKey.startsWith('AIza');
}
