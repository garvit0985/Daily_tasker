// DUO OS — Day-End Progress Report Card & History
import React from 'react';
import { SixCategory, FocusSession } from '../../lib/types';
import { getDailyCategoryStats, deleteFocusSession } from '../../lib/store';
import { useToast } from '../../context/ToastContext';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Copy,
  Gamepad2,
  BookOpen,
  Code2,
  Briefcase,
  Target,
  Zap,
  Trash2,
  Plus,
  Flame,
  AlertTriangle
} from 'lucide-react';

interface DayEndReportCardProps {
  userId: string;
  userName: string;
  onOpenSessionModal?: (category?: SixCategory) => void;
}

const CATEGORY_ICONS: Record<SixCategory, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  cat: { icon: Target, color: 'text-violet-400', bg: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  gate: { icon: Zap, color: 'text-sky-400', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  dsa: { icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  job_apply: { icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  academics: { icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  entertainment: { icon: Gamepad2, color: 'text-rose-400', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' }
};

export const DayEndReportCard: React.FC<DayEndReportCardProps> = ({
  userId,
  userName,
  onOpenSessionModal
}) => {
  const toast = useToast();
  const stats = getDailyCategoryStats(userId);

  const formatHoursMinutes = (totalMins: number) => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const handleCopyReport = () => {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const reportText = `📊 DUO OS — Day End Progress Report (${userName})
📅 Date: ${dateStr}
⏱️ Total Productive Study: ${formatHoursMinutes(stats.productiveMinutes)}
🎮 Entertainment: ${stats.entertainmentMinutes}m / 60m max (${stats.entertainmentMinutes <= 60 ? 'Within limit ✅' : 'Exceeded limit ⚠️'})

📂 Category Breakdown:
🎯 CAT: ${stats.categoryTotals.cat.minutes}m (${stats.categoryTotals.cat.count} sessions)
⚡ GATE: ${stats.categoryTotals.gate.minutes}m (${stats.categoryTotals.gate.count} sessions)
💻 DSA: ${stats.categoryTotals.dsa.minutes}m (${stats.categoryTotals.dsa.count} sessions)
💼 Job Apply: ${stats.categoryTotals.job_apply.minutes}m (${stats.categoryTotals.job_apply.count} sessions)
📚 Academics: ${stats.categoryTotals.academics.minutes}m (${stats.categoryTotals.academics.count} sessions)
🎮 Entertainment: ${stats.categoryTotals.entertainment.minutes}m (${stats.categoryTotals.entertainment.count} sessions)

📝 Completed Work & Time Slots (${stats.todaySessions.length}):
${stats.todaySessions.map((s, idx) => {
  const slotStr = s.timeSlot ? ` • Slot: ${s.timeSlot}` : (s.startTime && s.endTime ? ` • Slot: ${s.startTime} – ${s.endTime}` : '');
  return `${idx + 1}. [${(s.category || 'Study').toUpperCase()}] ${s.reason || s.taskTitle || 'Session'} (${s.durationMinutes}m)${slotStr}`;
}).join('\n') || 'No sessions logged today.'}

Great work staying accountable!`;

    navigator.clipboard.writeText(reportText).then(() => {
      toast.success('Report copied to clipboard!', 'Ready to share with your study partner.');
    }).catch(() => {
      toast.info('Report text generated');
    });
  };

  const handleDelete = (session: FocusSession) => {
    if (window.confirm(`Remove session "${session.reason || 'Study Session'}" (${session.durationMinutes}m)?`)) {
      deleteFocusSession(session.id);
      toast.info('Session removed');
    }
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#0D1322]/85 border border-white/8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Day-End Progress Report
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-400" /> Daily Productivity & Focus Summary
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-compiled when timers finish or when sessions are logged manually.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenSessionModal && (
            <button
              onClick={() => onOpenSessionModal('cat')}
              className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Log Session
            </button>
          )}

          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Copy formatted summary to clipboard"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Report
          </button>
        </div>
      </div>

      {/* Top 3 High-Level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Productive Time */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Productive Study Time
          </span>
          <p className="text-2xl font-black font-mono text-emerald-400">
            {formatHoursMinutes(stats.productiveMinutes)}
          </p>
          <span className="text-[11px] text-slate-400 block">
            {stats.todaySessions.filter(s => s.category !== 'entertainment').length} study sessions completed
          </span>
        </div>

        {/* Entertainment Cap Card */}
        <div className={`p-4 rounded-2xl border space-y-1.5 ${
          stats.isEntertainmentExceeded
            ? 'bg-rose-950/40 border-rose-500/40'
            : stats.entertainmentMinutes >= 45
            ? 'bg-amber-950/30 border-amber-500/30'
            : 'bg-slate-900/60 border-white/5'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Entertainment Time
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              stats.isEntertainmentExceeded
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {stats.isEntertainmentExceeded ? 'Cap Exceeded ⚠️' : 'Max 1 Hr Cap'}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-white">
              {stats.entertainmentMinutes}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 60 mins</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                stats.isEntertainmentExceeded ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-amber-400'
              }`}
              style={{ width: `${Math.min(100, Math.round((stats.entertainmentMinutes / 60) * 100))}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block">
            {stats.entertainmentRemainingMinutes > 0
              ? `${stats.entertainmentRemainingMinutes} mins remaining today`
              : 'Daily limit reached'}
          </span>
        </div>

        {/* Total Sessions Today */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Sessions Logged
          </span>
          <p className="text-2xl font-black font-mono text-violet-300">
            {stats.todaySessions.length}
          </p>
          <span className="text-[11px] text-slate-400 block">
            Across CAT, GATE, DSA, Jobs, Academics & Rest
          </span>
        </div>
      </div>

      {/* 6 Category Mini-Summary Pills */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Category Time Distribution:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(stats.categoryTotals) as SixCategory[]).map(catKey => {
            const catStat = stats.categoryTotals[catKey];
            const cfg = CATEGORY_ICONS[catKey];
            const Icon = cfg.icon;

            return (
              <div
                key={catKey}
                className="p-3 rounded-2xl bg-slate-900/50 border border-white/5 space-y-1"
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                  <span className="text-xs font-bold text-white capitalize">{catKey.replace('_', ' ')}</span>
                </div>
                <p className="text-base font-extrabold font-mono text-slate-200">
                  {catStat.minutes}m
                </p>
                <span className="text-[10px] text-slate-500 block">
                  {catStat.count} {catStat.count === 1 ? 'session' : 'sessions'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Sessions Timeline */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
          <span>Today's Completed Session History ({stats.todaySessions.length})</span>
          {stats.todaySessions.length > 0 && (
            <span className="text-[11px] text-slate-500 font-normal">Click trash icon to remove</span>
          )}
        </h4>

        {stats.todaySessions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/30 border border-dashed border-white/10 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No sessions logged yet today</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Progress is set to 0. Click any category box above to start a live timer or log completed work manually.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {stats.todaySessions.map((session) => {
              const catKey = (session.category || 'academics') as SixCategory;
              const cfg = CATEGORY_ICONS[catKey] || CATEGORY_ICONS.academics;
              const Icon = cfg.icon;

              const timeStr = session.completedAt
                ? new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Today';

              return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-white/10 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-white/5 shrink-0">
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.bg}`}>
                          {catKey.toUpperCase().replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-violet-400" />
                          {session.timeSlot || (session.startTime && session.endTime ? `${session.startTime} – ${session.endTime}` : timeStr)}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white truncate mt-1">
                        {session.reason || session.taskTitle || 'Study Session'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      +{session.durationMinutes}m
                    </span>

                    <button
                      onClick={() => handleDelete(session)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Remove session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
