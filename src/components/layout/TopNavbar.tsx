// DUO OS — Top Navigation Bar
import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Sun,
  Moon,
  ArrowLeftRight,
  Smile,
  Zap,
  Menu,
  X,
  CheckCircle2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { getLiveMood, getNotifications, markNotificationRead } from '../../lib/store';
import { QuickTaskModal } from '../tasks/QuickTaskModal';
import { MoodShareModal } from '../together/MoodShareModal';
import { ExcelDatabaseModal } from '../database/ExcelDatabaseModal';

export const TopNavbar: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const { user, partner, currentPersona, switchPersona } = useAuth();
  const { effectiveMode, setMode } = useTheme();
  const toast = useToast();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const currentMood = getLiveMood(user.id);
  const notifs = getNotifications(user.id);
  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <>
      <header className="h-16 px-4 sm:px-6 border-b border-white/8 bg-[#070A11]/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between">
        {/* Left: Mobile trigger & Simulated Date */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/8 text-[11px] font-mono font-medium text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              Sun, Oct 18, 2026
            </span>
            <span className="hidden lg:inline text-xs text-slate-500 font-medium">
              NIT Engineering Fall Semester
            </span>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Mood Pill */}
          <button
            onClick={() => setIsMoodModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/8 text-xs font-medium text-slate-300 transition-all hover:border-violet-500/40"
            title="Update your current energy & focus mood"
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline capitalize">
              {currentMood?.mood ? currentMood.mood.replace('_', ' ') : 'Check in'}
            </span>
            {currentMood?.energyLevel && (
              <span className="text-[10px] text-violet-400 font-mono">
                {currentMood.energyLevel}/5⚡
              </span>
            )}
          </button>

          {/* Quick Add Task */}
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-primary text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Excel Database Quick Access */}
          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all"
            title="Excel Database Backend Status & Download"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Excel DB</span>
          </button>

          {/* Dual Student Switcher Pill */}
          <button
            onClick={() => switchPersona(currentPersona === 'user_a' ? 'user_b' : 'user_a')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-violet-600/10 hover:bg-violet-600/20 border border-violet-500/30 text-violet-200 text-xs font-medium transition-all"
            title={`Switch view to ${partner.displayName}`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">
              Switch to <strong className="font-semibold text-white">{partner.displayName.split(' ')[0]}</strong>
            </span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[#070A11] animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl glass-dropdown p-3 text-slate-100 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <h4 className="text-xs font-semibold text-white">Notifications</h4>
                  <span className="text-[10px] text-slate-400">{unreadCount} unread</span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">No notifications yet</p>
                  ) : (
                    notifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2 rounded-xl text-left cursor-pointer transition-colors ${
                          n.isRead ? 'bg-slate-900/30 text-slate-400' : 'bg-violet-950/40 border border-violet-500/30 text-slate-200'
                        }`}
                      >
                        <p className="text-xs font-semibold text-white">{n.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setMode(effectiveMode === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title={`Switch to ${effectiveMode === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {effectiveMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-violet-400" />
            )}
          </button>
        </div>
      </header>

      {/* Modals */}
      <QuickTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />
      <MoodShareModal isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)} />
      <ExcelDatabaseModal isOpen={isExcelModalOpen} onClose={() => setIsExcelModalOpen(false)} />
    </>
  );
};
