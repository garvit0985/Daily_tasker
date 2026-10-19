// DUO OS — Intelligent Schedule & Calendar Command Center
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getTasks,
  getTimetable,
  updateTask,
  rescheduleTask,
  addTask,
  getFocusSessions,
  recordFocusSession
} from '../lib/store';
import {
  generateSmartSchedule,
  getFixedSlotsForDay,
  PlanGenerationResult,
  ProposedPlanItem,
  TimeSlot
} from '../lib/planner';
import { Task, SixCategory } from '../lib/types';
import {
  CalendarDays,
  Sparkles,
  Lock,
  Unlock,
  Clock,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Flame,
  Play
} from 'lucide-react';
import { QuickTaskModal } from '../components/tasks/QuickTaskModal';
import { SessionReasonModal } from '../components/focus/SessionReasonModal';

export const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const todayStr = new Date().toISOString().slice(0, 10);
  const initialDate = (todayStr >= '2026-10-18' && todayStr <= '2026-12-31') ? todayStr : '2026-10-18';
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<PlanGenerationResult | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [focusModalOpen, setFocusModalOpen] = useState(false);
  const [activeSlotTarget, setActiveSlotTarget] = useState<{
    category: SixCategory;
    reason: string;
    startTime?: string;
    endTime?: string;
  } | null>(null);

  const tasks = getTasks(user.id);
  const timetable = getTimetable(user.id);
  const focusSessions = getFocusSessions(user.id);

  // Generate or regenerate schedule using planner
  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateSmartSchedule(user, tasks, timetable, selectedDate, energyLevel);
      setGeneratedPlan(plan);
      setIsPreviewOpen(true);
      setIsGenerating(false);
      toast.success('Smart AI Schedule generated!', `Packed ${plan.totalStudyMinutes} minutes of high-priority study.`);
    }, 400);
  };

  const handleApplyPlan = () => {
    if (!generatedPlan) return;
    generatedPlan.allocatedTasks.forEach(item => {
      rescheduleTask(item.taskId, selectedDate, item.start, item.end);
    });
    setIsPreviewOpen(false);
    toast.success('Schedule applied to calendar!', 'All task time blocks have been synchronized.');
  };

  const fixedSlots = getFixedSlotsForDay(user, selectedDate, timetable);
  const dayTasks = tasks.filter(t => t.scheduledDate === selectedDate || t.dueDate === selectedDate);
  const dayFocus = focusSessions.filter(f =>
    f.date === selectedDate || (f.completedAt && f.completedAt.slice(0, 10) === selectedDate)
  );

  // Combine fixed commitments, scheduled tasks, and completed focus sessions for timeline
  interface TimelineEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    type: 'fixed' | 'task' | 'focus';
    category?: string;
    isLocked?: boolean;
    isCompleted?: boolean;
    durationMinutes?: number;
    color: string;
    taskId?: string;
    focusId?: string;
  }

  const fixedEvents: TimelineEvent[] = fixedSlots.map((s, idx) => ({
    id: `fixed_${idx}`,
    title: s.label,
    start: s.start,
    end: s.end,
    type: 'fixed' as const,
    color: s.type === 'gym' ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200'
         : s.type === 'college' ? 'border-sky-500/50 bg-sky-950/30 text-sky-200'
         : s.type === 'tuition' ? 'border-violet-500/50 bg-violet-950/40 text-violet-200'
         : s.type === 'meal' ? 'border-amber-500/30 bg-amber-950/20 text-amber-200'
         : 'border-slate-700 bg-slate-900/60 text-slate-400'
  }));

  const taskEvents: TimelineEvent[] = dayTasks.filter(t => t.scheduledStart && t.scheduledEnd).map(t => {
    const isCompleted = t.status === 'completed';
    return {
      id: t.id,
      title: t.title,
      start: t.scheduledStart!,
      end: t.scheduledEnd!,
      type: 'task' as const,
      category: t.category,
      isLocked: t.isLocked,
      isCompleted,
      durationMinutes: t.actualMinutes || t.estimatedMinutes,
      taskId: t.id,
      color: isCompleted
        ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200'
        : t.priority === 'urgent'
        ? 'border-rose-500/60 bg-rose-950/30 text-rose-200'
        : t.priority === 'high'
        ? 'border-amber-500/60 bg-amber-950/30 text-amber-200'
        : 'border-violet-500/60 bg-violet-950/30 text-violet-200'
    };
  });

  const focusEvents: TimelineEvent[] = dayFocus
    .filter(f => {
      // Don't duplicate if a dayTask already represents this exact time slot
      return !taskEvents.some(te => te.start === f.startTime && te.end === f.endTime);
    })
    .map(f => {
      const start = f.startTime || (f.timeSlot ? f.timeSlot.split('–')[0]?.trim() : '00:00');
      const end = f.endTime || (f.timeSlot ? f.timeSlot.split('–')[1]?.trim() : '00:00');
      return {
        id: `focus_${f.id}`,
        title: f.reason || f.taskTitle || 'Focus Session',
        start,
        end,
        type: 'focus' as const,
        category: f.category,
        isCompleted: true,
        durationMinutes: f.durationMinutes,
        focusId: f.id,
        color: 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200'
      };
    });

  const timelineEvents: TimelineEvent[] = [
    ...fixedEvents,
    ...taskEvents,
    ...focusEvents
  ].sort((a, b) => a.start.localeCompare(b.start));

  return (
    <div className="space-y-6">
      {/* Schedule Header & AI Controls */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Constraint-Aware Engine
            </span>
            <span className="text-xs text-slate-400">Oct 18 – Dec 31, 2026 Window</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-violet-400" /> Daily & Weekly Smart Planner
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Protected blocks: Sleep (23:00–05:00), Gym, College & Tuition never overridden.
          </p>
        </div>

        {/* AI Generator Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Energy Selector */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/8">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-slate-300 font-medium">Energy:</span>
            <select
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="bg-transparent text-xs text-violet-300 font-semibold focus:outline-none"
            >
              <option value={5} className="bg-slate-900">5 - Peak Flow (Hard Tasks First)</option>
              <option value={4} className="bg-slate-900">4 - High Energy</option>
              <option value={3} className="bg-slate-900">3 - Balanced Stamina</option>
              <option value={2} className="bg-slate-900">2 - Moderate / Tired</option>
              <option value={1} className="bg-slate-900">1 - Low / Recovery Focus</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Computing Schedule...' : 'Generate AI Daily Plan'}
          </button>

          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/8 text-xs font-medium"
            title="Add Task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-white/8">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            min="2026-10-18"
            max="2026-12-31"
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
          />
          <span className="text-xs font-medium text-slate-300">
            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate('2026-10-18')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedDate === '2026-10-18' ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Oct 18
          </button>
          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedDate === todayStr ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today ({todayStr.slice(5)})
          </button>
        </div>
      </div>

      {/* Timeline View */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-violet-400" />
            Scheduled Timeline Blocks ({timelineEvents.length})
          </h3>
          <span className="text-[11px] text-slate-500">Sorted Chronologically</span>
        </div>

        <div className="space-y-2.5">
          {timelineEvents.map((ev) => (
            <div
              key={ev.id}
              className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all ${ev.color}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-black/50 border border-white/10 shrink-0">
                  {ev.start} – {ev.end}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-bold text-white truncate">{ev.title}</h4>
                    {ev.isCompleted && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Completed ({ev.durationMinutes || 0}m work)
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {ev.type === 'fixed'
                      ? 'Fixed Commitment (Protected)'
                      : ev.type === 'focus'
                      ? `Focus Session Work • ${(ev.category || 'Study').toUpperCase()}`
                      : `Study Task • ${(ev.category || 'Study').toUpperCase()}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ev.type === 'task' && !ev.isCompleted && (
                  <button
                    onClick={() => {
                      const sixCatMap: Record<string, SixCategory> = {
                        cat: 'cat',
                        gate: 'gate',
                        dsa: 'dsa',
                        career: 'job_apply',
                        academics: 'academics',
                        tuition: 'academics',
                        fitness: 'entertainment',
                        personal: 'entertainment'
                      };
                      setActiveSlotTarget({
                        category: sixCatMap[ev.category || ''] || 'academics',
                        reason: ev.title,
                        startTime: ev.start,
                        endTime: ev.end
                      });
                      setFocusModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Start focus timer for this time slot"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Focus Now</span>
                  </button>
                )}

                {ev.type === 'task' && (
                  <button
                    onClick={() => {
                      const t = tasks.find(item => item.id === ev.taskId);
                      if (t) updateTask({ ...t, isLocked: !t.isLocked });
                    }}
                    className={`p-1.5 rounded-lg text-xs border ${
                      ev.isLocked
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                    }`}
                    title={ev.isLocked ? 'Locked block (cannot be rescheduled)' : 'Lock this time block'}
                  >
                    {ev.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Schedule Preview Modal */}
      {isPreviewOpen && generatedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#0D1322] border border-violet-500/30 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" /> AI Proposed Plan Preview
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review time block allocations before applying to your live calendar.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {generatedPlan.totalStudyMinutes} Study Mins
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-200 leading-relaxed">
              <strong>Strategy:</strong> {generatedPlan.strategySummary}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">Allocated Tasks ({generatedPlan.allocatedTasks.length}):</h4>
              {generatedPlan.allocatedTasks.map(item => (
                <div key={item.taskId} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white">{item.taskTitle}</span>
                    <p className="text-[10px] text-slate-400">{item.reason}</p>
                  </div>
                  <span className="text-xs font-mono text-violet-300 font-semibold px-2 py-0.5 rounded-md bg-violet-500/20">
                    {item.start} – {item.end}
                  </span>
                </div>
              ))}
            </div>

            {generatedPlan.unallocatedTasks.length > 0 && (
              <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200">
                <AlertCircle className="w-4 h-4 inline mr-1 text-amber-400" />
                {generatedPlan.unallocatedTasks.length} task(s) exceeded today's free cognitive stamina and are saved for tomorrow without overwriting protected commitments.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Discard
              </button>
              <button
                onClick={handleApplyPlan}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Apply to Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      <QuickTaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />

      {focusModalOpen && activeSlotTarget && (
        <SessionReasonModal
          isOpen={focusModalOpen}
          onClose={() => setFocusModalOpen(false)}
          userId={user.id}
          defaultCategory={activeSlotTarget.category}
          defaultReason={activeSlotTarget.reason}
          defaultStartTime={activeSlotTarget.startTime}
          defaultEndTime={activeSlotTarget.endTime}
          onStartTimer={(info) => {
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
              date: info.date || selectedDate
            });
            toast.success(`Session started and added to time slot (${info.timeSlot})!`);
          }}
          onLogCompletedDirectly={(info) => {
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
              date: info.date || selectedDate
            });
            toast.success(`Completed work logged in time slot (${info.timeSlot})!`);
          }}
        />
      )}
    </div>
  );
};
