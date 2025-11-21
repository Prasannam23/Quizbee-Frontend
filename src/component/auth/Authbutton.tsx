'use client';

import { Button } from '@/component/ui/button';

interface AuthButtonProps {
  label: string;
  loading: boolean;
  onClick: () => void;
}

export default function AuthButton({ label, loading, onClick }: AuthButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg"
    >
      {loading ? `${label}...` : label}
    </Button>
  );
}
