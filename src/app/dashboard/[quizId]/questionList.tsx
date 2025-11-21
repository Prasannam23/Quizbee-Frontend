import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Clock, CheckCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  marks: number;
  timeLimit: number;
}

interface QuestionListProps {
  question: Question;
  index: number;
  isTeacher: boolean;
}

const QuestionList: React.FC<QuestionListProps> = ({ question, index, isTeacher }) => {
  return (
    <div key={question.id} className="group">
      <Card className="border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800">
                Question {index + 1}
              </Badge>
              <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4" />
                  <span>{question.marks} pts</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{question.timeLimit} min</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              {question.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {question.options.map((option, optIndex) => (
                <div
                  key={optIndex}
                  className={`p-4 rounded-lg border transition-colors ${isTeacher && optIndex === question.answerIndex
                    ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="text-sm">{option}</span>
                    </div>
                    {isTeacher && optIndex === question.answerIndex && (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionList;
