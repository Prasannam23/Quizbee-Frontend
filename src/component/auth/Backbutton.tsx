'use client';

import { Button } from '@/component/ui/button';

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      className="w-full h-10 mt-2"
      onClick={onClick}
    >
      ← Back to role selection
    </Button>
  );
}
