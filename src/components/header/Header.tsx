'use client';
import { useState } from 'react';
import { Code2, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

interface HeaderProps {
  mounted?: boolean;
}

export default function Header({ mounted = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'admin';
  const roles = [
    isAdmin && 'admin',
    session?.user?.isReviewer && 'reviewer',
  ].filter(Boolean).join(' · ');

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
            <Link href="/workshops" className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">Workshops</Link>
            <Link href="/#sponsors" className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">Sponsors</Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium">
                Admin
              </Link>
            )}
            {session && (
              <div className="relative group">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
                >
                  Sign out
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 text-white rounded-lg px-3 py-2.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  <p className="font-medium truncate">{session.user?.email}</p>
                  {roles && <p className="text-gray-400 mt-0.5">{roles}</p>}
                </div>
              </div>
            )}
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
              href="/workshops"
              className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Workshops
            </Link>
            <Link
              href="/#sponsors"
              className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sponsors
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {session && (
              <>
                <div className="pt-1 border-t border-gray-100">
                  <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  {roles && <p className="text-xs text-gray-400 mt-0.5">{roles}</p>}
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="block text-gray-600 hover:text-[#006B3F] transition-colors font-medium text-left"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
