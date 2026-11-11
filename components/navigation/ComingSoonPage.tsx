import Link from 'next/link';
import styles from './ComingSoonPage.module.css';

interface ComingSoonPageProps {
  title: string;
}

export function ComingSoonPage({ title }: ComingSoonPageProps) {
  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="coming-soon-title">
        <p className={styles.eyebrow}>SATURDAY AL-MOMTAZ</p>
        <h1 id="coming-soon-title" className={styles.title}>{title}</h1>
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.soon}>SOON</p>
        <Link href="/" className={styles.homeLink}>Back to Home</Link>
      </section>
    </main>
  );
}
