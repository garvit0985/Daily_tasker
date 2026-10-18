// DUO OS — Desktop & Tablet Navigation Sidebar
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  CheckSquare2,
  Timer,
  GraduationCap,
  Target,
  Briefcase,
  BarChart3,
  Sliders,
  Settings,
  ArrowLeftRight,
  Flame,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLiveMood } from '../../lib/store';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/together', label: 'Together Live', icon: Users2, badge: 'Live' },
  { path: '/schedule', label: 'Schedule & Calendar', icon: CalendarDays },
  { path: '/tasks', label: 'Tasks & Sprints', icon: CheckSquare2 },
  { path: '/focus', label: 'Focus & Ambience', icon: Timer },
  { path: '/academics', label: 'Academics & Labs', icon: GraduationCap },
  { path: '/exams', label: 'CAT & GATE Trackers', icon: Target },
  { path: '/career', label: 'Career & Jobs', icon: Briefcase },
  { path: '/insights', label: 'Insights & Reviews', icon: BarChart3 },
  { path: '/onboarding', label: 'Timetable Import', icon: FileSpreadsheet },
  { path: '/settings', label: 'Settings & Cloud', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user, partner, currentPersona, switchPersona } = useAuth();
  const partnerMood = getLiveMood(partner.id);

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#0A0E1A]/95 backdrop-blur-xl border-r border-white/8 text-slate-300 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600/30 via-slate-800 to-emerald-500/20 border border-white/10 shadow-[0_0_15px_-3px_rgba(139,92,246,0.25)]">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 absolute -top-0.5 -left-0.5 animate-pulse-live" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5" />
            <Flame className="w-4 h-4 text-violet-300" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              DUO OS <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 font-mono font-normal">v2.6</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">BTech Shared Ecosystem</p>
          </div>
        </div>
      </div>

      {/* Active User Switcher Banner */}
      <div className="px-4 py-3 bg-slate-900/40 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-violet-500/40"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentPersona === 'user_a' ? '3rd-Yr CS' : '4th-Yr AI/DS'}
              </p>
            </div>
          </div>
          <button
            onClick={() => switchPersona(currentPersona === 'user_a' ? 'user_b' : 'user_a')}
            title={`Switch to ${partner.displayName}`}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-violet-600/20 hover:text-violet-300 text-slate-400 border border-white/5 transition-all text-xs flex items-center gap-1"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-white font-semibold border border-violet-500/30 shadow-[0_0_16px_-4px_rgba(139,92,246,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Shared Partner Live Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-white/8 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Partner Live Status
          </span>
          <NavLink to="/together" className="text-[10px] text-violet-400 hover:underline">
            View Live →
          </NavLink>
        </div>
        <div className="flex items-center gap-2.5">
          <img
            src={partner.avatarUrl}
            alt={partner.displayName}
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/40"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{partner.displayName}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {partnerMood && !partnerMood.isPrivate
                ? `${partnerMood.mood.toUpperCase()} • ${partnerMood.energyLevel}/5 ⚡`
                : 'Study Session Active'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
