'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/userAuthStore';
import { Role } from '@/types/globaltypes';

import AuthCard from '@/component/auth/Authcard';
import AuthHeader from '@/component/auth/AuthHeader';
import AuthInput from '@/component/auth/AuthInput';
import AuthButton from '@/component/auth/Authbutton';
import AuthFooter from '@/component/auth/Authfooter';

export default function SignInPage() {
  const router = useRouter();
  const { login, loading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('STUDENT');
  const [localError, setLocalError] = useState('');

  const handleSignIn = async () => {
    setLocalError('');

    if (!email || !password) {
      setLocalError('Email and password are required.');
      return;
    }

    try {
      await login(email, password, role);
      router.push(role === 'STUDENT' ? '/student' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `https://quizappbackend.duckdns.org/api/auth/google?role=${role}`;
  };

  return (
    <AuthCard>
      <AuthHeader
        icon="🔒"
        title="Sign In"
        subtitle="Welcome back! Please enter your credentials"
      />

      <div className="space-y-5">
        <AuthInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
        />

        <AuthInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full border rounded-md p-2 text-sm text-slate-700 dark:bg-slate-700 dark:text-white"
        >
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Teacher</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPERADMIN">Superadmin</option>
        </select>

        {(localError || error) && (
          <p className="text-sm text-red-500">{localError || error}</p>
        )}

        <AuthButton
          label="Sign In"
          loading={loading}
          onClick={handleSignIn}
        />

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-slate-800 px-2 text-gray-500">OR</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded"
        >
          Sign in with Google
        </button>

        <AuthFooter
          label="Don’t have an account?"
          linkText="Sign Up"
          redirectTo="/auth/signup"
        />
      </div>
    </AuthCard>
  );
}
