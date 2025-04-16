'use client';

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import '../app/hero.css';
import Header from '../components/header/Header';
import Hero from '../components/hero/Hero';
import About from '../components/about/About';
import InfoCards from '../components/info-cards/InfoCards';
import Tickets from '../components/tickets/Tickets';
import Sponsors from '../components/sponsors/Sponsors';
import Newsletter from '../components/newsletter/Newsletter';
import Footer from '../components/footer/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`min-h-screen bg-white ${inter.variable} font-sans`}>
      <Header mounted={mounted} />
      <Hero />
      <About />
      <InfoCards />
      <Tickets />
      <Sponsors />
      <Newsletter />
      <Footer />
    </div>
  );
}