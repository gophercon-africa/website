import type { Metadata } from 'next';
import Script from 'next/script';
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
        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/6a1172b6e9e7d11c32e0d0d0/1jpa2g6bf';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
