'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HIDE_ON = ['/reviews', '/admin'];

export default function TawkController() {
  const pathname = usePathname();

  useEffect(() => {
    const shouldHide = HIDE_ON.some((p) => pathname?.startsWith(p));

    function apply() {
      const api = (window as any).Tawk_API;
      if (!api) return;
      shouldHide ? api.hideWidget?.() : api.showWidget?.();
    }

    const api = (window as any).Tawk_API;
    if (api?.hideWidget) {
      apply();
    } else {
      // Tawk not loaded yet — queue via onLoad
      (window as any).Tawk_API = (window as any).Tawk_API || {};
      const prev = (window as any).Tawk_API.onLoad;
      (window as any).Tawk_API.onLoad = function () {
        prev?.();
        apply();
      };
    }
  }, [pathname]);

  return null;
}
