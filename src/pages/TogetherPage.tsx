// DUO OS — Signature Feature: Shared Real-Time Dual Dashboard
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getUserProfile,
  getTasks,
  getLiveMood,
  getActivityFeed,
  recordActivity,
  getFocusSessions,
  getWorkspace
} from '../lib/store';
import { MoodType, ActivityEventType } from '../lib/types';
import {
  Users2,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Smile,
  ShieldCheck,
  Send,
  Eye,
  EyeOff,
  Radio,
  Timer,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { MoodShareModal } from '../components/together/MoodShareModal';

export const TogetherPage: React.FC = () => {
  const { user, partner, currentPersona, switchPersona } = useAuth();
  const toast = useToast();
  const workspace = getWorkspace();

  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');

  const userA = getUserProfile('user_a');
  const userB = getUserProfile('user_b');

  const tasksA = getTasks(userA.id);
  const tasksB = getTasks(userB.id);

  const moodA = getLiveMood(userA.id);
  const moodB = getLiveMood(userB.id);

  const focusA = getFocusSessions(userA.id);
  const focusB = getFocusSessions(userB.id);

  const activityFeed = getActivityFeed();

  // Metric computations for today (Oct 18, 2026)
  const todayStr = '2026-10-18';
  const todayTasksA = tasksA.filter(t => t.dueDate === todayStr || t.scheduledDate === todayStr);
  const completedA = todayTasksA.filter(t => t.status === 'completed');
  const percentA = todayTasksA.length > 0 ? Math.round((completedA.length / todayTasksA.length) * 100) : 0;

  const todayTasksB = tasksB.filter(t => t.dueDate === todayStr || t.scheduledDate === todayStr);
  const completedB = todayTasksB.filter(t => t.status === 'completed');
  const percentB = todayTasksB.length > 0 ? Math.round((completedB.length / todayTasksB.length) * 100) : 0;

  const handlePostQuickEncouragement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;

    recordActivity({
      workspaceId: workspace.id,
      userId: user.id,
      userName: user.displayName.split(' ')[0],
      userPersona: currentPersona,
      eventType: 'mood_updated',
      summary: `Shared note: "${quickMessage.trim()}"`
    });

    toast.partner('Message sent to shared feed!', quickMessage);
    setQuickMessage('');
  };

  const getMoodEmoji = (mood?: MoodType) => {
    switch (mood) {
      case 'focused': return '🎯';
      case 'motivated': return '⚡';
      case 'happy': return '✨';
      case 'tired': return '😴';
      case 'stressed': return '🌪️';
      case 'low': return '🌧️';
      case 'need_break': return '☕';
      default: return '💫';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/40 via-[#0E1528] to-emerald-950/30 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Workspace Active
            </span>
            <span className="text-xs text-slate-400 font-mono">Code: {workspace.inviteCode}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            {workspace.name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Synchronized co-working space for Garvit & Bittu • Real-time status, focus sessions & activity log.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMoodModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center gap-2"
          >
            <Smile className="w-4 h-4 text-amber-400" />
            Update My Mood
          </button>
        </div>
      </div>

      {/* Side-by-Side Dual Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User A Card (Garvit) */}
        <div className={`p-6 sm:p-7 rounded-3xl border transition-all shadow-2xl relative overflow-hidden ${
          currentPersona === 'user_a'
            ? 'bg-[#0E1529]/90 border-violet-500/40 ring-1 ring-violet-500/20 shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]'
            : 'bg-[#0C1222]/80 border-white/8'
        }`}>
          {currentPersona === 'user_a' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Your Active View
            </div>
          )}

          {/* User Header */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={userA.avatarUrl}
                alt={userA.displayName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500/40"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0E1A] flex items-center justify-center text-[9px] text-white font-bold">
                ✓
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {userA.displayName}
              </h3>
              <p className="text-xs text-violet-300 font-medium">3rd-Year Core Computer Science</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Fixed: Gym 5:30 AM • 6-day College • Tuition 5:30-8 PM</p>
            </div>
          </div>

          {/* Live Mood & Energy State */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-amber-400" /> Current Mood & State
              </span>
              {moodA && !moodA.isPrivate ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                  <span>{getMoodEmoji(moodA.mood)}</span>
                  <span className="capitalize">{moodA.mood}</span>
                  <span>• {moodA.energyLevel}/5 ⚡</span>
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Private
                </span>
              )}
            </div>

            {moodA && !moodA.isPrivate && moodA.message && (
              <p className="text-xs text-slate-300 italic bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                "{moodA.message}"
              </p>
            )}
          </div>

          {/* Today's Progress Bar */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Today's Study Progress</span>
              <span className="text-white font-mono font-bold">{percentA}% ({completedA.length}/{todayTasksA.length} tasks)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${percentA}%` }}
              />
            </div>
          </div>

          {/* Current / Next Priority Commitment */}
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current / Next Activity</span>
              <span className="text-emerald-400 font-mono text-[10px]">Active Now</span>
            </div>
            <p className="text-xs font-semibold text-white">
              Teaching Tuition Batch (17:30 – 19:45)
            </p>
            <p className="text-[11px] text-slate-400">
              Next: Dinner & 20:30 LeetCode Graph Session (50m Focus Block)
            </p>
          </div>

          {/* Switch Button */}
          {currentPersona !== 'user_a' && (
            <button
              onClick={() => switchPersona('user_a')}
              className="mt-5 w-full py-2.5 rounded-xl bg-white/5 hover:bg-violet-600/20 border border-white/10 text-xs font-semibold text-violet-300 hover:text-white transition-all"
            >
              Switch Workspace to Garvit
            </button>
          )}
        </div>

        {/* User B Card (Bittu) */}
        <div className={`p-6 sm:p-7 rounded-3xl border transition-all shadow-2xl relative overflow-hidden ${
          currentPersona === 'user_b'
            ? 'bg-[#0E1529]/90 border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]'
            : 'bg-[#0C1222]/80 border-white/8'
        }`}>
          {currentPersona === 'user_b' && (
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Your Active View
            </div>
          )}

          {/* User Header */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={userB.avatarUrl}
                alt={userB.displayName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/40"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A0E1A] flex items-center justify-center text-[9px] text-white font-bold">
                ✓
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {userB.displayName}
              </h3>
              <p className="text-xs text-emerald-300 font-medium">4th-Year Data Science & Artificial Intelligence</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Fixed: 3-day College (Mon/Wed/Fri) • CAT Nov 2026 Focus</p>
            </div>
          </div>

          {/* Live Mood & Energy State */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-emerald-400" /> Current Mood & State
              </span>
              {moodB && !moodB.isPrivate ? (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span>{getMoodEmoji(moodB.mood)}</span>
                  <span className="capitalize">{moodB.mood}</span>
                  <span>• {moodB.energyLevel}/5 ⚡</span>
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <EyeOff className="w-3 h-3" /> Private
                </span>
              )}
            </div>

            {moodB && !moodB.isPrivate && moodB.message && (
              <p className="text-xs text-slate-300 italic bg-slate-950/50 p-2.5 rounded-xl border border-white/5">
                "{moodB.message}"
              </p>
            )}
          </div>

          {/* Today's Progress Bar */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Today's Study Progress</span>
              <span className="text-white font-mono font-bold">{percentB}% ({completedB.length}/{todayTasksB.length} tasks)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                style={{ width: `${percentB}%` }}
              />
            </div>
          </div>

          {/* Current / Next Priority Commitment */}
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current / Next Activity</span>
              <span className="text-emerald-400 font-mono text-[10px]">Active Now</span>
            </div>
            <p className="text-xs font-semibold text-white">
              Fine-tuning DistilBERT Sentiment Model (18:00 – 19:30)
            </p>
            <p className="text-[11px] text-slate-400">
              Next: 20:15 CAT VARC 4 RC Speed Passage Drill
            </p>
          </div>

          {/* Switch Button */}
          {currentPersona !== 'user_b' && (
            <button
              onClick={() => switchPersona('user_b')}
              className="mt-5 w-full py-2.5 rounded-xl bg-white/5 hover:bg-emerald-600/20 border border-white/10 text-xs font-semibold text-emerald-300 hover:text-white transition-all"
            >
              Switch Workspace to Bittu
            </button>
          )}
        </div>
      </div>

      {/* Shared Real-Time Activity Feed & Live Cheer Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Stream (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Shared Real-Time Activity Feed</h3>
            </div>
            <span className="text-[10px] text-slate-500">Live Timestamped Updates</span>
          </div>

          <div className="space-y-3">
            {activityFeed.map(event => {
              const isA = event.userPersona === 'user_a';
              return (
                <div
                  key={event.id}
                  className="p-3.5 rounded-2xl bg-slate-900/50 border border-white/5 flex items-start gap-3 hover:border-white/10 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    isA ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {isA ? 'A' : 'B'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-white">
                        {event.userName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                      {event.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Share / Encouragement Box */}
        <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Share a Note or Cheer</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Send a quick encouragement note, study update, or break reminder directly to the shared workspace.
          </p>

          <form onSubmit={handlePostQuickEncouragement} className="space-y-3">
            <textarea
              rows={3}
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder={`Cheer on ${partner.displayName.split(' ')[0]} with a quick note...`}
              className="w-full p-3 rounded-2xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Post to Together Feed
            </button>
          </form>

          <div className="p-3 rounded-2xl bg-slate-900/40 border border-white/5 space-y-1.5 text-[11px] text-slate-400">
            <span className="font-semibold text-white flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Consent & Privacy
            </span>
            <p>
              DUO OS is built on mutual respect. You can make tasks private or hide moods anytime from the Mood Modal.
            </p>
          </div>
        </div>
      </div>

      <MoodShareModal isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)} />
    </div>
  );
};
