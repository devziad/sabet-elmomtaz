import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/navigation/ComingSoonPage';

export const metadata: Metadata = {
  title: 'Team | Saturday Al-Momtaz',
};

export default function TeamPage() {
  return <ComingSoonPage title="Team" />;
}
