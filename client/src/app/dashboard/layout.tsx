'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import { Menu, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role === 'client') {
        router.replace('/client');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app-layout">
      {/* Mobile Topbar */}
      <header className="mobile-topbar md:hidden flex items-center justify-between px-4 border-b border-[#E2E8F0] dark:border-[#1E1E24] bg-white dark:bg-[#08080A] fixed top-0 left-0 right-0 z-40 h-[68px]">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors relative"
          title={t('nav.openMenu')}
        >
          <Menu className="size-6" />
          {hasUnread && (
            <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-[#E11827] animate-pulse border-2 border-background shadow-[0_0_8px_rgba(225,24,39,0.8)]" />
          )}
        </button>
        <div className="flex items-center gap-2">
          <div className="size-8 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/brand/owl.png" alt="SHADOWS" className="size-full object-contain filter drop-shadow-[0_0_6px_rgba(225,24,39,0.4)]" />
          </div>
          <span className="text-sm font-black text-foreground tracking-[0.15em] uppercase">{t('common.appName')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/profile" title={t('nav.myProfile')}>
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="size-8 rounded-full object-cover shrink-0 border border-border hover:ring-2 hover:ring-[#E11827] transition-all"
                title={`${user.name} (${user.role})`}
              />
            ) : (
              <div className="size-8 rounded-full bg-[#E11827] flex items-center justify-center text-white text-[11px] font-bold shrink-0 hover:ring-2 hover:ring-[#E11827] transition-all" title={`${user?.name} (${user?.role})`}>
                {user?.name ? getInitials(user.name) : '?'}
              </div>
            )}
          </Link>
          <button
            onClick={logout}
            className="p-2 -mr-2 text-muted-foreground hover:text-[#E11827] hover:bg-[#E11827]/10 rounded-md transition-colors"
            title={t('common.signOut')}
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      {/* Backdrop Overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onUnreadChange={setHasUnread}
      />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
