// DUO OS — Mobile Bottom Navigation Bar
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users2,
  CalendarDays,
  CheckSquare2,
  Timer,
  MoreHorizontal,
  GraduationCap,
  Target,
  Briefcase,
  BarChart3,
  Settings,
  FileSpreadsheet
} from 'lucide-react';

const PRIMARY_MOBILE_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/together', label: 'Together', icon: Users2, isLive: true },
  { path: '/schedule', label: 'Schedule', icon: CalendarDays },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare2 },
  { path: '/focus', label: 'Focus', icon: Timer },
];

const MORE_MOBILE_ITEMS = [
  { path: '/academics', label: 'Academics & Labs', icon: GraduationCap },
  { path: '/exams', label: 'CAT & GATE Trackers', icon: Target },
  { path: '/career', label: 'Career & Jobs', icon: Briefcase },
  { path: '/insights', label: 'Insights & Reviews', icon: BarChart3 },
  { path: '/onboarding', label: 'Timetable Import', icon: FileSpreadsheet },
  { path: '/settings', label: 'Settings & Cloud', icon: Settings },
];

export const BottomNav: React.FC = () => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Sheet for More Items */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-md" onClick={() => setIsMoreOpen(false)}>
          <div
            className="fixed bottom-16 inset-x-0 p-4 bg-[#0D1322] border-t border-white/10 rounded-t-3xl shadow-2xl space-y-2 animate-in slide-in-from-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 mb-2">More Tools</h4>
            <div className="grid grid-cols-2 gap-2">
              {MORE_MOBILE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMoreOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-violet-600/20 border-violet-500/40 text-white'
                          : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-violet-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-[#070A11]/95 backdrop-blur-xl border-t border-white/8 z-30 flex items-center justify-around px-2">
        {PRIMARY_MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-all ${
                  isActive ? 'text-violet-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.isLive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setIsMoreOpen(!isMoreOpen)}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-medium transition-all ${
            isMoreOpen ? 'text-violet-400' : 'text-slate-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
};
