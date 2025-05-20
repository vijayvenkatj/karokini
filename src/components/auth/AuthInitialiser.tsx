'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/zustand/AuthStore';

export function AuthInitializer() {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init(); // Runs on client
  }, [init]);

  return null;
}
