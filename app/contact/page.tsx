import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/navigation/ComingSoonPage';

export const metadata: Metadata = {
  title: 'Contact | Saturday Al-Momtaz',
};

export default function ContactPage() {
  return <ComingSoonPage title="Contact" />;
}
