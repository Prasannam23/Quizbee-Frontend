import { GoogleGenerativeAI } from "@google/generative-ai";

// global variable to store Gemini instance
let genAI: GoogleGenerativeAI | null = null;

export function initializeGemini(apiKey?: string) {
  const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API key not found.");
  }
  genAI = new GoogleGenerativeAI(key);
}

export function getApiKeyFromEnv(): string | null {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
}

export interface GeneratedQuestion {
  id: number;
  type: "mcq";
  text: string;
  options: [string, string, string, string];
  correctAnswer: number;
  marks: number;
  time: number;
}

export interface QuizGenerationRequest {
  topic: string;
  numberOfQuestions: number;
  difficulty?: "easy" | "medium" | "hard";
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
    throw new Error("Gemini not initialized. Provide an API key.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const prompt = `
Generate ${request.numberOfQuestions} multiple choice questions on "${request.topic}".
Each question must:
- Be ${request.difficulty || "medium"} difficulty
- Have exactly 4 options
- Include the correctAnswer index (0-3)

Return response ONLY as JSON array:
[
  {
    "text": "",
    "options": ["", "", "", ""],
    "correctAnswer": 0
  }
]
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Invalid model response");

  const questionsData: ApiQuestionResponse[] = JSON.parse(jsonMatch[0]);

  return questionsData.map((q, index) => ({
    id: index + 1,
    type: "mcq",
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    marks: request.marksPerQuestion || 10,
    time: request.timePerQuestion || 2
  }));
}

export function validateApiKey(key: string) {
  return key.startsWith("AIza");
}
