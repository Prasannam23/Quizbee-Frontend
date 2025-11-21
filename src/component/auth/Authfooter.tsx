'use client';

import { useRouter } from 'next/navigation';

interface AuthFooterProps {
  label: string;       // e.g., "Already have an account?"
  linkText: string;    // e.g., "Sign In"
  redirectTo: string;  // e.g., "/auth/signin"
}

export default function AuthFooter({ label, linkText, redirectTo }: AuthFooterProps) {
  const router = useRouter();

  return (
    <div className="text-center pt-4 border-t">
      <p className="text-xs">
        {label}
        <button
          onClick={() => router.push(redirectTo)}
          className="hover:underline ml-1 font-medium"
        >
          {linkText}
        </button>
      </p>
    </div>
  );
}
