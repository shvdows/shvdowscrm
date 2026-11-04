'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.replace('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(msg);
      setTimeout(() => {
        passwordRef.current?.focus();
        passwordRef.current?.select();
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-[#08080A] px-4 py-12 text-[#F7F5F5] select-none font-sans overflow-hidden"
      suppressHydrationWarning
    >
      {/* Cinematic Red Radial Glow in Background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(145,8,20,0.28)_0%,rgba(8,8,10,0.95)_60%,#08080A_100%)]"
        aria-hidden="true"
      />

      {/* Decorative Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-[400px] border border-[#1E1E24] bg-[#0D0D12]/95 backdrop-blur-md p-8 sm:p-9 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl flex flex-col gap-6"
        suppressHydrationWarning
      >
        <div className="flex flex-col items-center text-center gap-3.5">
          <div className="w-20 h-20 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/brand/owl.png"
              alt="SHADOWS"
              className="size-full object-contain filter drop-shadow-[0_0_18px_rgba(225,24,39,0.55)] transition-transform hover:scale-105 duration-300"
            />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black uppercase tracking-[0.25em] text-[#F7F5F5]">
              SHADOWS
            </h1>
            <p className="text-[10px] text-[#E11827] uppercase tracking-[0.25em] font-extrabold font-mono">
              CLIENT PORTAL
            </p>
            <p className="text-[9px] text-[#AFAAAF] uppercase tracking-[0.2em] font-mono italic">
              WE MOVE IN SILENCE
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-[#910814]/20 border border-[#E11827]/40 text-[#F7F5F5] text-[11px] uppercase font-mono tracking-wider px-3.5 py-2.5 rounded-lg text-center shadow-[0_0_15px_rgba(225,24,39,0.2)]">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-start" suppressHydrationWarning>
          <div className="flex flex-col gap-1.5" suppressHydrationWarning>
            <label
              htmlFor="email"
              className="text-[10px] font-bold uppercase tracking-widest text-[#AFAAAF] font-mono"
              suppressHydrationWarning
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="client@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              suppressHydrationWarning
              className="bg-[#121216] border border-[#1E1E24] text-[#F7F5F5] placeholder-[#AFAAAF]/40 focus:border-[#E11827] focus:ring-2 focus:ring-[#E11827]/25 outline-none text-xs h-11 px-3.5 transition-all rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1.5" suppressHydrationWarning>
            <label
              htmlFor="password"
              className="text-[10px] font-bold uppercase tracking-widest text-[#AFAAAF] font-mono"
              suppressHydrationWarning
            >
              Password
            </label>
            <input
              id="password"
              ref={passwordRef}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              suppressHydrationWarning
              className="bg-[#121216] border border-[#1E1E24] text-[#F7F5F5] placeholder-[#AFAAAF]/40 focus:border-[#E11827] focus:ring-2 focus:ring-[#E11827]/25 outline-none text-xs h-11 px-3.5 transition-all rounded-lg"
            />
          </div>

          <button
            type="submit"
            suppressHydrationWarning
            className="w-full h-11 bg-[#E11827] hover:bg-[#910814] text-white font-bold uppercase tracking-[0.2em] text-xs mt-2 transition-all duration-200 flex items-center justify-center rounded-lg font-mono shadow-[0_0_20px_rgba(225,24,39,0.35)] hover:shadow-[0_0_25px_rgba(225,24,39,0.55)] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Signing In...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#1E1E24]">
          <span className="text-[10px] text-[#AFAAAF]/70 font-mono tracking-wider">
            SHADOWS CRM © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
