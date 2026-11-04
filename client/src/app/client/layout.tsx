'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import { clientChatApi } from '@/lib/api';
import { playNotificationSound } from '@/lib/notificationSound';
import { createBackgroundTimer, sendDesktopNotification } from '@/lib/backgroundNotification';
import { Loader2, LogOut, LayoutDashboard, Calendar, FileText, HelpCircle, User, Settings, Globe, MessageSquare, Menu } from 'lucide-react';

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/login' || pathname === '/client/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/login');
    }
  }, [user, loading, isLoginPage, router]);

  // If loading user state on authenticated pages, show minimal loading screen
  if (loading && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050506] text-[#8f8f9e]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-5 animate-spin text-white" />
          <span className="text-[10px] tracking-widest uppercase font-mono">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  // If login page, just render the login view directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Safeguard: if logged in but not a client role, block access
  if (user && user.role !== 'client') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050506] text-[#f4f4f5] p-4 text-center select-none font-sans">
        <h1 className="text-sm font-bold uppercase tracking-widest mb-2 text-white">Access Denied</h1>
        <p className="text-xs text-[#8f8f9e] mb-6 max-w-sm font-medium leading-relaxed">This portal is specifically for client accounts. Please sign out and log in to the agency dashboard.</p>
        <button
          onClick={logout}
          className="h-10 px-6 border border-[#2d2d34] bg-[#0c0c0e] hover:bg-[#121214] text-white font-semibold uppercase tracking-widest text-[10px] transition-colors font-mono"
        >
          <LogOut className="size-3.5 mr-2 inline" /> Sign Out
        </button>
      </div>
    );
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnreadChat, setHasUnreadChat] = useState(false);
  const prevUnreadChatRef = useRef(false);
  const toggleLocale = () => setLocale(locale === 'en' ? 'ar' : 'en');

  // Check unread chat for client portal
  useEffect(() => {
    if (!user || user.role !== 'client') return;

    if (pathname === '/client/chat') {
      localStorage.setItem('last_read_client_portal_chat_time', new Date().toISOString());
      setHasUnreadChat(false);
      prevUnreadChatRef.current = false;
      return;
    }

    const checkUnreadChat = async () => {
      try {
        const res = await clientChatApi.listMessages(user.id).catch(() => ({ messages: [] }));
        const messages = res.messages || [];
        if (messages.length === 0) return;
        const latestMsg = messages[messages.length - 1];
        if (latestMsg.sender_type === 'user') {
          const lastRead = localStorage.getItem('last_read_client_portal_chat_time');
          const isNew = !lastRead || new Date(latestMsg.created_at) > new Date(lastRead);
          if (isNew && !prevUnreadChatRef.current) {
            playNotificationSound('message');
            sendDesktopNotification(locale === 'ar' ? '💬 رسالة جديدة من فريق العمل' : '💬 New Message from Agency', {
              body: locale === 'ar' ? 'وصلتك رسالة جديدة في المحادثة المباشرة.' : 'You have a new chat message from the agency.',
              tag: 'client-portal-chat',
            });
          }
          prevUnreadChatRef.current = isNew;
          setHasUnreadChat(isNew);
        }
      } catch {
        // Silently swallow background polling errors
      }
    };

    checkUnreadChat();
    const cleanupWorker = createBackgroundTimer(checkUnreadChat, 3000);
    return () => cleanupWorker();
  }, [pathname, user, locale]);

  const navLinks = [
    { label: t('portal.overview'), href: '/client', icon: LayoutDashboard },
    { label: t('portal.chat') || 'Chat', href: '/client/chat', icon: MessageSquare },
    { label: t('portal.contentPlan'), href: '/client/content', icon: FileText },
    { label: t('portal.calendar'), href: '/client/calendar', icon: Calendar },
    { label: t('portal.faq'), href: '/client/faq', icon: HelpCircle },
    { label: t('portal.settings'), href: '/client/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08080A] text-slate-900 dark:text-[#F7F5F5] flex flex-col md:flex-row font-sans select-none overflow-hidden" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-[#E2E8F0] shrink-0 z-30">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="size-6 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/brand/owl.png" alt="SHADOWS" className="size-full object-contain filter drop-shadow-[0_0_6px_rgba(225,24,39,0.4)]" />
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase">SHADOWS</span>
        </div>

        <button
          onClick={toggleLocale}
          className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
        >
          {locale === 'en' ? 'AR' : 'EN'}
        </button>
      </header>

      {/* Mobile Navigation Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Left/Right Sidebar based on locale */}
      <aside
        className={`fixed md:static inset-y-0 z-50 w-60 border-[#E2E8F0] dark:border-[#1E1E24] bg-white dark:bg-[#08080A] text-slate-800 dark:text-[#F7F5F5] flex flex-col justify-between shrink-0 shadow-sm transition-transform duration-200 ${
          locale === 'ar' ? 'right-0 border-l' : 'left-0 border-r'
        } ${mobileMenuOpen ? 'translate-x-0' : (locale === 'ar' ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}`}
      >
        <div className="flex flex-col">
          <div className="h-16 px-6 border-b border-[#E2E8F0] dark:border-[#1E1E24] flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="size-8 flex items-center justify-center overflow-hidden shrink-0">
                <img src="/brand/owl.png" alt="SHADOWS" className="size-full object-contain filter drop-shadow-[0_0_8px_rgba(225,24,39,0.4)]" />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-base font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase leading-none">SHADOWS</span>
                <span className="text-[8px] text-[#E11827] uppercase tracking-widest font-mono mt-1 font-bold">MEDIA &amp; ADVERTISING</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <LogOut className="size-4 rotate-180" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 p-4">
            {navLinks.map(link => {
              const isActive = pathname === link.href || (link.href === '/client' && pathname === '/');
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 transition-all text-[11px] uppercase font-mono tracking-wider font-bold relative rounded-lg ${
                    isActive 
                      ? 'bg-[#E11827]/10 dark:bg-[#E11827]/15 text-[#910814] dark:text-[#F7F5F5] border-l-2 rtl:border-l-0 rtl:border-r-2 border-[#E11827] shadow-[0_0_15px_rgba(225,24,39,0.2)]' 
                      : 'text-slate-600 dark:text-[#AFAAAF] hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span className="flex-1">{link.label}</span>
                  {link.href === '/client/chat' && hasUnreadChat && (
                    <span className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-[#E11827] animate-pulse shadow-[0_0_8px_rgba(225,24,39,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="flex flex-col">
          {/* Language Toggle */}
          <div className="px-4 py-2 border-t border-[#E2E8F0] dark:border-[#1E1E24] flex bg-white dark:bg-[#08080A]">
            <button
              onClick={toggleLocale}
              className="lang-toggle w-full flex items-center justify-center gap-2 h-9 bg-slate-50 dark:bg-[#121216] border border-[#E2E8F0] dark:border-[#1E1E24] hover:bg-slate-100 dark:hover:bg-[#18181F] text-slate-700 dark:text-[#AFAAAF] hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors text-xs font-semibold shadow-xs"
              title={t('lang.switch')}
            >
              <Globe className="size-4 shrink-0" />
              {locale === 'en' ? t('lang.ar') : t('lang.en')}
            </button>
          </div>

          {/* User profile and logout */}
          <div className="p-4 border-t border-[#E2E8F0] dark:border-[#1E1E24] bg-white dark:bg-[#08080A]">
            <div className="flex items-center justify-between gap-3 p-3 border border-[#E2E8F0] dark:border-[#1E1E24] bg-slate-50 dark:bg-[#121216] rounded-xl">
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-6 rounded-full bg-slate-200 flex items-center justify-center border border-[#E2E8F0] overflow-hidden shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="size-full object-cover" />
                  ) : (
                    <User className="size-3.5 text-slate-500" />
                  )}
                </div>
                <span className="text-[10px] font-bold font-mono text-[#0F172A] dark:text-[#F7F5F5] truncate uppercase tracking-wider">{user?.name}</span>
              </div>

              <button
                onClick={logout}
                className="size-7 flex items-center justify-center border border-[#E2E8F0] dark:border-[#1E1E24] bg-white dark:bg-[#18181F] hover:bg-rose-50 dark:hover:bg-[#E11827]/20 text-slate-500 dark:text-[#AFAAAF] hover:text-[#E11827] rounded-lg transition-colors shrink-0"
                title={t('portal.signOut')}
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-3.5rem)] md:h-screen overflow-y-auto">
        <main className="flex-1 px-4 py-4 md:px-8 md:py-8 flex flex-col min-h-0 text-start min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
