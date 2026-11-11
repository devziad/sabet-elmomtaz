'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Lalezar, Oswald } from 'next/font/google';
import styles from './CharacterStrip.module.css';

// Load the exact premium bold Arabic and English fonts
const arabicFont = Lalezar({
  weight: '400',
  subsets: ['arabic'],
  display: 'swap',
});

const englishFont = Oswald({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export function CharacterStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.2 }
    );

    if (stripRef.current) {
      observer.observe(stripRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={styles.sectionWrapper}>
      <div
        ref={stripRef}
        className={`${styles.strip} ${isVisible ? styles.visible : ''}`}
      >
        <div className={styles.content}>

          <div className={styles.textContainer}>
            <div className={styles.titleRow}>
              <h3 className={`${styles.englishTitle} ${englishFont.className}`}>
                EYAD EL MOGHAY
              </h3>

              <div className={styles.separator} />

              <h2 className={`${styles.arabicTitle} ${arabicFont.className}`} dir="rtl">
                الشخصية الأكثر إبهارًا
              </h2>
            </div>

            <p className={`${styles.bioText} ${arabicFont.className}`} dir="rtl">
              مقدم البرنامج الترفيهي الأبرز في الوطن العربي <strong>&ldquo;السبت الممتاز&rdquo;</strong> —
              رؤية نقدية ساخرة، حضور سينمائي يخطف الأنظار، وأسلوب متفرد يعيد صياغة
              مفهوم الترفيه الرقمي ليقدم تجربة لا تُنسى.
            </p>
          </div>

          <div className={styles.photoContainer}>
            {/* Using the real image from public/eyad-photo */}
            <div className={styles.photoWrapper}>
              <Image
                src="/eyad-photo/eyad.jpg"
                alt="Eyad El-Moghy"
                fill
                className={styles.eyadImage}
                sizes="(max-width: 768px) 150px, 200px"
                loading="lazy"
                unoptimized
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
