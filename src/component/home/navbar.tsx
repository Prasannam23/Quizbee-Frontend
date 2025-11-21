'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/userAuthStore';
import LoadingSpinner from '@/component/ui/loading-spinner';
import { ModeToggle } from '@/components/ui/themeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [{ name: 'Home', path: '/' }];

    if (user) {
      if (user.role === 'TEACHER') {
        baseItems.push({ name: 'Dashboard', path: '/dashboard' });
      } else if (user.role === 'STUDENT') {
        baseItems.push({ name: 'Dashboard', path: '/student' });
      }
    }

    baseItems.push(
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' }
    );

    return baseItems;
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      router.push('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };


  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed z-20 w-full px-4 sm:px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm" onClick={() => { console.log(user) }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold text-black dark:text-white">
          ScoreBee<span className="text-yellow-500">🐝</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {getNavItems().map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-sm font-medium transition-colors ${pathname === item.path
                ? 'text-black dark:text-white underline'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
            >
              {item.name}
            </Link>
          ))}

          {loading ? (
            <LoadingSpinner size="sm" className="text-gray-600 dark:text-gray-400" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">
                    {user.firstName?.[0] || user.email[0]?.toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block">{user.firstName || user.email.split('@')[0]}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                </svg>
              </button>


              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium">{user.firstName || user.email.split('@')[0]}</p>
                    <p className="text-xs">{user.role}</p>
                  </div>
                  <Link
                    href={user.role === 'TEACHER' ? '/dashboard' : '/student'}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
          <ModeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-3">
          {loading ? (
            <LoadingSpinner size="sm" className="text-gray-600 dark:text-gray-400" />
          ) : user && (
            <div className="flex items-center space-x-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white p-2"
            aria-label="Toggle mobile menu"
          >
            <svg
              className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-lg lg:hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                {getNavItems().map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={handleNavClick}
                    className={`block py-2 px-3 rounded-md text-base font-medium transition-colors ${pathname === item.path
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* User Section */}
              {user ? (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>

                  <Link
                    href={user.role === 'TEACHER' ? '/dashboard' : '/student'}
                    onClick={handleNavClick}
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 px-3 rounded-md text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <Link
                    href="/auth/signin"
                    onClick={handleNavClick}
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={handleNavClick}
                    className="block py-2 px-3 rounded-md text-base font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
