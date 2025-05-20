'use client';

import Link from 'next/link';
import { Music, Mic } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';
import { Recorder } from '@/components/audio-player/Recorder';

export default function HomePage() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-8 items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center"
        >
          <Music className="h-24 w-24 text-black dark:text-white" />
          <Recorder />
        </motion.div>

        <div className="text-center space-y-4 z-30">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
            <span className="block text-black dark:text-white">Sing Your Heart Out</span>
            <span className="block text-gray-600 dark:text-gray-300">With Karaoke</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-gray-600 dark:text-gray-300">
            Upload your favorite songs and lyrics, then sing along with our beautiful karaoke player.
            Perfect for practice, fun, or just enjoying your favorite tunes.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center gap-4"
        >
          <Link href="/player">
            <Button size="lg" className="bg-black z-30 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100">
              <Mic className="h-5 w-5 mr-2" />
              Start Singing
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg" className="border-black z-30 dark:border-white text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10">
              Create Account
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </AuroraBackground>
  );
}
