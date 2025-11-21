'use client';

import { Card, CardContent } from '@/component/ui/card';

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
        <CardContent className="p-8">{children}</CardContent>
      </Card>
    </div>
  );
}
