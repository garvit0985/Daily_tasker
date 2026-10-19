// DUO OS — Session Reason & Category Dialogue Box
import React, { useState, useEffect } from 'react';
import { SixCategory } from '../../lib/types';
import { getDailyCategoryStats } from '../../lib/store';
import {
  Timer,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Play,
  Check,
  Clock,
  Gamepad2,
  BookOpen,
  Code2,
  Briefcase,
  Target,
  Zap
} from 'lucide-react';

interface SessionReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  defaultCategory?: SixCategory;
  defaultReason?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  onStartTimer: (sessionInfo: {
    category: SixCategory;
    reason: string;
    durationMinutes: number;
    startTime?: string;
    endTime?: string;
    timeSlot?: string;
    date?: string;
  }) => void;
  onLogCompletedDirectly: (sessionInfo: {
    category: SixCategory;
    reason: string;
    durationMinutes: number;
    startTime?: string;
    endTime?: string;
    timeSlot?: string;
    date?: string;
  }) => void;
}

const CATEGORY_CONFIG: {
  id: SixCategory;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgActive: string;
  borderActive: string;
  chips: string[];
}[] = [
  {
    id: 'cat',
    title: 'CAT',
    subtitle: 'DILR, QA & VARC',
    icon: Target,
    color: 'text-violet-400',
    bgActive: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
    borderActive: 'border-violet-500/50',
    chips: ['DILR Matrix Sets', 'QA Arithmetic Practice', 'VARC 4 RC Passages', 'Sectional Speed Test', 'Formula Revision']
  },
  {
    id: 'gate',
    title: 'GATE',
    subtitle: 'DA / Core CS',
    icon: Zap,
    color: 'text-sky-400',
    bgActive: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    borderActive: 'border-sky-500/50',
    chips: ['Linear Algebra & Matrices', 'Probability & Statistics', 'Machine Learning Fundamentals', 'Algorithms & TOC', 'Previous Year Questions']
  },
  {
    id: 'dsa',
    title: 'DSA',
    subtitle: 'LeetCode & Coding',
    icon: Code2,
    color: 'text-emerald-400',
    bgActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    borderActive: 'border-emerald-500/50',
    chips: ['LeetCode Daily Problem', 'Graph Shortest Path', 'Dynamic Programming', 'Binary Trees & BST', 'Blind 75 Revision']
  },
  {
    id: 'job_apply',
    title: 'Job Apply',
    subtitle: 'Career & Internships',
    icon: Briefcase,
    color: 'text-amber-400',
    bgActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    borderActive: 'border-amber-500/50',
    chips: ['Resume Customization', 'Google Summer 2027 Portal', 'Microsoft Codility Practice', 'LinkedIn Networking', 'Cold Emails & Portfolio']
  },
  {
    id: 'academics',
    title: 'Academics',
    subtitle: 'Semester Subjects & Labs',
    icon: BookOpen,
    color: 'text-purple-400',
    bgActive: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    borderActive: 'border-purple-500/50',
    chips: ['Computer Networks Routing', 'DBMS SQL & Normalization', 'Operating Systems Labs', 'Deep Learning Assignment', 'Lab Report Submission']
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    subtitle: 'Max 1 Hr Daily',
    icon: Gamepad2,
    color: 'text-rose-400',
    bgActive: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    borderActive: 'border-rose-500/50',
    chips: ['YouTube Tech / Casual', 'Anime Episode (20m)', 'Gaming Match (30m)', 'Music & Social Break', 'Podcast & Tea']
  }
];

