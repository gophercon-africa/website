import React from 'react';
import { Code2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import paths from '@/src/path';

interface HeaderProps {
  mounted: boolean;
}

export default function Header({ mounted }: HeaderProps) {
  return (
    <header className="bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            {mounted ? (
              <Link href="/" className="flex items-center space-x-2 group no-underline">
                <Image 
                  src="/images/logos/offical.png" 
                  alt="GopherCon" 
                  width={150} 
                  height={100} 
                />
              </Link>
            ) : (
              <div className="flex items-center space-x-2 text-white">
                <Code2 className="w-8 h-8" />
                <span className="text-xl font-semibold">GopherCon</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#about" className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">About</Link>
            <Link href={paths.callForSpeakers()} className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">Call for Speakers</Link>
            <Link href="#sponsors" className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">Sponsors</Link>
            <Link href="#tickets" className="bg-[#006B3F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#008751] transition-colors">
              Buy Tickets
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
} 