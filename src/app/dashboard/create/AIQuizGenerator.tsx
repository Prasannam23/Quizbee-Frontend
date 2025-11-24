"use client";

import React, { useState } from "react";
import { toastNotifications } from "@/lib/toastNotifications";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/component/ui/button";
import { Input } from "@/component/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

import {
  generateQuizQuestions,
  initializeGemini,
  validateApiKey,
  getApiKeyFromEnv,
  type GeneratedQuestion,
} from "@/lib/gemini";

interface AIQuizGeneratorProps {
  onQuestionsGenerated: (questions: GeneratedQuestion[]) => void;
}

export default function AIQuizGenerator({ onQuestionsGenerated }: AIQuizGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");
  const [difficulty, setDifficulty] = useState("medium");
  const [marksPerQuestion, setMarksPerQuestion] = useState("10");
  const [timePerQuestion, setTimePerQuestion] = useState("2");
  const [error, setError] = useState("");
  const [manualApiKey, setManualApiKey] = useState("");

  const envApiKey = getApiKeyFromEnv();

  const handleGenerateQuestions = async () => {
    setError("");

    const apiKeyToUse = envApiKey || manualApiKey;
    if (!apiKeyToUse) {
      setError("Missing API key. Add env or enter manually.");
      return;
    }

    if (!validateApiKey(apiKeyToUse)) {
      setError("Invalid API key format");
      return;
    }

    if (!topic.trim()) {
      setError("Enter a topic");
      return;
    }

    try {
      setIsLoading(true);
      initializeGemini(apiKeyToUse);

      const questions = await generateQuizQuestions({
        topic,
        numberOfQuestions: parseInt(numberOfQuestions),
        difficulty: difficulty as "easy" | "medium" | "hard",
        marksPerQuestion: parseInt(marksPerQuestion),
        timePerQuestion: parseInt(timePerQuestion),
      });

      onQuestionsGenerated(questions);
      toastNotifications.success.aiQuestionsGenerated(questions.length);
      setIsOpen(false);
      setTopic("");
    } catch (err) {
      console.error(err);
      setError("Failed to generate questions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-500 text-white">
          <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Quiz Generator</DialogTitle>
          <DialogDescription>
            Generate quiz questions using Gemini AI
          </DialogDescription>
        </DialogHeader>

        {!envApiKey && (
          <div className="grid gap-2">
            <Label>Gemini API Key</Label>
            <Input
              value={manualApiKey}
              onChange={(e) => setManualApiKey(e.target.value)}
              placeholder="Enter Gemini Key"
              type="password"
            />
          </div>
        )}

        <div className="grid gap-2">
          <Label>Topic</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>

        <div className="grid gap-4 grid-cols-2">
          <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Marks & Time fields */}
        <div className="grid gap-4 grid-cols-2 mt-4">
          <div className="grid gap-2">
            <Label>Marks / Question</Label>
            <Input
              type="number"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(e.target.value)}
              placeholder="Example: 5"
            />
          </div>

          <div className="grid gap-2">
            <Label>Time / Question (minutes)</Label>
            <Input
              type="number"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(e.target.value)}
              placeholder="Example: 2"
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <DialogFooter>
          <Button onClick={handleGenerateQuestions} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
