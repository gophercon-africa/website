'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="top-center"
      richColors
      duration={5000}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
        disableTransitionOnChange
      >
        <ThemedToaster />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
