// DUO OS — Simplified 6-Box Command Dashboard & Day-End Report
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getDailyCategoryStats,
  recordFocusSession,
  getLiveMood
} from '../lib/store';
import { SixCategory, FocusSession } from '../lib/types';
import { ambientSound } from '../lib/sounds';
import {
  Target,
  Zap,
  Code2,
  Briefcase,
  BookOpen,
  Gamepad2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ArrowLeftRight,
  Sparkles,
  Smile,
  Clock,
  Calendar,
  AlertTriangle,
  Volume2,
  VolumeX,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { SessionReasonModal } from '../components/focus/SessionReasonModal';
import { DayEndReportCard } from '../components/focus/DayEndReportCard';
import { MoodShareModal } from '../components/together/MoodShareModal';
import confetti from 'canvas-confetti';

interface SixBoxConfig {
  id: SixCategory;
  title: string;
  subtitle: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  hoverBorder: string;
  badgeBg: string;
  isEntertainment?: boolean;
}

const SIX_BOXES: SixBoxConfig[] = [
  {
    id: 'cat',
    title: 'CAT',
    subtitle: 'Sectionals, DILR Sets, QA & VARC',
    tag: 'CAT 2026 / 2027 Sprint',
    icon: Target,
    accentColor: 'text-violet-400',
    bgColor: 'bg-[#0E1326]',
    borderColor: 'border-violet-500/20',
    hoverBorder: 'hover:border-violet-500/40',
    badgeBg: 'bg-violet-500/15 text-violet-300 border-violet-500/30'
  },
  {
    id: 'gate',
    title: 'GATE',
    subtitle: 'Data Science, AI & Core Engineering',
    tag: 'GATE DA / GATE CS',
    icon: Zap,
    accentColor: 'text-sky-400',
    bgColor: 'bg-[#0B1528]',
    borderColor: 'border-sky-500/20',
    hoverBorder: 'hover:border-sky-500/40',
    badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
  },
  {
    id: 'dsa',
    title: 'DSA',
    subtitle: 'LeetCode, Graph & Dynamic Programming',
    tag: 'Algorithms & Coding',
    icon: Code2,
    accentColor: 'text-emerald-400',
    bgColor: 'bg-[#0A1820]',
    borderColor: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'job_apply',
    title: 'Job Apply',
    subtitle: 'SWE Internships, Applications & Resumes',
    tag: 'Career & Assessments',
    icon: Briefcase,
    accentColor: 'text-amber-400',
    bgColor: 'bg-[#181510]',
    borderColor: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/40',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  },
  {
    id: 'academics',
    title: 'Academics',
    subtitle: 'Semester Subjects, Labs & Attendance',
    tag: 'NIT Coursework',
    icon: BookOpen,
    accentColor: 'text-purple-400',
    bgColor: 'bg-[#140F24]',
    borderColor: 'border-purple-500/20',
    hoverBorder: 'hover:border-purple-500/40',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    subtitle: 'Media, YouTube, Gaming & Relax',
    tag: 'Max 1 Hour Daily Cap',
    icon: Gamepad2,
    accentColor: 'text-rose-400',
    bgColor: 'bg-[#1C0E14]',
    borderColor: 'border-rose-500/25',
    hoverBorder: 'hover:border-rose-500/50',
    badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    isEntertainment: true
  }
];

export const DashboardPage: React.FC = () => {
  const { user, partner, currentPersona, switchPersona } = useAuth();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<SixCategory>('cat');

  // Active Timer state
  const [activeSession, setActiveSession] = useState<{
    category: SixCategory;
    reason: string;
    totalSeconds: number;
    timeLeft: number;
    isRunning: boolean;
  } | null>(null);

  const [ambientActive, setAmbientActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  const stats = getDailyCategoryStats(user.id);
  const currentMood = getLiveMood(user.id);

  // Sound handler
  useEffect(() => {
    if (activeSession?.isRunning && ambientActive) {
      ambientSound.play('rain');
    } else {
      ambientSound.stop();
    }
    return () => {
      ambientSound.stop();
    };
  }, [activeSession?.isRunning, ambientActive]);

  // Timer countdown
  useEffect(() => {
    if (activeSession?.isRunning) {
      timerRef.current = window.setInterval(() => {
        setActiveSession(prev => {
          if (!prev) return null;
          if (prev.timeLeft <= 1) {
            handleCompleteActiveSession(prev);
            return null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeSession?.isRunning]);

  const handleStartTimerFromModal = (info: { category: SixCategory; reason: string; durationMinutes: number }) => {
    const totalSecs = info.durationMinutes * 60;
    setActiveSession({
      category: info.category,
      reason: info.reason,
      totalSeconds: totalSecs,
      timeLeft: totalSecs,
      isRunning: true
    });

    toast.success(`Started ${info.durationMinutes}m Session!`, `Category: ${info.category.toUpperCase()} • "${info.reason}"`);
  };

  const handleLogCompletedDirectly = (info: { category: SixCategory; reason: string; durationMinutes: number }) => {
    recordFocusSession({
      userId: user.id,
      category: info.category,
      reason: info.reason,
      durationMinutes: info.durationMinutes,
      mode: 'custom',
      ambientSound: 'none',
      sharedWithPartner: true
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });

    toast.success('Added to Day-End Report!', `Logged ${info.durationMinutes}m for ${info.category.toUpperCase()}`);
  };

  const handleCompleteActiveSession = (sessionToComplete = activeSession) => {
    if (!sessionToComplete) return;

    if (timerRef.current) clearInterval(timerRef.current);
    ambientSound.stop();

    const elapsedSeconds = sessionToComplete.totalSeconds - sessionToComplete.timeLeft;
    // Minimum 1 min recorded if completed
    const mins = Math.max(1, Math.round(elapsedSeconds / 60));

    recordFocusSession({
      userId: user.id,
      category: sessionToComplete.category,
      reason: sessionToComplete.reason,
      durationMinutes: mins,
      mode: 'custom',
      ambientSound: ambientActive ? 'rain' : 'none',
      sharedWithPartner: true
    });

    setActiveSession(null);

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#10B981', '#38BDF8', '#F59E0B']
    });

    toast.success('Session Finished & Logged!', `Added ${mins}m to today's Day-End Progress Report.`);
  };

  const handleOpenCategoryModal = (cat?: SixCategory) => {
    setModalCategory(cat || 'cat');
    setIsModalOpen(true);
  };

  const formatTimerDigits = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatHoursMinutes = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Simplified Header Banner */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {user.degreeProgram}
            </span>
            <span className="text-xs text-slate-400 font-mono">Sunday, Oct 18, 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 flex items-center gap-2">
            Welcome, {user.displayName}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Ultra-focused daily dashboard • Track your study blocks across the 6 boxes.
          </p>
        </div>

        {/* Quick Top Stats & Persona Switch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-white/8 text-xs font-mono space-y-0.5">
            <div className="text-[10px] text-slate-400 uppercase">Productive Study</div>
            <div className="text-emerald-400 font-bold text-sm">
              {formatHoursMinutes(stats.productiveMinutes)}
            </div>
          </div>

          <div className={`px-3.5 py-2 rounded-2xl border text-xs font-mono space-y-0.5 ${
            stats.isEntertainmentExceeded
              ? 'bg-rose-950/40 border-rose-500/40'
              : 'bg-slate-900/80 border-white/8'
          }`}>
            <div className="text-[10px] text-slate-400 uppercase">Entertainment</div>
            <div className={`font-bold text-sm ${stats.isEntertainmentExceeded ? 'text-rose-400' : 'text-slate-200'}`}>
              {stats.entertainmentMinutes} / 60m
            </div>
          </div>

          <button
            onClick={() => switchPersona(currentPersona === 'user_a' ? 'user_b' : 'user_a')}
            className="px-3.5 py-2 rounded-2xl bg-violet-600/15 hover:bg-violet-600/25 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title={`Switch to ${partner.displayName}`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Switch to {partner.displayName.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* 2. ACTIVE LIVE TIMER (If running) */}
      {activeSession && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950/50 via-[#11172E] to-slate-950 border border-violet-500/40 shadow-2xl space-y-4 animate-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase">
                  {activeSession.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Timer In Progress
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">
                &ldquo;{activeSession.reason}&rdquo;
              </h3>
            </div>

            {/* Countdown Digits */}
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                {formatTimerDigits(activeSession.timeLeft)}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {Math.round(activeSession.totalSeconds / 60)} minute planned sprint
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSession({ ...activeSession, isRunning: !activeSession.isRunning })}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg"
              >
                {activeSession.isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" /> Resume
                  </>
                )}
              </button>

              <button
                onClick={() => setAmbientActive(!ambientActive)}
                className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  ambientActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Rain Ambience"
              >
                {ambientActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>Rain Sound {ambientActive ? 'On' : 'Off'}</span>
              </button>
            </div>

            <button
              onClick={() => handleCompleteActiveSession()}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg ml-auto"
            >
              <CheckCircle2 className="w-4 h-4" /> End & Add to Day-End Report
            </button>
          </div>
        </div>
      )}

      {/* 3. THE 6 BOXES — Central Clean Interface */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" /> Focus Categories (6 Boxes)
            </h3>
            <p className="text-[11px] text-slate-400">
              Click &ldquo;Start Timer&rdquo; or &ldquo;Log Completed&rdquo; on any box to track what you did.
            </p>
          </div>

          <span className="text-[11px] text-rose-300 font-semibold bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
            Entertainment Cap: Max 1h / Day
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SIX_BOXES.map(box => {
            const Icon = box.icon;
            const catStats = stats.categoryTotals[box.id];
            const isEnt = box.isEntertainment;
            const isEntCapped = isEnt && stats.isEntertainmentExceeded;

            return (
              <div
                key={box.id}
                className={`p-5 rounded-3xl ${box.bgColor} border ${box.borderColor} ${box.hoverBorder} shadow-xl transition-all duration-200 flex flex-col justify-between gap-4`}
              >
                {/* Box Top */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${box.badgeBg}`}>
                      {box.tag}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5">
                      <Icon className={`w-5 h-5 ${box.accentColor}`} />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white">{box.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{box.subtitle}</p>
                  </div>
                </div>

                {/* Box Metrics */}
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Logged Today:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      {catStats.minutes} mins
                    </span>
                  </div>

                  {isEnt ? (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isEntCapped ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-amber-400'
                          }`}
                          style={{ width: `${Math.min(100, Math.round((catStats.minutes / 60) * 100))}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={stats.entertainmentRemainingMinutes > 0 ? 'text-slate-400' : 'text-rose-400 font-bold'}>
                          {stats.entertainmentRemainingMinutes > 0 ? `${stats.entertainmentRemainingMinutes}m left` : '1h limit reached'}
                        </span>
                        <span className="text-slate-500 font-mono">Max 60m</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 font-mono">
                      {catStats.count} {catStats.count === 1 ? 'completed session' : 'completed sessions'}
                    </div>
                  )}
                </div>

                {/* Box Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleOpenCategoryModal(box.id)}
                    disabled={isEnt && stats.entertainmentRemainingMinutes <= 0}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                      isEnt && stats.entertainmentRemainingMinutes <= 0
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                        : 'btn-primary'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-white" /> Start Timer
                  </button>

                  <button
                    onClick={() => handleOpenCategoryModal(box.id)}
                    className="py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/8 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3 text-slate-400" /> Log Done
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. DAY-END PROGRESS REPORT CARD */}
      <DayEndReportCard
        userId={user.id}
        userName={user.displayName}
        onOpenSessionModal={handleOpenCategoryModal}
      />

      {/* Session Reason Dialogue Modal */}
      <SessionReasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user.id}
        defaultCategory={modalCategory}
        onStartTimer={handleStartTimerFromModal}
        onLogCompletedDirectly={handleLogCompletedDirectly}
      />

      {/* Mood Checkin Modal */}
      <MoodShareModal
        isOpen={isMoodModalOpen}
        onClose={() => setIsMoodModalOpen(false)}
      />
    </div>
  );
};
