'use client';

import { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

const OPTIONS = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
] as const;

/**
 * Global light / dark / system theme switcher shown in the header on every
 * route (marketing + internal). Binds to next-themes `theme` (the preference,
 * so "System" is selectable) and uses `resolvedTheme` only to pick the trigger
 * icon. Renders a neutral placeholder until mounted to avoid hydration
 * mismatch (the stored preference isn't known on the server).
 */
export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const TriggerIcon = resolvedTheme === 'dark' ? Moon : Sun;

  if (!mounted) {
    // Reserve the space so layout doesn't shift when the toggle mounts.
    return <div className="h-5 w-5" aria-hidden />;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center text-muted transition-colors hover:text-brand"
      >
        <TriggerIcon size={20} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-control border border-line bg-surface py-1 shadow-md"
        >
          {OPTIONS.map(({ value, label, Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'font-semibold text-brand'
                    : 'text-body hover:bg-surface-sunken'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
