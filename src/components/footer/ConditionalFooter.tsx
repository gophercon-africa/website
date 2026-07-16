'use client';
import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith('/reviews') || pathname?.startsWith('/admin')) return null;
  return <Footer />;
}
