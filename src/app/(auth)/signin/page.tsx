"use client"
import { Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { SignIn } from '@/data-access/auth';
import { useAuthStore } from '@/lib/zustand/AuthStore';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (formData: FormData) => {
    const { error, success } = await SignIn(formData);
    if (error) {
      setError(error.message);
    }
    if (success) {
      useAuthStore.getState().init();
      setSuccess(true);
    }
  };

  return (
    <AuroraBackground>
      <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/10 dark:bg-zinc-900/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/10">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="p-3 bg-blue-600/20 dark:bg-blue-500/20 rounded-full">
                  <Music className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
            <form action={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-600 rounded bg-white/50 dark:bg-zinc-800/50"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-900 dark:text-zinc-100">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                Sign in
              </Button>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              {success && <p className="text-green-400 text-sm text-center">Sign in successful</p>}
            </form>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
