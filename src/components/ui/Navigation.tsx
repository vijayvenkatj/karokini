'use client';
import Link from 'next/link';
import { Music, Home } from 'lucide-react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/zustand/AuthStore';
import { createClient } from '@/utils/supabase/client';

export function Navigation() {
  const user = useAuthStore((state) => state.user); // stable
  const router = useRouter();
  const supabase = createClient();

  const handleClick = async () => {
    if (user) {
      await supabase.auth.signOut();
      router.push('/');
    } else {
      router.push('/signin');
    }
  };

  return (
    <nav className="bg-white shadow-sn text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Karaoke App</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                <Home className="h-5 w-5 mr-1" />
                Home
              </Link>
              <Link href="/player" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900">
                <Music className="h-5 w-5 mr-1" />
                Player
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="ghost" size="sm" onClick={handleClick}>
              {user ? 'Sign Out' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
