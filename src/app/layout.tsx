import type { Metadata } from 'next';
import '../styles/globals.css';
import Providers from './providers';
import Header from '@components/header/Header';
import Footer from '@components/footer/Footer';

export const metadata: Metadata = {
  title: 'GopherCon Africa 2026 - The Premier Go Conference in Africa',
  description: 'Join Africa\'s largest Go conference! Experience three days of knowledge sharing, networking, and innovation in Nairobi, Kenya.',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <Header mounted={true} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
