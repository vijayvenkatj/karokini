import { Recorder } from "@/components/audio-player/Recorder";
import { Headphones, Mic, Volume2 } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import AudioFiles from "@/components/audio-player/AudioFiles";
import { getUserAudio } from "@/data-access/recorder";
import { Suspense } from "react";

interface AudioFile {
  signedUrl: string;
  path: string;
}

export default async function RecorderPage() {
  const audioFiles = await getUserAudio() as { success: boolean, error?: string, signedUrls?: AudioFile[] }

  
  return (
    <AuroraBackground>
      <div className="min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-8 px-4 lg:pt-28 lg:pb-12">
        {/* Main Container */}
        <div className="w-full max-w-[1400px] flex flex-col gap-6 lg:gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Recorder Section */}
            <div className="lg:col-span-2 w-full bg-white/10 dark:bg-zinc-900/40 backdrop-blur-lg rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-600/20 dark:bg-blue-500/20 rounded-full">
                    <Mic className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Voice Recorder
                </h1>
                <p className="mt-3 text-base text-zinc-600 dark:text-zinc-300 max-w-md mx-auto">
                  Easily record your vocals or instruments right in the browser.
                </p>
              </div>

              {/* Recorder */}
              <div className="flex justify-center mb-10">
                <Recorder />
              </div>

              {/* Tips Section */}
              <div className="mt-8 pt-6 border-t border-zinc-200/30 dark:border-zinc-700/30">
                <h2 className="flex items-center justify-center text-zinc-800 dark:text-zinc-200 font-medium mb-4">
                  <Headphones className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Recording Tips</span>
                </h2>
                <div className="bg-white/20 dark:bg-zinc-800/20 rounded-xl p-4">
                  <ul className="list-none text-sm text-zinc-600 dark:text-zinc-300 space-y-3 max-w-md mx-auto">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs mr-3 flex-shrink-0">1</span>
                      <span>Use headphones to avoid feedback and improve clarity.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs mr-3 flex-shrink-0">2</span>
                      <span>Maintain a consistent distance from your microphone.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs mr-3 flex-shrink-0">3</span>
                      <span>Find a quiet room to minimize background noise.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs mr-3 flex-shrink-0">4</span>
                      <span>Check your mic settings before starting your session.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Audio Files Section */}
            <div className="w-full lg:col-span-1 bg-white/5 dark:bg-zinc-900/30 backdrop-blur-lg border border-zinc-300/30 dark:border-zinc-700/30 rounded-3xl p-4 lg:p-6">
              <div className="flex items-center mb-5 pb-3 border-b border-zinc-200/20 dark:border-zinc-800/50">
                <Volume2 className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Your Recordings</h2>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
                <Suspense fallback={
                  <div className="p-8 text-center text-zinc-400 flex flex-col items-center justify-center h-64">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-3 w-3 bg-zinc-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-zinc-300 rounded-full"></div>
                    <div className="h-3 w-3 bg-zinc-300 rounded-full"></div>
                    </div>
                    <p className="mt-4">Loading your recordings...</p>
                  </div>
                }>
                  <AudioFiles signedUrls={audioFiles.signedUrls || []}/>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
