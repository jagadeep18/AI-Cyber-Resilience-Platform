'use client';

import { useAuth } from '@/lib/auth-context';
import { MainLayout } from '@/components/layout/main-layout';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Pages that require analyst role
const ANALYST_ONLY_PAGES = [
  '/incidents',
  '/threat-intel',
  '/assets',
  '/soar',
  '/agents',
  '/ai-analysis',
  '/ueba',
  '/correlation',
  '/apt-attribution',
  '/vulnerability',
  '/digital-twin',
  '/progression',
  '/attack-graph',
];

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAnalyst } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && user && !isAnalyst) {
      // Check if trying to access analyst-only page
      const isAnalystPage = ANALYST_ONLY_PAGES.some(page => pathname.startsWith(page));
      if (isAnalystPage) {
        router.replace('/');
      }
    }
  }, [user, loading, isAnalyst, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading SentinelX AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}
