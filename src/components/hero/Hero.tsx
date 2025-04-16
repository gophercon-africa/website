import React from 'react';
import { Calendar, ChevronRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import TypewriterText from '../TypewriterText';
import paths from '@/src/path';
export default function Hero() {
  return (
    <div className="relative min-h-[50vh] overflow-hidden bg-gradient-to-b from-[#004428] via-[#008751] to-[#004428]">
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Animated waves */}
      <div className="absolute inset-0 z-0">
        <div className="wave-pattern"></div>
        <div className="wave-pattern-2"></div>
        <div className="wave-pattern-3"></div>
      </div>

      {/* Stars animation */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
      </div>

      {/* African pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5 pattern-overlay"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white">
            <div className="mb-8">
              <h1 className="text-5xl sm:text-7xl font-bold mb-4 leading-none">
                <TypewriterText 
                  text="GOPHERCON" 
                  className="text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  speed={100}
                />
                <TypewriterText 
                  text="AFRICA 2025" 
                  className="text-white block mt-2 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  speed={100}
                  delay={1000}
                />
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                  <Calendar className="w-5 h-5 mr-2 text-white" />
                  <span className="text-white">November 23-25, 2025</span>
                </div>
                <div className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                  <MapPin className="w-5 h-5 mr-2 text-white" />
                  <span className="text-white">Lagos, Nigeria</span>
                </div>
              </div>
              <p className="text-xl sm:text-2xl text-white leading-relaxed max-w-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Join Africa&apos;s largest Go conference! Experience two days of 
                knowledge sharing, networking, and innovation in the heart of Lagos.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#tickets" className="bg-white hover:bg-white/90 text-[#006B3F] px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:shadow-xl inline-flex items-center justify-center group">
                Get your ticket
                <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={paths.callForSpeakers()} className="border-2 border-white hover:border-white text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:bg-white/20 backdrop-blur-sm">
                Submit your talks
              </Link>
            </div>
          </div>

          {/* Right Column - Gopher Illustration */}
          <div className="relative">
            <div className="relative h-[500px] gopher-container drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">
              <Image
                src="/images/mascots/mascot-kenya.png"
                alt="Gopher Group"
                fill
                className="object-contain floating-gopher"
              />
              {/* Floating elements */}
              <div className="absolute top-0 right-0 floating-star text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">⭐</div>
              <div className="absolute bottom-20 left-0 floating-star delay-200 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">⭐</div>
              <div className="absolute top-40 right-20 floating-star delay-500 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">⭐</div>
            </div>
          </div>
        </div>

        {/* Conference highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all">
            <div className="text-white text-4xl font-bold mb-2">10+</div>
            <div className="text-white">Expert Speakers</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all">
            <div className="text-white text-4xl font-bold mb-2">400+</div>
            <div className="text-white">Attendees Expected</div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 transform hover:scale-105 transition-all">
            <div className="text-white text-4xl font-bold mb-2">2</div>
            <div className="text-white">Days of Learning and networking</div>
          </div>
        </div>
      </div>
    </div>
  );
} 