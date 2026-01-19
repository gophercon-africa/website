'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import '../app/hero.css';
import Hero from '@components/hero/Hero';
import About from '@components/about/About';
import InfoCards from '@components/info-cards/InfoCards';
import Tickets from '@components/tickets/Tickets';
import Sponsors from '@components/sponsors/Sponsors';
import Newsletter from '@components/newsletter/Newsletter';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function LandingPage() {

  return (
    <div className={`min-h-screen bg-white ${inter.variable} font-sans`}>
      <Hero />
      <About />
      <InfoCards />
      <Tickets />
      <Sponsors />
      <Newsletter />
    </div>
  );
}