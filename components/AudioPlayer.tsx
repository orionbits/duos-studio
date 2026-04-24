"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, AlertCircle, Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AudioPlayerProps {
  audioTrack: string;
  title?: string;
}

export function AudioPlayer({ audioTrack, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const storageKey = useMemo(() => `audio-position:${audioTrack}`, [audioTrack]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioTrack) {
      return;
    }

    const savedPosition = window.localStorage.getItem(storageKey);
    if (savedPosition) {
      const parsedPosition = Number.parseFloat(savedPosition);
      if (!Number.isNaN(parsedPosition)) {
        audio.currentTime = parsedPosition;
      }
    }
  }, [audioTrack, storageKey]);

  if (!audioTrack) {
    return null;
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const src = `/audio/${audioTrack}.mp3`;

  return (
    <div className="rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-3xl shadow-xl">
      <div className="flex items-center gap-6">
        <button
          onClick={togglePlay}
          disabled={hasError}
          className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 disabled:opacity-30",
            isPlaying 
              ? "bg-teal-500 text-black shadow-[0_0_30px_rgba(20,184,166,0.4)]" 
              : "bg-white/5 text-teal-400 hover:bg-white/10"
          )}
        >
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} className="ml-1" fill="currentColor" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider truncate">
              {title || `Track ${audioTrack}`}
            </h4>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
              <Volume2 size={10} className="text-slate-500" />
              <span className="text-[10px] font-mono text-slate-400">{audioTrack}</span>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={src}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadStart={() => setIsLoading(true)}
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            onTimeUpdate={(event) => {
              window.localStorage.setItem(storageKey, String(event.currentTarget.currentTime));
            }}
            className="hidden"
          />

          {hasError ? (
            <div className="flex items-center gap-2 text-rose-400">
              <AlertCircle size={14} />
              <p className="text-[10px] font-bold uppercase tracking-widest leading-none">Resource Not Found</p>
            </div>
          ) : (
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative">
              <div 
                className={cn(
                  "absolute inset-y-0 left-0 bg-teal-500/50 transition-all duration-300",
                  isPlaying ? "animate-pulse" : ""
                )} 
                style={{ width: "30%" /* Placeholder for progress */ }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
