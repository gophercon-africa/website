import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import Providers from './providers';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GopherCon Africa - The Premier Go Conference in Africa',
  description: 'Join Africa is largest Go conference! Experience two days of knowledge sharing, networking, and innovation in the heart of Lagos.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}