// DUO OS — Settings, Theme Customization & Supabase Integration
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  saveSupabaseCredentials,
  getSupabaseCredentials,
  isSupabaseConfigured
} from '../lib/supabase';
import { resetToSeedData, resetAllProgressToZero } from '../lib/store';
import {
  Settings,
  Palette,
  Clock,
  Database,
  Shield,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Laptop,
  Check,
  User,
  Sliders
} from 'lucide-react';

const ACCENT_COLORS: { id: 'violet' | 'indigo' | 'mint' | 'sky' | 'coral'; label: string; hex: string }[] = [
  { id: 'violet', label: 'Electric Violet', hex: '#8B5CF6' },
  { id: 'indigo', label: 'Deep Indigo', hex: '#6366F1' },
  { id: 'mint', label: 'Fresh Mint', hex: '#10B981' },
  { id: 'sky', label: 'Electric Sky', hex: '#38BDF8' },
  { id: 'coral', label: 'Warm Coral', hex: '#F43F5E' }
];

export const SettingsPage: React.FC = () => {
  const { user, partner, updateProfile } = useAuth();
  const { theme, setMode, setAccent, effectiveMode } = useTheme();
  const toast = useToast();

  const [creds, setCreds] = useState(getSupabaseCredentials());
  const [isCloudConfigured, setIsCloudConfigured] = useState(isSupabaseConfigured());

  // Fixed Commitments Form state
  const [gymTime, setGymTime] = useState(user.fixedCommitments.gymTime);
  const [gymDuration, setGymDuration] = useState(user.fixedCommitments.gymDurationMinutes);
  const [collegeStart, setCollegeStart] = useState(user.fixedCommitments.collegeStartTime);
  const [collegeEnd, setCollegeEnd] = useState(user.fixedCommitments.collegeEndTime);
  const [tuitionEnabled, setTuitionEnabled] = useState(user.fixedCommitments.tuitionEnabled);
  const [tuitionStart, setTuitionStart] = useState(user.fixedCommitments.tuitionStartTime);
  const [tuitionEnd, setTuitionEnd] = useState(user.fixedCommitments.tuitionEndTime);
  const [sleepStart, setSleepStart] = useState(user.fixedCommitments.protectedSleepStart);
  const [sleepEnd, setSleepEnd] = useState(user.fixedCommitments.protectedSleepEnd);

  const handleSaveCommitments = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...user,
      fixedCommitments: {
        ...user.fixedCommitments,
        gymTime,
        gymDurationMinutes: Number(gymDuration),
        collegeStartTime: collegeStart,
        collegeEndTime: collegeEnd,
        tuitionEnabled,
        tuitionStartTime: tuitionStart,
        tuitionEndTime: tuitionEnd,
        protectedSleepStart: sleepStart,
        protectedSleepEnd: sleepEnd
      }
    });
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(creds.url, creds.anonKey);
    const configured = isSupabaseConfigured();
    setIsCloudConfigured(configured);

    if (configured) {
      toast.success('Supabase Connected!', 'Real-time synchronization with cloud database enabled.');
    } else {
      toast.info('Saved credentials', 'Operating in local offline-first mode.');
    }
  };

  const handleResetProgressToZero = () => {
    if (window.confirm('Reset all progress to 0%? All tasks will be moved to planned, syllabus topics reset to 0%, and mock test records cleared so you can log everything manually.')) {
      resetAllProgressToZero();
      toast.success('Progress Reset to 0%!', 'All tasks, topics, and mocks are reset. You can now manually check off your completed work.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to clean seed state (October 18, 2026)?')) {
      resetToSeedData();
      toast.success('Reset completed', 'Loaded original seed dataset.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-violet-400" /> Settings & Cloud Configuration
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Personalize themes, protected schedule boundaries, and connect Supabase for cross-device sync.
          </p>
        </div>
      </div>

      {/* 1. Theme Customization */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Palette className="w-4 h-4 text-violet-400" /> Theme & Appearance
        </div>

        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Color Scheme Mode</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setMode('dark')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                theme.mode === 'dark'
                  ? 'bg-violet-600/20 border-violet-500 text-white shadow-md'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-violet-400" /> Deep Dark
            </button>
            <button
              onClick={() => setMode('light')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                theme.mode === 'light'
                  ? 'bg-violet-600/20 border-violet-500 text-white shadow-md'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" /> Clean Light
            </button>
            <button
              onClick={() => setMode('system')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                theme.mode === 'system'
                  ? 'bg-violet-600/20 border-violet-500 text-white shadow-md'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-4 h-4 text-sky-400" /> System Auto
            </button>
          </div>
        </div>

        {/* Accent Color Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Accent Highlight Color</label>
          <div className="flex flex-wrap gap-2.5">
            {ACCENT_COLORS.map(c => {
              const isSelected = theme.accent === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setAccent(c.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white/10 border-white/30 text-white shadow-sm'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
                  <span>{c.label}</span>
                  {isSelected && <Check className="w-3 h-3 text-white ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Fixed Commitments & Non-Negotiable Hours */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Clock className="w-4 h-4 text-emerald-400" /> Protected Schedule Boundaries & Fixed Hours
        </div>
        <p className="text-xs text-slate-400">
          The Smart Planner will strictly protect these time blocks and will never schedule over them.
        </p>

        <form onSubmit={handleSaveCommitments} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Morning Gym Time</label>
              <input
                type="time"
                value={gymTime}
                onChange={(e) => setGymTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gym Duration (Mins)</label>
              <input
                type="number"
                value={gymDuration}
                onChange={(e) => setGymDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College Start Time</label>
              <input
                type="time"
                value={collegeStart}
                onChange={(e) => setCollegeStart(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College End Time</label>
              <input
                type="time"
                value={collegeEnd}
                onChange={(e) => setCollegeEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={tuitionEnabled}
                onChange={(e) => setTuitionEnabled(e.target.checked)}
                className="rounded bg-slate-800 text-violet-600"
              />
              Tuition Teaching Batch Enabled (User A commitment)
            </label>

            {tuitionEnabled && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-slate-400">Tuition Start Time</span>
                  <input
                    type="time"
                    value={tuitionStart}
                    onChange={(e) => setTuitionStart(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Tuition End Time</span>
                  <input
                    type="time"
                    value={tuitionEnd}
                    onChange={(e) => setTuitionEnd(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Protected Sleep Start Time</label>
              <input
                type="time"
                value={sleepStart}
                onChange={(e) => setSleepStart(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Wake Up Time</label>
              <input
                type="time"
                value={sleepEnd}
                onChange={(e) => setSleepEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
              />
            </div>
          </div>

          <button type="submit" className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold">
            Save Commitment Constraints
          </button>
        </form>
      </div>

      {/* 3. Supabase Cloud Database Integration */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Database className="w-4 h-4 text-sky-400" /> Supabase Realtime & Cloud Sync
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
            isCloudConfigured
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {isCloudConfigured ? 'Connected to Cloud' : 'Local Offline-First Mode (Active)'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          DUO OS operates in high-speed local mode with cross-tab BroadcastChannel sync out of the box. Paste your Supabase project credentials below to enable cloud backup and remote device synchronization.
        </p>

        <form onSubmit={handleSaveSupabase} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Supabase Project URL</label>
            <input
              type="url"
              value={creds.url}
              onChange={(e) => setCreds({ ...creds, url: e.target.value })}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Supabase Public Anon Key</label>
            <input
              type="password"
              value={creds.anonKey}
              onChange={(e) => setCreds({ ...creds, anonKey: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Migration SQL file ready in <code className="text-slate-400">supabase/migrations/</code>
            </span>
            <button type="submit" className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold">
              Save Credentials
            </button>
          </div>
        </form>
      </div>

      {/* 4. Reset & Progress Management */}
      <div className="space-y-4">
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-violet-400" /> Reset Progress to 0%
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sets all tasks to planned (0% completed), resets syllabus topics to uncompleted, and clears mock test scores so you can manually check off and log what you have completed.
            </p>
          </div>
          <button
            onClick={handleResetProgressToZero}
            className="px-4 py-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Progress to 0%
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-white">Reset Entire Workspace to Seed State</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Restores original October 18, 2026 timetable, subjects and default profile settings.</p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Full Workspace Reset
          </button>
        </div>
      </div>
    </div>
  );
};
