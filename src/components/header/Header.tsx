'use client';
import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Button from '@components/ui/Button';
import { TICKETS_URL } from '@/src/lib/links';

const NAV_LINKS = [
  { href: '/#about', label: 'About' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/speakers', label: 'Speakers' },
  { href: '/workshops', label: 'Workshops' },
] as const;

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setThemeMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Lock body scroll while the mobile menu is open. Inline style so it
  // composes with (and restores cleanly around) `review-workspace-lock`.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

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

  const isActive = (href: string) =>
    !href.startsWith('/#') &&
    (pathname === href || pathname?.startsWith(`${href}/`));

  const navLink = (href?: string) =>
    `${
      href && isActive(href)
        ? 'text-brand font-semibold'
        : 'text-muted hover:text-brand font-medium'
    } transition-colors${
      isInternal ? ' dark:text-gray-300 dark:hover:text-emerald-400' : ''
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b border-line bg-white/95${
        isInternal ? ' dark:border-gray-800 dark:bg-gray-900/95' : ''
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <Link href="/" className="flex items-center no-underline">
            <Image
              src="https://res.cloudinary.com/dlmqe0two/image/upload/v1744891071/GopherCon_Africa_25_vskz7n_obmh5q.png"
              alt="GopherCon Africa"
              width={160}
              height={160}
              className="h-10 w-auto sm:h-12"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={navLink(href)}>
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className={navLink('/admin')}>
                Admin
              </Link>
            )}
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                title={session.user?.email ?? undefined}
                className={navLink()}
              >
                Sign out
              </button>
            )}
            {isInternal && themeMounted && (
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="text-gray-600 hover:text-brand dark:text-gray-300 dark:hover:text-emerald-400 transition-colors"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            {!isInternal && (
              <Button href={TICKETS_URL} external>
                Get Tickets
              </Button>
            )}
          </div>
          <button
            className={`md:hidden text-gray-600 hover:text-brand transition-colors${
              isInternal ? ' dark:text-gray-300 dark:hover:text-emerald-400' : ''
            }`}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-line animate-slideDown">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block ${navLink(href)}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={`block ${navLink('/admin')}`}
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
                className={`flex items-center gap-2 ${navLink()}`}
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
                  className={`block text-left ${navLink()}`}
                >
                  Sign out
                </button>
              </>
            )}
            {!isInternal && (
              <Button href={TICKETS_URL} external className="w-full">
                Get Tickets
              </Button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
