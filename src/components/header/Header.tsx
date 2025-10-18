'use client';
import { useState } from 'react';
import { Code2, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import paths from '@/src/path';

interface HeaderProps {
  mounted?: boolean;
}

export default function Header({ mounted = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group no-underline">
              {mounted ? (
                <Image 
                  src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744891071/GopherCon_Africa_25_vskz7n_obmh5q.png" 
                  alt="GopherCon" 
                  width={160} 
                  height={160} 
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Code2 className="w-8 h-8 text-gray-600" />
                  <span className="text-xl font-semibold text-gray-600">GopherCon</span>
                </div>
              )}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#about" className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">About</Link>
            <Link href={paths.speakers()} className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">Speakers</Link>
            <Link href={paths.schedule()} className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">Schedule</Link>
            <Link href="/#sponsors" className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">Sponsors</Link>
            <Link href="/#tickets" className="bg-[#006B3F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#008751] transition-colors">
              Buy Tickets
            </Link>
          </div>
          <button
            className="md:hidden text-gray-600 hover:text-[#006B3F] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              href="/#about" 
              className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href={paths.speakers()} 
              className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Speakers
            </Link>
            <Link 
              href={paths.schedule()} 
              className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Schedule
            </Link>
            <Link 
              href="/#sponsors" 
              className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sponsors
            </Link>
            <Link 
              href="/#tickets" 
              className="block bg-[#006B3F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#008751] transition-colors text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Buy Tickets
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
} 