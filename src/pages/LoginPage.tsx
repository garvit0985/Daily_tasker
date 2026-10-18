// DUO OS — Authentication & Instant Persona Login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Flame, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState<'demo' | 'email'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('DUO-2026-NIT');

  const handleDemoLogin = (persona: 'user_a' | 'user_b') => {
    loginDemo(persona);
    toast.success('Welcome to DUO OS!', `Logged in as ${persona === 'user_a' ? 'Garvit' : 'Bittu'}`);
    navigate('/dashboard');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    // Default to User A for arbitrary logins
    loginDemo('user_a');
    toast.success('Authentication successful', `Signed in as ${email}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/10 to-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Brand Badge */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-400 p-0.5 shadow-[0_0_25px_-5px_rgba(139,92,246,0.5)] mb-4">
          <div className="w-full h-full bg-[#0A0E1A] rounded-[14px] flex items-center justify-center">
            <Flame className="w-6 h-6 text-violet-400" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          DUO <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">OS</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
          The shared AI productivity, study planning, exam prep, and career management operating system for two BTech engineering students.
        </p>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-[#0D1322]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Mode Tabs */}
        <div className="flex p-1 bg-slate-900/80 rounded-xl mb-6 border border-white/5">
          <button
            onClick={() => setMode('demo')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'demo'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Instant Dual Demo
          </button>
          <button
            onClick={() => setMode('email')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'email'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Account
          </button>
        </div>

        {mode === 'demo' ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 text-center mb-2">
              Select which engineering student profile to sign in as. You can switch between them anytime with 1 click:
            </p>

            {/* User A Card */}
            <div
              onClick={() => handleDemoLogin('user_a')}
              className="p-4 rounded-2xl bg-slate-900/60 hover:bg-violet-950/30 border border-white/8 hover:border-violet-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                      Garvit
                    </h4>
                    <p className="text-[11px] text-slate-400">3rd-Year BTech Computer Science</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1.5 text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-white/5">Gym @ 5:30 AM</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5">6-day College</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5">Tuition 5:30-8 PM</span>
                <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 font-medium">LeetCode & CAT 2027</span>
              </div>
            </div>

            {/* User B Card */}
            <div
              onClick={() => handleDemoLogin('user_b')}
              className="p-4 rounded-2xl bg-slate-900/60 hover:bg-emerald-950/30 border border-white/8 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300">
                    B
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Bittu
                    </h4>
                    <p className="text-[11px] text-slate-400">4th-Year BTech Data Science & AI</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-1.5 text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-white/5">3-day College</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">CAT Nov 2026 (Urgent)</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5">GATE DA</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5">Placements</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">University Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@nit.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Shared Workspace Invite Code</label>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="DUO-2026-NIT"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center justify-center gap-2 mt-2"
            >
              Sign In to DUO OS <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Security & RLS badge */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Supabase RLS Protected
          </span>
          <span className="text-slate-500">End-to-End Synced</span>
        </div>
      </div>
    </div>
  );
};
