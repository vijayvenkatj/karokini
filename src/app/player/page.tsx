'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/player/FileUpload';
import { LyricsDisplay } from '@/components/player/LyricsDisplay';
import { Howl } from 'howler';

interface FileState {
  mp3?: File;
  lrc?: File;
}

export default function PlayerPage() {
  const [files, setFiles] = useState<FileState>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const [lyrics, setLyrics] = useState<Array<{ time: number; text: string }>>([]);
  const rafRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const resetPlayer = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setFiles({});
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setLyrics([]);
    setError(null);
  };

  const handleFileSelect = async (newFiles: FileState) => {
    try {
      setIsLoading(true);
      setError(null);

      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }

      setFiles(newFiles);

      if (newFiles.mp3) {
        const audioUrl = URL.createObjectURL(newFiles.mp3);
        audioUrlRef.current = audioUrl;

        const sound = new Howl({
          src: [audioUrl],
          html5: true,
          preload: true,
          format: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
          onload: () => {
            setDuration(sound.duration());
            setIsLoading(false);
            setError(null);
          },
          onloaderror: (id, error) => {
            console.error('Audio loading error:', error);
            let errorMessage = 'Failed to load audio file. ';

            if (error === 'No codec support for selected audio sources.') {
              errorMessage += 'The audio format is not supported. Please try converting your file to MP3 format.';
            } else if (error === 'Audio file not found.') {
              errorMessage += 'The audio file could not be found.';
            } else if (error === 'Audio file could not be decoded.') {
              errorMessage += 'The audio file is corrupted or in an unsupported format.';
            } else {
              errorMessage += 'Please try a different file.';
            }

            setError(errorMessage);
            setIsLoading(false);
            if (soundRef.current) {
              soundRef.current.unload();
            }
          },
          onplayerror: (id, error) => {
            console.error('Audio playback error:', error);
            setError('Failed to play audio. Please try again.');
            setIsPlaying(false);
          },
          onplay: () => {
            setIsPlaying(true);
            setError(null);
          },
          onpause: () => {
            setIsPlaying(false);
          },
          onstop: () => {
            setIsPlaying(false);
            setCurrentTime(0);
          },
          onend: () => {
            setIsPlaying(false);
            setCurrentTime(0);
          }
        });

        soundRef.current = sound;
      }

      if (newFiles.lrc) {
        try {
          const text = await newFiles.lrc.text();
          const parsedLyrics = parseLRC(text);
          if (parsedLyrics.length === 0) {
            setError('No valid lyrics found in the LRC file');
          } else {
            setLyrics(parsedLyrics);
          }
        } catch (err) {
          console.error('Lyrics parsing error:', err);
          setError('Failed to read lyrics file');
        }
      }
    } catch (err) {
      console.error('File processing error:', err);
      setError('An error occurred while processing files');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = () => {
    if (soundRef.current && isPlaying) {
      const currentSeek = soundRef.current.seek();
      if (typeof currentSeek === 'number') {
        setCurrentTime(currentSeek);
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const parseLRC = (text: string) => {
    const lines = text.split('\n');
    const lyrics: Array<{ time: number; text: string }> = [];

    lines.forEach((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
      if (match) {
        const [, min, sec, ms, text] = match;
        const time = parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 100;
        lyrics.push({ time, text: text.trim() });
      }
    });

    return lyrics.sort((a, b) => a.time - b.time);
  };

  const togglePlay = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      } else {
        soundRef.current.play();
        updateProgress();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const toggleMute = () => {
    if (soundRef.current) {
      const newMuted = !isMuted;
      soundRef.current.mute(newMuted);
      setIsMuted(newMuted);
    }
  };

  const seek = (time: number) => {
    if (soundRef.current) {
      const seekTime = Math.max(0, Math.min(time, duration));
      soundRef.current.seek(seekTime);
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && soundRef.current) {
      intervalId = setInterval(() => {
        const currentSeek = soundRef.current?.seek();
        if (typeof currentSeek === 'number') {
          setCurrentTime(currentSeek);
        }
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, duration]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900  flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6">
        {!files.mp3 || !files.lrc ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <div className="space-y-8">
            {error && (
              <div className="text-sm text-red-700 border-b border-red-200 pb-2">
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => seek(Math.max(0, currentTime - 5))} disabled={isLoading} className="text-gray-700 hover:text-black p-1">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button variant="primary" size="lg" onClick={togglePlay} disabled={isLoading} className="bg-zinc-900  text-white hover:bg-gray-800 p-2">
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => seek(Math.min(duration, currentTime + 5))} disabled={isLoading} className="text-gray-700 hover:text-black p-1">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={toggleMute} disabled={isLoading} className="text-gray-700 hover:text-black p-1">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-16 accent-black" disabled={isLoading} />
                  <Button variant="ghost" size="sm" onClick={resetPlayer} disabled={isLoading} className="text-gray-700 hover:text-black p-1">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 w-10">{formatTime(currentTime)}</span>
                <div className="flex-1 h-px bg-gray-100">
                  <div className="h-full bg-zinc-900  transition-all duration-100" style={{ width: `${(currentTime / duration) * 100}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-10">{formatTime(duration)}</span>
              </div>
            </div>
            <LyricsDisplay lyrics={lyrics} currentTime={currentTime} />
          </div>
        )}
      </div>
    </div>
  );
}
