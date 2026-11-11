'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnnouncementVideoProps {
  videoId: string;
  isVisible: boolean;
  isMuted: boolean;
}

interface YouTubePlayer {
  mute(): void;
  unMute(): void;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
}

interface YouTubePlayerOptions {
  videoId: string;
  width: string;
  height: string;
  playerVars: Record<string, number>;
  events: {
    onReady: (event: { target: YouTubePlayer }) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (element: HTMLDivElement, options: YouTubePlayerOptions) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeIframeApi() {
  if (window.YT) return Promise.resolve();
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve();
      };
      script.onerror = () => {
        youtubeApiPromise = null;
        reject(new Error('Unable to load the YouTube player'));
      };
      document.head.appendChild(script);
    });
  }
  return youtubeApiPromise;
}

export function AnnouncementVideo({
  videoId,
  isVisible,
  isMuted,
}: AnnouncementVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Load the YouTube player only when this section enters the viewport.
  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;

    void loadYouTubeIframeApi().then(() => {
      const YouTube = window.YT;
      if (cancelled || playerRef.current || !containerRef.current || !YouTube) return;

      playerRef.current = new YouTube.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          mute: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            setIsPlayerReady(true);
            event.target.mute();
          },
        },
      });
    }).catch(() => {});

    return () => { cancelled = true; };
  }, [isVisible, videoId]);

  useEffect(() => () => {
    playerRef.current?.destroy();
    playerRef.current = null;
  }, []);

  // Handle visibility (play/pause)
  useEffect(() => {
    if (isPlayerReady && playerRef.current) {
      if (isVisible) {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          playerRef.current.playVideo();
        }
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isVisible, isPlayerReady]);

  // Handle mute/unmute from external prop
  useEffect(() => {
    if (isPlayerReady && playerRef.current) {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted, isPlayerReady]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
        background: 'var(--bg-primary)',
        opacity: isPlayerReady ? 1 : 0, // Show iframe as soon as it's ready
        transition: 'opacity 0.5s ease-in-out',
        zIndex: 2
      }}
    >
      {/* The div that YT API replaces with an iframe. Must not have React state attached to it. */}
      <div ref={containerRef} />
    </div>
  );
}
