'use client';

import React from 'react';
import '../app/hero.css';
import Hero from '@components/hero/Hero';
import About from '@components/about/About';
import InfoCards from '@components/info-cards/InfoCards';
import Tickets from '@components/tickets/Tickets';
import Sponsors from '@components/sponsors/Sponsors';
import Newsletter from '@components/newsletter/Newsletter';
import VisaInfo from '@components/visa-info/VisaInfo';

export default function LandingPage({ cfsOpen }: { cfsOpen: boolean }) {

  return (
    <div className="min-h-screen bg-white font-sans">
      <Hero cfsOpen={cfsOpen} />
      <About />
      <InfoCards cfsOpen={cfsOpen} />
      <Tickets />
      <Sponsors />
      <VisaInfo />
      <Newsletter />
    </div>
  );
}