export const SessionReasonModal: React.FC<SessionReasonModalProps> = ({
  isOpen,
  onClose,
  userId,
  defaultCategory = 'cat',
  defaultReason = '',
  defaultStartTime,
  defaultEndTime,
  onStartTimer,
  onLogCompletedDirectly
}) => {
  const [category, setCategory] = useState<SixCategory>(defaultCategory);
  const [reason, setReason] = useState(defaultReason);
  const [duration, setDuration] = useState(25);
  const [customDuration, setCustomDuration] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  // Time slot calculation
  const pad = (n: number) => n.toString().padStart(2, '0');
  const getTimesForDuration = (mins: number) => {
    const end = new Date();
    const start = new Date(end.getTime() - mins * 60 * 1000);
    return {
      startStr: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
      endStr: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
      dateStr: end.toISOString().slice(0, 10)
    };
  };

  const initialTimes = getTimesForDuration(25);
  const [startTime, setStartTime] = useState(defaultStartTime || initialTimes.startStr);
  const [endTime, setEndTime] = useState(defaultEndTime || initialTimes.endStr);
  const [date, setDate] = useState(initialTimes.dateStr);

  const stats = getDailyCategoryStats(userId);
  const entertainmentSpent = stats.entertainmentMinutes;
  const entertainmentRemaining = stats.entertainmentRemainingMinutes;

  useEffect(() => {
    if (defaultCategory) {
      setCategory(defaultCategory);
      if (defaultCategory === 'entertainment') {
        const defaultEntTime = Math.min(25, entertainmentRemaining);
        setDuration(defaultEntTime > 0 ? defaultEntTime : 15);
      }
    }
    if (defaultReason) {
      setReason(defaultReason);
    }
    if (defaultStartTime) setStartTime(defaultStartTime);
    if (defaultEndTime) setEndTime(defaultEndTime);
  }, [defaultCategory, defaultReason, defaultStartTime, defaultEndTime, isOpen, entertainmentRemaining]);

  if (!isOpen) return null;

  const currentConfig = CATEGORY_CONFIG.find(c => c.id === category) || CATEGORY_CONFIG[0];
  const isEntertainment = category === 'entertainment';

  const handleSelectCategory = (cat: SixCategory) => {
    setCategory(cat);
    if (cat === 'entertainment') {
      if (duration > 60) setDuration(60);
      if (entertainmentRemaining > 0 && duration > entertainmentRemaining) {
        setDuration(entertainmentRemaining);
      }
    }
  };

  const handleSelectDuration = (mins: number) => {
    setIsCustom(false);
    const chosenDuration = isEntertainment ? Math.min(60, mins) : mins;
    setDuration(chosenDuration);
    const t = getTimesForDuration(chosenDuration);
    setStartTime(t.startStr);
    setEndTime(t.endStr);
  };

  const handleCustomDurationChange = (val: string) => {
    setCustomDuration(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      const chosenDuration = isEntertainment ? Math.min(60, num) : num;
      setDuration(chosenDuration);
      const t = getTimesForDuration(chosenDuration);
      setStartTime(t.startStr);
      setEndTime(t.endStr);
    }
  };

  const effectiveDuration = isCustom ? (parseInt(customDuration, 10) || 25) : duration;
  const finalDuration = isEntertainment ? Math.min(60, effectiveDuration) : effectiveDuration;

  const handleSubmit = (startTimer: boolean) => {
    const finalReason = reason.trim() || `${currentConfig.title} Focus Session`;
    
    // Check entertainment cap
    if (isEntertainment) {
      if (entertainmentRemaining <= 0) {
        alert('Daily Entertainment limit of 1 hour (60 minutes) has already been reached for today! Focus on study goals first.');
        return;
      }
      if (finalDuration > entertainmentRemaining) {
        alert(`You only have ${entertainmentRemaining} minutes remaining in today's 1-hour entertainment limit. Session duration adjusted to ${entertainmentRemaining} mins.`);
      }
    }

    const payloadDuration = isEntertainment ? Math.min(finalDuration, entertainmentRemaining > 0 ? entertainmentRemaining : 60) : finalDuration;
    const finalTimeSlot = `${startTime} – ${endTime}`;

    if (startTimer) {
      onStartTimer({
        category,
        reason: finalReason,
        durationMinutes: payloadDuration,
        startTime,
        endTime,
        timeSlot: finalTimeSlot,
        date
      });
    } else {
      onLogCompletedDirectly({
        category,
        reason: finalReason,
        durationMinutes: payloadDuration,
        startTime,
        endTime,
        timeSlot: finalTimeSlot,
        date
      });
    }

    setReason('');
    setCustomDuration('');
    setIsCustom(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0D1322] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dialog Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Focus Session
            </span>
            <span className="text-xs text-slate-400">Kis chiz ka session hai?</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Timer className="w-5 h-5 text-violet-400" /> Start or Log Study Session
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select one of the 6 categories, type your session reason, and set your timer.
          </p>
        </div>

        {/* 1. Category Selector (The 6 Boxes) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Category (6 Boxes):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORY_CONFIG.map(cat => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;
              const isEnt = cat.id === 'entertainment';

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? `${cat.bgActive} ${cat.borderActive} shadow-lg ring-1 ring-white/20`
                      : 'bg-slate-900/60 border-white/5 hover:border-white/15 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span className="text-xs font-bold block text-white">{cat.title}</span>
                  <span className="text-[10px] text-slate-400 block line-clamp-1">{cat.subtitle}</span>
                  {isEnt && (
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      ≤ 1 Hr Cap
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Entertainment Cap Notice */}
        {isEntertainment && (
          <div className={`p-3 rounded-2xl border text-xs flex items-start gap-2.5 ${
            entertainmentRemaining <= 0
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          }`}>
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-white">Entertainment Rule: Strictly ≤ 1 Hour per Day</p>
              <p className="text-[11px] text-slate-300">
                Today logged: <strong className="text-white">{entertainmentSpent} / 60 mins</strong>.
                {entertainmentRemaining > 0 ? (
                  <span> Remaining today: <strong className="text-emerald-400">{entertainmentRemaining} mins</strong>.</span>
                ) : (
                  <span className="text-rose-400 font-bold block mt-0.5">⚠️ Maximum 1 hour limit reached for today!</span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* 2. Session Reason / Kya padh rahe ho */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Kis Chiz Ka Session Hai? (Specific Topic / Reason)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`E.g., ${currentConfig.chips[0] || 'Specific study topic'}`}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />

          {/* Quick chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {currentConfig.chips.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => setReason(chip)}
                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-[11px] text-slate-300 hover:text-white transition-colors"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Duration Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Session Duration:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {[15, 25, 45, 50, 60].map(mins => {
              const isDisabled = isEntertainment && mins > Math.min(60, entertainmentRemaining > 0 ? entertainmentRemaining : 60);
              const isSelected = !isCustom && duration === mins;

              return (
                <button
                  key={mins}
                  type="button"
                  disabled={isDisabled && entertainmentRemaining <= 0}
                  onClick={() => handleSelectDuration(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                      : isDisabled
                      ? 'bg-slate-900/40 border-white/5 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {mins} mins
                </button>
              );
            })}

            {/* Custom input */}
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="5"
                max={isEntertainment ? '60' : '180'}
                value={customDuration}
                placeholder="Custom"
                onChange={(e) => {
                  setIsCustom(true);
                  handleCustomDurationChange(e.target.value);
                }}
                className={`w-20 px-2.5 py-1.5 rounded-xl bg-slate-900 border text-xs text-white text-center font-mono ${
                  isCustom ? 'border-violet-500 ring-1 ring-violet-500' : 'border-white/10'
                }`}
              />
              <span className="text-[11px] text-slate-500">m</span>
            </div>
          </div>
        </div>

        {/* 4. Time Slot Preview & Selector */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              Particular Time Slot (Schedule Window):
            </label>
            <span className="text-[11px] font-mono font-bold text-violet-300 bg-violet-500/15 px-2.5 py-0.5 rounded-lg border border-violet-500/30">
              {startTime} – {endTime}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Start Time:</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">End Time:</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-500">
            Work will be added to this particular time block on your daily schedule and day-end report.
          </p>
        </div>

        {/* 5. Action Buttons */}
        <div className="pt-2 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isEntertainment && entertainmentRemaining <= 0}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            title="Add directly to Day-End Report if already completed"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Log Completed Manually
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isEntertainment && entertainmentRemaining <= 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-primary text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4 fill-white" /> Start Timer ({finalDuration}m)
          </button>
        </div>
      </div>
    </div>
  );
};
