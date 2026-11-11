'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { KeyboardEvent, SyntheticEvent, TouchEvent } from 'react';
import type { YouTubeVideo } from '../../types/video';
import styles from './Hero.module.css';

interface HeroProps {
  videos: YouTubeVideo[];
}

type EpisodeImageProps = {
  video: YouTubeVideo;
  variant: 'feature' | 'thumbnail';
  preload?: boolean;
};

const channelUrl = 'https://youtube.com/@AyadElMoghy';

function EpisodeImage({ video, variant, preload = false }: EpisodeImageProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [unavailable, setUnavailable] = useState(false);
  const sources = variant === 'feature'
    ? [
        video.thumbnailUrl,
        `https://i.ytimg.com/vi/${video.id}/sddefault.jpg`,
        `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      ]
    : [
        `https://i.ytimg.com/vi/${video.id}/sddefault.jpg`,
        `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
        video.thumbnailUrl,
      ];
  const imageClassName = variant === 'feature' ? styles.featureImage : styles.thumbImage;
  const fallbackClassName = variant === 'feature' ? styles.posterFallback : styles.thumbFallback;

  const advanceSource = () => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex(sourceIndex + 1);
    } else {
      setUnavailable(true);
    }
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    // YouTube sometimes serves a tiny placeholder for a missing max resolution image.
    if (event.currentTarget.naturalWidth < 400) {
      if (sourceIndex < sources.length - 1) advanceSource();
      else setUnavailable(true);
    }
  };

  if (unavailable) {
    return (
      <span className={fallbackClassName} role="img" aria-label={`معاينة غير متاحة: ${video.title}`}>
        معاينة الحلقة غير متاحة
      </span>
    );
  }

  return (
    <Image
      key={sources[sourceIndex]}
      src={sources[sourceIndex]}
      alt={video.title}
      fill
      unoptimized
      preload={preload}
      sizes={
        variant === 'feature'
          ? '(max-width: 900px) 100vw, (max-width: 1480px) 64vw, 940px'
          : '(max-width: 480px) 68vw, (max-width: 900px) 32vw, 18vw'
      }
      className={imageClassName}
      onError={advanceSource}
      onLoad={handleLoad}
    />
  );
}

export function Hero({ videos }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);
  const featuredVideo = videos[activeIndex];

  const goToSlide = (nextIndex: number) => {
    if (!videos.length) return;

    const index = (nextIndex + videos.length) % videos.length;
    setActiveIndex(index);
    requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      thumbnailRefs.current[index]?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    });
  };

  const goToNext = () => goToSlide(activeIndex + 1);
  const goToPrevious = () => goToSlide(activeIndex - 1);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;

    const distance = endX - touchStartX.current;
    touchStartX.current = null;

    if (distance < -45) goToNext();
    if (distance > 45) goToPrevious();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToNext();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToPrevious();
    }
  };

  return (
    <section id="home" className={styles.heroSection} dir="rtl">
      <div className={styles.heroShell}>
        {featuredVideo ? (
          <>
            <div className={styles.featuredGrid}>
              <aside className={styles.details}>
                <h1 className={styles.showTitle}>إياد الموجي</h1>
                <p className={styles.showLabel}>السبت الممتاز | نجم الجيل | مع ويجز | THE GOATS</p>
                <h2 className={styles.episodeTitle} aria-live="polite" key={featuredVideo.id}>
                  {featuredVideo.title}
                </h2>
                <p className={styles.schedule}>حلقة جديدة كل سبت.</p>
                <a
                  className={styles.watchLink}
                  href={featuredVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6 4.8c0-.8.9-1.3 1.6-.9l8.2 4.8a1.5 1.5 0 0 1 0 2.6l-8.2 4.8c-.7.4-1.6-.1-1.6-.9V4.8Z" />
                  </svg>
                  شاهد الحلقة
                </a>
                <div className={styles.slideControls}>
                  <span className={styles.slideCounter} dir="ltr">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className={styles.arrowButton}
                    onClick={goToPrevious}
                    aria-label="الحلقة السابقة"
                    disabled={videos.length < 2}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={styles.arrowButton}
                    onClick={goToNext}
                    aria-label="الحلقة التالية"
                    disabled={videos.length < 2}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m15 5-7 7 7 7" />
                    </svg>
                  </button>
                </div>
              </aside>

              <div
                className={styles.artwork}
                role="group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                aria-label={`صورة الحلقة: ${featuredVideo.title}`}
              >
                <EpisodeImage key={featuredVideo.id} video={featuredVideo} variant="feature" preload />
              </div>
            </div>

            <section
              id="episodes"
              className={styles.episodeRailSection}
              aria-label="اختيار حلقة"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              <div className={styles.railHeader}>
                <h2 className={styles.railTitle}>أحدث الحلقات</h2>
                <span className={styles.railHint}>اختار حلقتك</span>
              </div>
              <div className={styles.episodeRail}>
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    ref={(element) => { thumbnailRefs.current[index] = element; }}
                    type="button"
                    className={`${styles.episodeButton} ${index === activeIndex ? styles.activeEpisode : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    aria-label={`عرض الحلقة ${index + 1}: ${video.title}`}
                  >
                    <span className={styles.thumbFrame}>
                      <EpisodeImage video={video} variant="thumbnail" />
                    </span>
                    <span className={styles.thumbTitle}>{video.title}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>الحلقات مش متاحة دلوقتي.</p>
            <a href={channelUrl} target="_blank" rel="noopener noreferrer">
              زور قناة إياد الموجي
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
