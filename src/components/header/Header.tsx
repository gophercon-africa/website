'use client';
import { useEffect, useState } from 'react';
import { Code2, Menu, X, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  mounted?: boolean;
}

export default function Header({ mounted = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => setThemeMounted(true), []);

  const isAdmin = session?.user?.role === 'admin';
  const roles = [
    isAdmin && 'admin',
    session?.user?.isReviewer && 'reviewer',
  ].filter(Boolean).join(' · ');

  // Dark mode is scoped to the internal tools (admin + reviews). The `.dark`
  // class lives on <html> globally, so we only apply the header's dark styles on
  // internal routes — that keeps the marketing pages light even when the stored
  // preference is dark.
  const isInternal =
    pathname?.startsWith('/admin') || pathname?.startsWith('/reviews');

  const isDark = resolvedTheme === 'dark';
  const navLink = `text-gray-600 hover:text-[#006B3F] transition-colors font-medium${
    isInternal ? ' dark:text-gray-300 dark:hover:text-emerald-400' : ''
  }`;

  return (
    <header className={`bg-white${isInternal ? ' dark:bg-gray-900' : ''}`}>
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
            <Link href="/#about" className={navLink}>About</Link>
            <Link href="/workshops" className={navLink}>Workshops</Link>
            <Link href="/#sponsors" className={navLink}>Sponsors</Link>
            {isAdmin && (
              <Link href="/admin" className={navLink}>
                Admin
              </Link>
            )}
            {session && (
              <div className="relative group">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={navLink}
                >
                  Sign out
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 text-white rounded-lg px-3 py-2.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  <p className="font-medium truncate">{session.user?.email}</p>
                  {roles && <p className="text-gray-400 mt-0.5">{roles}</p>}
                </div>
              </div>
            )}
            {isInternal && themeMounted && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="text-gray-600 hover:text-[#006B3F] dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>
          <button
            className={`md:hidden text-gray-600 hover:text-[#006B3F] transition-colors${
              isInternal ? ' dark:text-gray-300 dark:hover:text-emerald-400' : ''
            }`}
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
              className={`block ${navLink}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/workshops"
              className={`block ${navLink}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Workshops
            </Link>
            <Link
              href="/#sponsors"
              className={`block ${navLink}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sponsors
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={`block ${navLink}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {isInternal && themeMounted && (
              <button
                onClick={() => {
                  setTheme(isDark ? 'light' : 'dark');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 ${navLink}`}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? 'Light mode' : 'Dark mode'}
              </button>
            )}
            {session && (
              <>
                <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  {roles && <p className="text-xs text-gray-400 mt-0.5">{roles}</p>}
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className={`block text-left ${navLink}`}
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
