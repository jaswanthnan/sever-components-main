'use client';

import React, { useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Key
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const errorParam = searchParams.get('error');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(errorParam ? 'Authentication failed. Please check your credentials.' : '');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    startTransition(async () => {
      try {
        // 1. Pre-validate credentials with the API to get precise error feedback
        const validateRes = await fetch('/api/auth/login-validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const validateData = await validateRes.json();

        if (!validateRes.ok) {
          setError(validateData.message || 'Invalid username/email or password.');
          return;
        }

        // 2. Proceed to establish standard Auth.js session on success
        const result = await signIn('credentials', {
          redirect: false,
          username,
          password,
        });

        if (result?.error) {
          setError(result.error || 'Invalid username/email or password.');
        } else {
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            router.push(callbackUrl);
            router.refresh();
          }, 1000);
        }
      } catch {
        setError('Something went wrong. Please try again.');
      }
    });
  };

  const handleOAuthLogin = (provider: string) => {
    setError('');
    startTransition(async () => {
      await signIn(provider, { callbackUrl });
    });
  };

  const fillDemoCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo and header */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2.5 text-sm text-slate-400 font-medium">
            Sign in to manage your recruitment lifecycle.
          </p>
        </div>

        {/* Floating Glass Card */}
        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/5 space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-2xl flex items-start gap-3 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-2xl flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username/Email Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 pl-12 pr-4 py-4 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="admin or user@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pl-1 pr-1">
                <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 pl-12 pr-4 py-4 rounded-2xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute w-full border-t border-slate-800" />
            <span className="relative bg-slate-900 px-4 text-xs font-black uppercase tracking-widest text-slate-500">
              Or continue with
            </span>
          </div>

          {/* Social Sign-In buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleOAuthLogin('github')}
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-white py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              GitHub
            </button>
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-white py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.418 0-6.2-2.782-6.2-6.2s2.782-6.2 6.2-6.2c1.552 0 2.969.576 4.053 1.527l3.15-3.15C19.167 2.68 15.933 1.2 12.24 1.2 6.27 1.2 1.2 6.27 1.2 1.224s5.07 11.04 11.04 11.04c6.19 0 10.748-4.354 10.748-10.95 0-.696-.073-1.375-.2-2.045H12.24z"/>
              </svg>
              Google
            </button>
          </div>

          {/* Quick Demo Credentials Helper */}
          <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Key className="w-4 h-4" />
              <span>QUICK DEMO LOGINS</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin', 'password')}
                className="bg-slate-950/80 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-300 border border-slate-800/60 text-[11px] font-bold py-2 rounded-xl transition-all cursor-pointer"
              >
                Admin (Hardcoded)
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('recruiter@hiresync.com', 'password123')}
                className="bg-slate-950/80 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-300 border border-slate-800/60 text-[11px] font-bold py-2 rounded-xl transition-all cursor-pointer"
              >
                Recruiter (DB)
              </button>
            </div>
          </div>

          {/* Footer link */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 font-medium">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
