'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './NavBar.module.css';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Episodes', href: '/episodes' },
  { name: 'Team', href: '/team' },
  { name: 'Contact', href: '/contact' },
];

const menuItems = navItems;

export function NavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = navRef.current?.querySelector(`.${styles.active}`) as HTMLElement | null;
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1,
      });
    } else {
      setIndicatorStyle((previous) => ({ ...previous, opacity: 0 }));
    }
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [isMenuOpen]);

  const selectLink = () => {
    setIsMenuOpen(false);
  };

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <Link href="/" className={styles.logoLink} aria-label="Saturday Al-Momtaz — Home">
        <Image
          src="/logo/logo.svg"
          alt="Saturday Al-Momtaz"
          width={1824}
          height={2188}
          className={styles.logo}
          priority
        />
      </Link>

      <div className={styles.navbarWrapper}>
        <nav ref={navRef} className={styles.navbar} aria-label="Main navigation" dir="ltr">
          <div className={styles.center}>
            <div
              className={styles.indicator}
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={selectLink}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className={styles.right}>
            <a
              href="https://youtube.com/@AyadElMoghy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              Subscribe
            </a>
          </div>
        </nav>
      </div>

      <button
        type="button"
        className={`${styles.menuToggle} ${isMenuOpen ? styles.menuToggleOpen : ''}`}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        aria-controls="site-navigation-menu"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      {isMenuOpen && (
        <nav id="site-navigation-menu" className={styles.menuPanel} aria-label="All site pages" dir="ltr">
          <div className={styles.menuHeading}>
            <span className={styles.menuEyebrow}>SATURDAY AL-MOMTAZ</span>
            <p>Explore the site</p>
          </div>
          <div className={styles.menuLinks}>
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.menuLink}
                onClick={selectLink}
              >
                <span className={styles.menuIndex} dir="ltr">{String(index + 1).padStart(2, '0')}</span>
                <span>{item.name}</span>
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M4 10h11M10 5l5 5-5 5" />
                </svg>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
