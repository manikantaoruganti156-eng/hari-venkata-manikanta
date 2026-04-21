import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SONGS, Song } from '../constants';

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentSong = SONGS[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const skipForward = () => {
    setCurrentSongIndex((prev) => (prev + 1) % SONGS.length);
  };

  const skipBackward = () => {
    setCurrentSongIndex((prev) => (prev - 1 + SONGS.length) % SONGS.length);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <div className="w-full max-w-md bg-black/60 backdrop-blur-xl p-6 neon-border-magenta rounded-2xl flex flex-col gap-4">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-4">
        <motion.div 
          key={currentSong.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 neon-border-magenta"
        >
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Music className="w-8 h-8 text-neon-magenta opacity-80" />
              </motion.div>
            </div>
          )}
        </motion.div>

        <div className="flex-grow min-w-0">
          <motion.h3 
            key={currentSong.title}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-white truncate font-sans"
          >
            {currentSong.title}
          </motion.h3>
          <motion.p 
            key={currentSong.artist}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.6, y: 0 }}
            className="text-sm text-neon-magenta truncate font-mono uppercase tracking-widest"
          >
            {currentSong.artist}
          </motion.p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute h-full bg-neon-magenta shadow-[0_0_10px_#FF00FF]"
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={skipBackward}
          className="p-2 text-white/60 hover:text-neon-magenta transition-colors hover:scale-110 active:scale-95"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 bg-white text-black rounded-full hover:bg-neon-magenta hover:text-white transition-all hover:scale-110 active:scale-90 shadow-xl"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </button>

        <button 
          onClick={skipForward}
          className="p-2 text-white/60 hover:text-neon-magenta transition-colors hover:scale-110 active:scale-95"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2 opacity-40 hover:opacity-100 transition-opacity">
        <Volume2 className="w-4 h-4 text-neon-magenta" />
        <div className="flex-grow h-1 bg-white/20 rounded-full" />
      </div>
    </div>
  );
}
