import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-10 px-4 rounded-lg text-sm outline-none transition-all duration-200 border border-gray-200 bg-white/50 backdrop-blur-sm placeholder:text-gray-400 hover:bg-white/70 focus:bg-white focus:border-gray-300',
          error
            ? 'border-red-300 bg-red-50/50'
            : '',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
