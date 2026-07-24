'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Tawk.to is prod-landing-page only: the script is injected the first time a
// visitor is on / at gophercon.africa (aliases 301 there), and never on
// localhost/previews. After that, SPA navigation just toggles visibility.
const PROD_HOST = 'gophercon.africa';
const TAWK_SRC = 'https://embed.tawk.to/6a1172b6e9e7d11c32e0d0d0/1jpa2g6bf';

interface TawkApi {
  hideWidget?: () => void;
  showWidget?: () => void;
  onLoad?: () => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

let injected = false;

export default function TawkController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hostname !== PROD_HOST) return;

    const onLanding = pathname === '/';

    if (!injected) {
      if (!onLanding) return;
      injected = true;
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      const script = document.createElement('script');
      script.async = true;
      script.src = TAWK_SRC;
      script.setAttribute('charset', 'UTF-8');
      script.setAttribute('crossorigin', '*');
      document.head.appendChild(script);
      return;
    }

    function apply() {
      const api = window.Tawk_API;
      if (!api) return;
      if (onLanding) {
        api.showWidget?.();
      } else {
        api.hideWidget?.();
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
