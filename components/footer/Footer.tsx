import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';

const footerLinks = [
  { label: 'الرئيسية', href: '/#home' },
  { label: 'إعلان الموسم', href: '/#announcement' },
  { label: 'أبرز الضيوف', href: '/#featured-guests' },
  { label: 'عن إياد', href: '/#about' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} dir="rtl">
      <div className={styles.shell}>
        <div className={styles.mainGrid}>
          <div className={styles.brandColumn}>
            <Link href="/#home" className={styles.logoLink} aria-label="السبت الممتاز — الرئيسية">
              <Image
                src="/logo/logo.svg"
                alt="السبت الممتاز"
                width={1824}
                height={2188}
                className={styles.logo}
              />
            </Link>
            <p className={styles.brandCopy}>
              استنوا حلقة كل سبت.
            </p>
          </div>

          <nav className={styles.footerNav} aria-label="روابط الموقع">
            <h2 className={styles.columnTitle}>استكشف</h2>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.navLink}>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className={styles.channelCard} aria-labelledby="footer-channel-title">
            <div className={styles.cardTopline}>
              <span className={styles.youtubeIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
                </svg>
              </span>
              <span className={styles.channelLabel}>على يوتيوب</span>
            </div>
            <h2 id="footer-channel-title" className={styles.cardTitle}>تابع الحلقات</h2>
            <p className={styles.cardCopy}>شاهد الحلقات الكاملة على قناة إياد الموجي.</p>
            <a
              href="https://youtube.com/@AyadElMoghy"
              target="_blank"
              rel="noreferrer"
              className={styles.channelButton}
            >
              <span>زيارة القناة</span>
            </a>
          </section>
        </div>

        <div id="team" className={styles.bottomBar} role="group" aria-label="فريق العمل والاعتمادات">
          <div className={styles.credits}>
            <span className={styles.teamLabel}>فريق العمل</span>
            <span>تقديم إياد الموجي</span>
            <span className={styles.creditDivider} aria-hidden="true">·</span>
            <span dir="ltr">Developed by Ziad Hussein</span>
            <span className={styles.creditDivider} aria-hidden="true">·</span>
            <span>© {year} السبت الممتاز</span>
          </div>
          <Link href="/#home" className={styles.backToTop}>
            <span>فوق تاني</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
