'use client';

import { Input } from '@/component/ui/input';

interface Props {
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export default function AuthInput({
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  onKeyPress,
}: Props) {
  return (
    <div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
