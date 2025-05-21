'use client';

import Link from 'next/link';
import { Music, Mic } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function HomePage() {
  return (
    <AuroraBackground>
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-blue-600/20 dark:bg-blue-500/20 rounded-full">
                <Music className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Karokini
              </h1>
              <p className="text-base text-zinc-600 dark:text-zinc-300">
                Sing along with your favorite songs. Upload, record, and enjoy.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-row gap-3 w-full">
            <Link href="/recorder" className="w-full">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Mic className="h-5 w-5 mr-2" />
                Start Singing
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button variant="outline" size="lg" className="w-full bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
