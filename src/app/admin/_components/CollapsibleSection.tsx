'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export function CollapsibleSection({
  title,
  storageKey,
  defaultOpen = true,
  children,
}: {
  title: string;
  storageKey: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // Read after mount so SSR and first client render agree.
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) setOpen(stored === 'true');
  }, [storageKey]);

  function toggle() {
    setOpen((prev) => {
      localStorage.setItem(storageKey, String(!prev));
      return !prev;
    });
  }

  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-black/40 overflow-hidden border border-transparent dark:border-gray-800 mt-8">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="border-t border-gray-200 dark:border-gray-800">{children}</div>}
    </section>
  );
}
