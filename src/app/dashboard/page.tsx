'use client';

import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/userAuthStore';
import { Button } from '@/component/ui/button';
import { Card, CardContent } from '@/component/ui/card';
import QuizList from '@/component/dashboard/QuizList';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FC, useEffect } from 'react';

type StatItem = {
  title: string;
  value: string;
  icon: string;
};

type PerformanceDataItem = {
  name: string;
  avgScore: number;
};

const DashboardPage: FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { quizzes, totalQuizzes, getQuizzes } = useQuizStore();

  // Get stats from actual quiz data
  const stats: StatItem[] = [
    { title: 'Total Quizzes', value: totalQuizzes.toString(), icon: '📝' },
    {
      title: 'Active Quizzes',
      value: quizzes.filter(q => q.state === 'ongoing').length.toString(),
      icon: '🟢'
    },
    {
      title: 'Completed',
      value: quizzes.filter(q => q.state === 'completed').length.toString(),
      icon: '✅'
    },
    {
      title: 'Pending',
      value: quizzes.filter(q => q.state === 'yet_to_start').length.toString(),
      icon: '⏳'
    }
  ];

  const performanceData: PerformanceDataItem[] = [
    { name: 'JS', avgScore: 72 },
    { name: 'React', avgScore: 81 },
    { name: 'CSS', avgScore: 64 },
  ];
  // const { connect, loading } = useWebSocketStore();
  useEffect(() => {

    getQuizzes();

  }, [getQuizzes]);
  // useEffect(() => {
  //   if (!loading) {
  //     console.log(1, "11111111111111111111111111111111", loading)
  //     connect();
  //   }
  // }, [])

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* Header */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-semibold">
              Welcome, {user?.firstName || user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-gray-500 mt-1">Create, manage and review your quizzes.</p>
          </div>
          <Button
            onClick={() => router.push('/dashboard/create')}
            className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 px-6 py-2 rounded-md transition"
          >
            + Create New Quiz
          </Button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <Card key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h3 className="text-xl font-medium mt-1">{item.value}</h3>
                </div>
                <span className="text-2xl">{item.icon}</span>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quiz List - Takes up 3 columns */}
          <div className="lg:col-span-3">
            <QuizList />
          </div>

          {/* Side Panel - Takes up 1 column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Quick Actions</h3>
                <Button
                  onClick={() => router.push('/dashboard/create')}
                  className="w-full bg-black text-white dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  Create Quiz
                </Button>
                <Button variant="outline" className="w-full border-gray-300 dark:border-gray-700">
                  Settings
                </Button>
              </CardContent>
            </Card>

            {/* Performance Chart */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-5 text-center">
                <h3 className="font-semibold mb-4">Performance Overview</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }} />
                      <Bar dataKey="avgScore" fill="#6b7280" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
