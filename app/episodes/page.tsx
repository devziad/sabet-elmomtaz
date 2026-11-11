import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/navigation/ComingSoonPage';

export const metadata: Metadata = {
  title: 'Episodes | Saturday Al-Momtaz',
};

export default function EpisodesPage() {
  return <ComingSoonPage title="Episodes" />;
}
