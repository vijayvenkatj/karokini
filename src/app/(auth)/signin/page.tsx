"use client"
import { Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { SignIn } from '@/data-access/auth';
import { useAuthStore } from '@/lib/zustand/AuthStore';

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
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Music className="h-12 w-12 text-zinc-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-black">Welcome back</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-zinc-400 hover:text-zinc-300">
              Sign up
            </Link>
          </p>
        </div>
        <form action={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-800">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-50 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-800">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full px-3 py-2 border border-zinc-600 rounded-md bg-zinc-50 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-zinc-500 focus:border-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 border-zinc-600 rounded bg-zinc-50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-800">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-zinc-400 hover:text-zinc-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Sign in
          </Button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">Sign in successful</p>}
        </form>
      </div>
    </div>
  );
}
