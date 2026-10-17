'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** A labelled value with a one-tap copy button (Wi-Fi name / password). */
export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard unavailable (older in-app browsers): the value is still
      // visible and selectable, so there is nothing more to do.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 select-all break-all font-mono text-base font-semibold text-ink">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-control border border-line bg-surface px-3 text-sm font-semibold text-brand transition-colors hover:border-brand dark:text-brand-bright"
      >
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}
