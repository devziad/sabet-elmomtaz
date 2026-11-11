'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './AnnouncementSection.module.css';
import { AnnouncementVideo } from './AnnouncementVideo';
import { AnnouncementSoundButton } from './AnnouncementSoundButton';

const VIDEO_ID = '2MmiyLfuewA';

export function AnnouncementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Always start muted per browser policy

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        // Trigger when at least 30% of the video section is visible
        threshold: 0.3,
      }
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const toggleMute = () => setIsMuted((muted) => !muted);

  return (
    <section id="announcement" className={styles.announcementSection} ref={sectionRef}>
      <div className={styles.contentContainer}>
        {/* Eyebrow & Headline */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>
            <span className={styles.recordingDot} />
            Season Premiere
          </span>
          <h2 className={styles.headline}>
            A NEW SEASON AWAITS
          </h2>
        </div>

        {/* Video Player Container */}
        <div className={styles.videoWrapper}>
          <AnnouncementVideo
            videoId={VIDEO_ID}
            isVisible={isVisible}
            isMuted={isMuted}
          />

          <div className={styles.soundButtonContainer}>
            <AnnouncementSoundButton isMuted={isMuted} onToggle={toggleMute} />
          </div>
        </div>
      </div>

      {/* Transition to next section */}
      <div className={styles.bottomTransition} />
    </section>
  );
}
