'use client';

import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';
import { CustomCursor } from '@/components/ui/custom-cursor';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
      <CustomCursor />
    </AuthProvider>
  );
}