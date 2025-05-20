import { Music } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function SignUpPage() {
  return (
    <div className="min-h-screen text-zinc-800 flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <div className="flex justify-center">
            <Music className="h-12 w-12 text-zinc-800" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-zinc-900">Create your account</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-zinc-800 hover:text-zinc-100 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-800">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-zinc-900 placeholder-zinc-500"
              />
            </div>
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
                className="mt-1 block w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-zinc-900 placeholder-zinc-500"
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
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-zinc-900 placeholder-zinc-500"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-zinc-800">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 text-zinc-900 placeholder-zinc-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-zinc-600 focus:ring-zinc-500 border-zinc-700 rounded bg-zinc-800/50"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-zinc-400">
              I agree to the{' '}
              <a href="#" className="font-medium text-zinc-800 hover:text-zinc-100 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-zinc-800 hover:text-zinc-100 transition-colors">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100" size="lg">
            Create account
          </Button>
        </form>
      </div>
    </div>
  );
} 