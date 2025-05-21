// AudioFiles.tsx
"use client";
import { useState } from 'react';
import { Play, Pause, Music, Volume2, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';

interface AudioFile {
  signedUrl: string;
  path: string;
}

export default function AudioFiles({ signedUrls }: { signedUrls: AudioFile[] }) {

  const audioFiles = signedUrls;
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlay = (url: string) => {
    if (currentlyPlaying === url) {
      audioElement?.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioElement) audioElement.pause();
      const audio = new Audio(url);
      audio.play();
      setAudioElement(audio);
      setCurrentlyPlaying(url);
      audio.onended = () => setCurrentlyPlaying(null);
    }
  };

  const formatFileName = (path: string) => {
    const fileName = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
    return fileName.replace(/_/g, ' ');
  };

  const getFormattedDate = (path: string) => {
    const dateMatch = path.match(/(\d{4}-\d{2}-\d{2})|(\d{2}-\d{2}-\d{4})/);
    if (dateMatch) return dateMatch[0];
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (audioFiles.length === 0) {
    return (
      <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <div className="flex flex-col items-center justify-center h-48">
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
            <Music className="h-12 w-12 text-zinc-400" />
          </div>
          <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-100 mb-2">No recordings yet</h3>
          <p className="text-zinc-500 max-w-sm">Your audio recordings will appear here once you create them.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-auto">
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-white flex items-center">
          <Volume2 className="mr-2 h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          Your Recordings
          <span className="ml-3 text-sm font-normal text-zinc-500 dark:text-zinc-400">
            {audioFiles.length} {audioFiles.length === 1 ? 'file' : 'files'}
          </span>
        </h2>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {audioFiles.map((file) => (
          <div key={file.path} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <Button
                variant={currentlyPlaying === file.signedUrl ? "primary" : "secondary"}
                onClick={() => handlePlay(file.signedUrl)}
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  currentlyPlaying === file.signedUrl ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-zinc-200 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                {currentlyPlaying === file.signedUrl ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 dark:text-white truncate">{formatFileName(file.path)}</p>
                <div className="flex items-center mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{getFormattedDate(file.path)}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-zinc-500 auto sm:block">
              {currentlyPlaying === file.signedUrl ? (
                <span className="text-blue-600 dark:text-blue-400 font-medium flex items-center">
                  <span className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full mr-1.5 animate-pulse"></span>
                  Playing
                </span>
              ) : (
                <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800">Audio</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}