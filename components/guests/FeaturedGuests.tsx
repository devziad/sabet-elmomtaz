'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import styles from './FeaturedGuests.module.css';

interface FeaturedGuest {
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  episodeTitle: string;
  episodeUrl: string;
}

// Add a guest here only after matching their portrait to an episode on the official channel.
const FEATURED_GUESTS: FeaturedGuest[] = [
  {
    id: 'wegz',
    name: 'ويجز',
    image: '/best/wegz.webp',
    imageAlt: 'إياد الموجي مع ويجز',
    episodeTitle: 'السبت الممتاز | نجم الجيل | مع ويجز | THE GOATS',
    episodeUrl: 'https://www.youtube.com/watch?v=dkeu6gi3mAc',
  },
  {
    id: 'ahmed-saad',
    name: 'أحمد سعد',
    image: '/best/ahmed-saad.webp',
    imageAlt: 'إياد الموجي مع أحمد سعد',
    episodeTitle: 'السبت الممتاز | حلقة السعد | مع أحمد سعد | HAHAHAHH',
    episodeUrl: 'https://www.youtube.com/watch?v=92so3DF4oLM',
  },
  {
    id: 'amr-youssef',
    name: 'عمرو يوسف',
    image: '/best/amr-youssef.webp',
    imageAlt: 'إياد الموجي مع عمرو يوسف',
    episodeTitle: 'السبت الممتاز | العلاقات العاطفية | مع عمرو يوسف | Relationships',
    episodeUrl: 'https://www.youtube.com/watch?v=W_CllX6PAYM',
  },
  {
    id: 'ahmed-malek',
    name: 'أحمد مالك',
    image: '/best/ahmed-malik.webp',
    imageAlt: 'إياد الموجي مع أحمد مالك',
    episodeTitle: 'السبت الممتاز | الانترنت زمان | مع أحمد مالك | Egyptian Nostalgia',
    episodeUrl: 'https://www.youtube.com/watch?v=MjMO-px4Ww4',
  },
];

type CardPosition = 'active' | 'next' | 'previous' | 'far';

function getCardPosition(index: number, activeIndex: number): CardPosition {
  const relativeIndex = (index - activeIndex + FEATURED_GUESTS.length) % FEATURED_GUESTS.length;
  if (relativeIndex === 0) return 'active';
  if (relativeIndex === 1) return 'next';
  if (relativeIndex === FEATURED_GUESTS.length - 1) return 'previous';
  return 'far';
}

export function FeaturedGuests() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartRef = useRef<{ x: number; pointerId: number } | null>(null);
  const suppressClickRef = useRef(false);
  const activeGuest = FEATURED_GUESTS[activeIndex];

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + FEATURED_GUESTS.length) % FEATURED_GUESTS.length);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(-1);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    pointerStartRef.current = { x: event.clientX, pointerId: event.pointerId };
    suppressClickRef.current = false;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start || start.pointerId !== event.pointerId) return;

    const distance = event.clientX - start.x;
    if (Math.abs(distance) < 48) return;

    suppressClickRef.current = true;
    move(distance < 0 ? 1 : -1);
  };

  return (
    <section id="featured-guests" className={styles.section} aria-labelledby="featured-guests-title" dir="rtl">
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}><span aria-hidden="true" /> وجوه من السبت الممتاز</p>
            <h2 id="featured-guests-title" className={styles.title}>أبرز ضيوفنا</h2>
            <p className={styles.description}>كل ضيف له حكاية… اختار وجهتك وشوف الحلقة.</p>
          </div>
          <p className={styles.headingNote} aria-hidden="true">حكايات<br />تفضل في البال</p>
        </div>

        <div
          className={styles.stage}
          role="region"
          aria-roledescription="عارض ثلاثي الأبعاد للضيوف"
          aria-label="أبرز ضيوف السبت الممتاز"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStartRef.current = null; }}
          onClickCapture={(event) => {
            if (!suppressClickRef.current) return;
            event.preventDefault();
            event.stopPropagation();
            suppressClickRef.current = false;
          }}
        >
          <div className={styles.stageWord} aria-hidden="true">السبت الممتاز</div>

          {FEATURED_GUESTS.map((guest, index) => {
            const position = getCardPosition(index, activeIndex);
            const isActive = position === 'active';

            return (
              <button
                key={guest.id}
                type="button"
                className={`${styles.card} ${styles[position]}`}
                aria-label={isActive ? `${guest.name}، الضيف المختار` : `اعرض ${guest.name}`}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={guest.image}
                  alt={guest.imageAlt}
                  fill
                  loading="lazy"
                  unoptimized
                  sizes="(max-width: 680px) 76vw, (max-width: 1024px) 31vw, 350px"
                  className={styles.portrait}
                  draggable={false}
                />
                <span className={styles.imageShade} aria-hidden="true" />
                <span className={styles.cardTopline} aria-hidden="true">
                  <span>ضيف مميز</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </span>
                <span className={styles.cardCopy}>
                  <span className={styles.cardLabel}>من ضيوف البرنامج</span>
                  <span className={styles.guestName}>{guest.name}</span>
                </span>
                <span className={styles.cardEdge} aria-hidden="true" />
              </button>
            );
          })}

          <button className={`${styles.arrow} ${styles.previousArrow}`} type="button" aria-label="الضيف السابق" onClick={() => move(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button className={`${styles.arrow} ${styles.nextArrow}`} type="button" aria-label="الضيف التالي" onClick={() => move(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>

        <div className={styles.infoRow}>
          <div className={styles.activeInfo} aria-live="polite" aria-atomic="true">
            <span className={styles.activeLabel}>الضيف المختار</span>
            <strong className={styles.activeName}>{activeGuest.name}</strong>
          </div>
          <div className={styles.navigation} aria-label="اختيار ضيف">
            <button className={styles.mobilePrevious} type="button" aria-label="الضيف السابق" onClick={() => move(-1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <div className={styles.pagination}>
              <span className={styles.currentNumber}>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / FEATURED_GUESTS.length) * 100}%` }} /></span>
              <span className={styles.totalNumber}>{String(FEATURED_GUESTS.length).padStart(2, '0')}</span>
            </div>
            <button className={styles.mobileNext} type="button" aria-label="الضيف التالي" onClick={() => move(1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
          <a
            className={styles.watchLink}
            href={activeGuest.episodeUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`شاهد حلقة ${activeGuest.name}: ${activeGuest.episodeTitle}`}
          >
            <span>شاهد الحلقة</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </a>
        </div>
        <p className={styles.swipeHint}>اسحب الصورة أو استخدم الأسهم لاكتشاف الضيوف</p>
      </div>
    </section>
  );
}
