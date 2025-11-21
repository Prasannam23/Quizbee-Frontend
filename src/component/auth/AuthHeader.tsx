'use client';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
}

export default function AuthHeader({ icon, title, subtitle }: Props) {
  return (
    <div className="text-center mb-8">
      <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
        <span className="text-white dark:text-slate-900 font-bold text-lg">{icon}</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{subtitle}</p>
    </div>
  );
}
