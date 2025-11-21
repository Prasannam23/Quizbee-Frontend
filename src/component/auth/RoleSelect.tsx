'use client';

import { Button } from '@/component/ui/button';
import { Role } from '@/types/globaltypes';

interface Props {
  onSelect: (role: Role) => void;
}

export default function RoleSelector({ onSelect }: Props) {
  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        className="w-full py-6"
        onClick={() => onSelect('STUDENT')}
      >
        🎓 Student
      </Button>
      <Button
        variant="outline"
        className="w-full py-6"
        onClick={() => onSelect('TEACHER')}
      >
        👨‍🏫 Teacher
      </Button>
    </div>
  );
}
