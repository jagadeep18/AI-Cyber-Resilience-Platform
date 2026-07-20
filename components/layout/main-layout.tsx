'use client';

import { useState } from 'react';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <AppSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-auto bg-gradient-dashboard p-6">
          {children}
        </main>
      </div>
    </div>
  );
}