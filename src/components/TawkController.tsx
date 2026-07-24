'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const HIDE_ON = ['/reviews', '/admin'];

interface TawkApi {
  hideWidget?: () => void;
  showWidget?: () => void;
  onLoad?: () => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
  }
}

export default function TawkController() {
  const pathname = usePathname();

  useEffect(() => {
    const shouldHide = HIDE_ON.some((p) => pathname?.startsWith(p));

    function apply() {
      const api = window.Tawk_API;
      if (!api) return;
      if (shouldHide) {
        api.hideWidget?.();
      } else {
        api.showWidget?.();
      }
    }

    if (window.Tawk_API?.hideWidget) {
      apply();
    } else {
      // Tawk not loaded yet — queue via onLoad
      window.Tawk_API = window.Tawk_API || {};
      const prev = window.Tawk_API.onLoad;
      window.Tawk_API.onLoad = function () {
        prev?.();
        apply();
      };
    }
  }, [pathname]);

  return null;
}
