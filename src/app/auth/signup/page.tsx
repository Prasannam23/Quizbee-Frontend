'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/store/useQuizStore';
import { useAuthStore } from '@/store/userAuthStore';
import { Role } from '@/types/globaltypes';

// Reusable auth components
import AuthCard from '@/component/auth/Authcard';
import AuthHeader from '@/component/auth/AuthHeader';
import AuthInput from '@/component/auth/AuthInput';
import AuthButton from '@/component/auth/Authbutton';
import RoleSelector from '@/component/auth/RoleSelect';
import BackButton from '@/component/auth/Backbutton';
import AuthFooter from '@/component/auth/Authfooter';

export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();
  const { register, loading, error } = useAuthStore();
  const setUserName = useQuizStore((state) => state.setUsername);
  const setRole = useQuizStore((state) => state.setRole);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (selectedRole === 'TEACHER' && !formData.institution.trim()) {
      newErrors.institution = 'Institution is required for Teachers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm() || !selectedRole) return;

    try {
      await register(formData.fullName, formData.email, formData.password, selectedRole);
      setUserName(formData.fullName);
      setRole(selectedRole);

      router.push(selectedRole === 'TEACHER' ? '/dashboard' : '/student');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSignUp();
  };

  const handleBackToRoleSelect = () => {
    setStep(1);
    setSelectedRole(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      institution: '',
    });
    setErrors({});
  };

  return (
    <AuthCard>
      <AuthHeader
        icon={step === 1 ? '✨' : selectedRole === 'STUDENT' ? '🎓' : '👨‍🏫'}
        title={step === 1 ? 'Get Started' : `Welcome, ${selectedRole?.toLowerCase()}!`}
        subtitle={step === 1 ? 'Choose your role to begin' : 'Complete your profile to continue'}
      />

      {step === 1 ? (
        <RoleSelector onSelect={handleRoleSelect} />
      ) : (
        <>
          <div className="space-y-5">
            <AuthInput
              placeholder="Full Name"
              value={formData.fullName}
              error={errors.fullName}
              onChange={(v) => handleInputChange('fullName', v)}
            />
            <AuthInput
              type="email"
              placeholder="Email Address"
              value={formData.email}
              error={errors.email}
              onChange={(v) => handleInputChange('email', v)}
            />
            <AuthInput
              type="password"
              placeholder="Password"
              value={formData.password}
              error={errors.password}
              onChange={(v) => handleInputChange('password', v)}
            />
            <AuthInput
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              error={errors.confirmPassword}
              onChange={(v) => handleInputChange('confirmPassword', v)}
              onKeyPress={handleKeyPress}
            />
            {selectedRole === 'TEACHER' && (
              <AuthInput
                placeholder="Institution/Organization"
                value={formData.institution}
                error={errors.institution}
                onChange={(v) => handleInputChange('institution', v)}
                onKeyPress={handleKeyPress}
              />
            )}

            <AuthButton label="Create Account" loading={loading} onClick={handleSignUp} />

            {error && <p className="text-red-500 text-center text-sm">{error}</p>}

            <BackButton onClick={handleBackToRoleSelect} />
            <AuthFooter
              label="Already have an account?"
              linkText="Sign In"
              redirectTo="/auth/signin"
            />
          </div>
        </>
      )}
    </AuthCard>
  );
}
