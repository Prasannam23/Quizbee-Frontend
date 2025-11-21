'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/component/ui/button';
import { Card, CardContent } from '@/component/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

type ScoreRange = {
  range: string;
  count: number;
};

type AnalyticsData = {
  title: string;
  participants: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  scoreDistribution: ScoreRange[];
};

export default function QuizAnalyticsPage() {
  const params = useParams() as { quizId: string };
  const router = useRouter();

  const analytics: AnalyticsData = {
    title: 'React Concepts',
    participants: 32,
    averageScore: 76,
    highestScore: 98,
    lowestScore: 42,
    scoreDistribution: [
      { range: '0-20', count: 4 },
      { range: '21-40', count: 6 },
      { range: '41-60', count: 10 },
      { range: '61-80', count: 8 },
      { range: '81-100', count: 4 }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Analytics: {analytics.title}</h1>
            <p className="text-gray-500 text-sm mt-1">Quiz ID: {params.quizId}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-300 dark:border-gray-700"
          >
            ← Back
          </Button>
        </div>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Participants</p>
              <h3 className="text-xl font-semibold mt-1">{analytics.participants}</h3>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Average Score</p>
              <h3 className="text-xl font-semibold mt-1">{analytics.averageScore}%</h3>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Highest Score</p>
              <h3 className="text-xl font-semibold mt-1">{analytics.highestScore}</h3>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Lowest Score</p>
              <h3 className="text-xl font-semibold mt-1">{analytics.lowestScore}</h3>
            </CardContent>
          </Card>
        </section>

        {/* Score Distribution Chart */}
        <section>
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="range" stroke="#6b7280" />
                    <YAxis allowDecimals={false} stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6b7280" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
