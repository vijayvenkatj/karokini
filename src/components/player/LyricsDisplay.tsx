import { useEffect, useRef, useState } from 'react';

interface LyricsLine {
  time: number;
  text: string;
}

interface LyricsDisplayProps {
  lyrics: LyricsLine[];
  currentTime: number;
}

export function LyricsDisplay({
  lyrics,
  currentTime,
}: LyricsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prevIndex, setPrevIndex] = useState(-1);
  
  // Find current line index
  const currentIndex = lyrics.findIndex((line) => line.time > currentTime) - 1;
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  
  // Get the subset of lyrics to display (5 before and 5 after current line)
  const visibleLines = lyrics.slice(
    Math.max(0, activeIndex - 5),
    Math.min(lyrics.length, activeIndex + 6)
  );

  // Calculate offset to know which line in visibleLines is current
  const currentVisibleIndex = activeIndex - Math.max(0, activeIndex - 5);

  // Scroll to center when active line changes
  useEffect(() => {
    if (containerRef.current && prevIndex !== activeIndex) {
      setPrevIndex(activeIndex);
      
      const children = containerRef.current.children;
      if (children[currentVisibleIndex]) {
        children[currentVisibleIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activeIndex, currentVisibleIndex, prevIndex]);

  // Calculate progress percentage for active line highlighting
  const getProgressPercentage = () => {
    if (activeIndex >= lyrics.length - 1) return 100;
    
    const currentLine = lyrics[activeIndex];
    const nextLine = lyrics[activeIndex + 1];
    
    const lineDuration = nextLine.time - currentLine.time;
    const elapsed = currentTime - currentLine.time;
    
    return Math.min(100, Math.max(0, (elapsed / lineDuration) * 100));
  };

  const progressPercentage = getProgressPercentage();

  if(lyrics.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative p-8 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {/* Title bar */}
          <div className="mb-6 relative">
            <h2 className="text-zinc-900 dark:text-white text-xl font-bold text-center">Now Playing</h2>
            <div className="h-px w-16 bg-blue-600/30 dark:bg-blue-500/30 rounded-full mx-auto mt-2"></div>
          </div>
          
          {/* Lyrics container */}
          <div 
            ref={containerRef}
            className="relative h-96 overflow-hidden py-20"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 h-1/3 w-full bg-gradient-to-b from-white/10 dark:from-zinc-900/40 to-transparent z-10"></div>
              <div className="absolute bottom-0 h-1/3 w-full bg-gradient-to-t from-white/10 dark:from-zinc-900/40 to-transparent z-10"></div>
            </div>
            <div className="text-zinc-600 dark:text-zinc-400 text-center">No lyrics found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative p-8 bg-white/10 dark:bg-zinc-900/40 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        {/* Title bar */}
        <div className="mb-6 relative">
          <h2 className="text-zinc-900 dark:text-white text-xl font-bold text-center">Now Playing</h2>
          <div className="h-px w-16 bg-blue-600/30 dark:bg-blue-500/30 rounded-full mx-auto mt-2"></div>
        </div>
        
        {/* Lyrics container */}
        <div 
          ref={containerRef}
          className="relative h-96 overflow-hidden py-20"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 h-1/3 w-full bg-gradient-to-b from-white/10 dark:from-zinc-900/40 to-transparent z-10"></div>
            <div className="absolute bottom-0 h-1/3 w-full bg-gradient-to-t from-white/10 dark:from-zinc-900/40 to-transparent z-10"></div>
          </div>

          {visibleLines.map((line, index) => {
            const isActive = index === currentVisibleIndex;
            
            return (
              <div
                key={line.time}
                className={`transition-all duration-300 ease-out py-3 text-center ${
                  isActive 
                    ? 'text-2xl font-bold' 
                    : index === currentVisibleIndex - 1 || index === currentVisibleIndex + 1
                      ? 'text-xl opacity-60' 
                      : 'text-lg opacity-40'
                }`}
              >
                {isActive ? (
                  <div className="relative">
                    <span className="text-zinc-900 dark:text-white">{line.text}</span>
                    <div className="relative overflow-hidden mt-1">
                      <div className="h-px w-full bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
                      <div 
                        className="absolute top-0 left-0 h-px bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-200 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <span className="text-zinc-600 dark:text-zinc-400">{line.text}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}