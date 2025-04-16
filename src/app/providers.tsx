'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Toaster position="top-center" />
      {children} 
    </SessionProvider>
  );
}
