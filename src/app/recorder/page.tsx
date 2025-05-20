"use client";

import { Recorder } from "@/components/audio-player/Recorder";
import { Music } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function RecorderPage() {
  return (
    <AuroraBackground>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-3xl p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <Music className="h-16 w-16 text-black dark:text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
              Voice Recorder
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Easily record your vocals or instruments right in the browser.
            </p>
          </div>

          {/* Recorder */}
          <div className="flex justify-center mb-8">
            <Recorder />
          </div>

          {/* Tips Section */}
          <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
            <h2 className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Recording Tips
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-2 max-w-md mx-auto text-left">
              <li>Use headphones to avoid feedback and improve clarity.</li>
              <li>Maintain a consistent distance from your microphone.</li>
              <li>Find a quiet room to minimize background noise.</li>
              <li>Check your mic settings before starting your session.</li>
            </ul>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}

