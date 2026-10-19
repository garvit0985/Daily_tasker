// DUO OS — Immersive Focus Mode, Pomodoro, 6 Categories & Day-End Report
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { recordFocusSession, getDailyCategoryStats } from '../lib/store';
import { ambientSound } from '../lib/sounds';
import { FocusModeType, SixCategory } from '../lib/types';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Target,
  Zap,
  Code2,
  Briefcase,
  BookOpen,
  Gamepad2,
  Edit3
} from 'lucide-react';
import { SessionReasonModal } from '../components/focus/SessionReasonModal';
import { DayEndReportCard } from '../components/focus/DayEndReportCard';
import confetti from 'canvas-confetti';

const CATEGORY_TAGS: Record<SixCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; badge: string }> = {
  cat: { label: 'CAT 2026/27', icon: Target, color: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  gate: { label: 'GATE DA/CS', icon: Zap, color: 'text-sky-400', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  dsa: { label: 'DSA & Coding', icon: Code2, color: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  job_apply: { label: 'Job Apply', icon: Briefcase, color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  academics: { label: 'Academics', icon: BookOpen, color: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  entertainment: { label: 'Entertainment (≤1h)', icon: Gamepad2, color: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
};

export const FocusPage: React.FC = () => {
  const { user, partner } = useAuth();
  const toast = useToast();

  const [category, setCategory] = useState<SixCategory>('cat');
  const [sessionReason, setSessionReason] = useState('CAT Sectional Sprint');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionSlot, setSessionSlot] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<'rain' | 'binaural' | 'white_noise' | 'cafe' | 'none'>('rain');
  const [soundVolume, setSoundVolume] = useState(0.4);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stats = getDailyCategoryStats(user.id);
  const timerRef = useRef<number | null>(null);

  // Sound control
  useEffect(() => {
    if (isRunning && selectedSound !== 'none') {
      ambientSound.play(selectedSound);
      ambientSound.setVolume(soundVolume);
    } else {
      ambientSound.stop();
    }
    return () => {
      ambientSound.stop();
    };
  }, [isRunning, selectedSound]);

  const handleVolumeChange = (vol: number) => {
    setSoundVolume(vol);
    ambientSound.setVolume(vol);
  };

  // Timer countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStart = () => {
    if (category === 'entertainment' && stats.entertainmentRemainingMinutes <= 0) {
      alert('Entertainment limit of 1 hour (60 minutes) has already been reached for today!');
      return;
    }
    if (!sessionStartTime) {
      setSessionStartTime(new Date());
    }
    setIsRunning(true);
    toast.success('Timer Started!', `Focusing on: "${sessionReason}"`);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    setSessionStartTime(null);
    setSessionSlot(null);
    ambientSound.stop();
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    ambientSound.stop();

    const elapsed = totalSeconds - timeLeft;
    const mins = Math.max(1, Math.round(elapsed / 60));

    const endD = new Date();
    const startD = sessionStartTime || new Date(endD.getTime() - mins * 60 * 1000);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const startStr = `${pad(startD.getHours())}:${pad(startD.getMinutes())}`;
    const endStr = `${pad(endD.getHours())}:${pad(endD.getMinutes())}`;
    const calculatedSlot = sessionSlot || `${startStr} – ${endStr}`;
    const dateStr = endD.toISOString().slice(0, 10);

    recordFocusSession({
      userId: user.id,
      category,
      reason: sessionReason,
      durationMinutes: mins,
      mode: 'custom',
      ambientSound: selectedSound,
      sharedWithPartner: true,
      startTime: startStr,
      endTime: endStr,
      timeSlot: calculatedSlot,
      date: dateStr
    });

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 }
    });

    toast.success(
      `Added to Time Slot (${calculatedSlot})!`,
      `Great job! Logged ${mins}m work for ${category.toUpperCase()}: "${sessionReason}" in your daily schedule.`
    );
    setTimeLeft(totalSeconds);
    setSessionStartTime(null);
    setSessionSlot(null);
  };

  const handleStartFromModal = (info: {
    category: SixCategory;
    reason: string;
    durationMinutes: number;
    startTime?: string;
    endTime?: string;
    timeSlot?: string;
    date?: string;
  }) => {
    setCategory(info.category);
    setSessionReason(info.reason);
    const secs = info.durationMinutes * 60;
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setSessionSlot(info.timeSlot || null);
    setSessionStartTime(new Date());
    setIsRunning(true);
  };

  const handleLogCompletedDirectly = (info: {
    category: SixCategory;
    reason: string;
    durationMinutes: number;
    startTime?: string;
    endTime?: string;
    timeSlot?: string;
    date?: string;
  }) => {
    recordFocusSession({
      userId: user.id,
      category: info.category,
      reason: info.reason,
      durationMinutes: info.durationMinutes,
      mode: 'custom',
      ambientSound: 'none',
      sharedWithPartner: true,
      startTime: info.startTime,
      endTime: info.endTime,
      timeSlot: info.timeSlot,
      date: info.date
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });

    const slotLabel = info.timeSlot ? ` in slot ${info.timeSlot}` : '';
    toast.success(
      'Work Added to Schedule!',
      `Logged ${info.durationMinutes}m for ${info.category.toUpperCase()}${slotLabel}: "${info.reason}"`
    );
  };

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);
  const currentCatConfig = CATEGORY_TAGS[category] || CATEGORY_TAGS.cat;
  const CatIcon = currentCatConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Timer className="w-6 h-6 text-violet-400" /> Focus Engine & Timer
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Set your session reason, select one of the 6 categories, and log your progress to the Day-End Report.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5 shadow-lg"
          >
            <Edit3 className="w-4 h-4" /> Change Reason / Category
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/8 text-xs"
            title="Toggle Fullscreen Focus"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0E1528] to-[#0A0E1A] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center space-y-6">
        {/* Active Session Reason Card */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${currentCatConfig.badge}`}>
              <CatIcon className={`w-3.5 h-3.5 ${currentCatConfig.color}`} />
              {currentCatConfig.label}
            </span>

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[11px] text-slate-400 hover:text-white underline"
            >
              Change
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white max-w-lg">
            &ldquo;{sessionReason}&rdquo;
          </h3>

          {category === 'entertainment' && (
            <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              Entertainment Time: {stats.entertainmentMinutes} / 60 mins logged today (Max 1 hr)
            </span>
          )}
        </div>

        {/* Circular Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-slate-800/80"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-violet-500 transition-all duration-1000 ease-linear"
              strokeWidth="7"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {Math.round(totalSeconds / 60)}m target
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-2xl btn-primary text-sm font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              <Play className="w-5 h-5 fill-white" /> Start Timer
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              <Pause className="w-5 h-5 fill-slate-950" /> Pause Timer
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/8 transition-colors"
            title="Reset Countdown"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCompleteSession}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg hover:scale-105"
            title="End timer and add to daily schedule time slot"
          >
            <CheckCircle2 className="w-4 h-4" /> End Timer & Add to Time Slot
          </button>
        </div>

        {/* Live Slot Preview */}
        {timeLeft < totalSeconds && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
            <Clock className="w-3.5 h-3.5 text-violet-400" />
            <span>Adding {Math.max(1, Math.round((totalSeconds - timeLeft) / 60))}m work to schedule time slot on completion</span>
          </div>
        )}

        {/* Sound Ambience Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-white/5 w-full max-w-md">
          <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5" /> Ambience:
          </span>

          {(['none', 'rain', 'binaural', 'cafe', 'white_noise'] as const).map(snd => (
            <button
              key={snd}
              onClick={() => setSelectedSound(snd)}
              className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors capitalize ${
                selectedSound === snd
                  ? 'bg-violet-600 text-white border-violet-500'
                  : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {snd.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Day-End Progress Report (Always visible at the bottom) */}
      <DayEndReportCard
        userId={user.id}
        userName={user.displayName}
        onOpenSessionModal={() => setIsModalOpen(true)}
      />

      {/* Session Reason Dialogue Modal */}
      <SessionReasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={user.id}
        defaultCategory={category}
        onStartTimer={handleStartFromModal}
        onLogCompletedDirectly={handleLogCompletedDirectly}
      />
    </div>
  );
};
