import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/globals.css';
import Providers from './providers';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GopherCon Africa - The Premier Go Conference in Africa',
  description: 'Join Africa is largest Go conference! Experience two days of knowledge sharing, networking, and innovation in the heart of Lagos.',
  icons: {
    icon: 'https://res.cloudinary.com/dlmqe0two/image/upload/v1744891071/GopherCon_Africa_25_vskz7n_obmh5q.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <Providers>
          <Header mounted={true} />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}