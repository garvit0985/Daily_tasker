// DUO OS — Progress Analytics & Reflective Weekly Reviews
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getTasks,
  getFocusSessions,
  getSubjects,
  getWeeklyReviews,
  saveWeeklyReview,
  getJobApplications
} from '../lib/store';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  HeartHandshake,
  MessageSquare,
  Star,
  Target
} from 'lucide-react';

export const InsightsPage: React.FC = () => {
  const { user, partner } = useAuth();
  const toast = useToast();

  const tasks = getTasks(user.id);
  const focusSessions = getFocusSessions(user.id);
  const subjects = getSubjects(user.id);
  const applications = getJobApplications(user.id);
  const reviews = getWeeklyReviews(user.id);

  // Review Form
  const [wentWell, setWentWell] = useState('');
  const [remainingIncomplete, setRemainingIncomplete] = useState('');
  const [topicsNeedingAttention, setTopicsNeedingAttention] = useState('');
  const [wasScheduleRealistic, setWasScheduleRealistic] = useState(true);
  const [scheduleFeedback, setScheduleFeedback] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [p3, setP3] = useState('');
  const [rating, setRating] = useState(4);

  // Calculations
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const dsaTasks = tasks.filter(t => t.category === 'dsa');
  const catTasks = tasks.filter(t => t.category === 'cat');
  const totalFocusMins = focusSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  // Subject syllabus stats
  const totalSyllabusTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const masteredTopics = subjects.reduce((acc, s) => acc + s.topics.filter(t => t.isCompleted).length, 0);
  const overallCoverage = totalSyllabusTopics > 0 ? Math.round((masteredTopics / totalSyllabusTopics) * 100) : 0;

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wentWell.trim()) {
      toast.error('Please reflect on what went well this week.');
      return;
    }

    saveWeeklyReview({
      userId: user.id,
      weekStartDate: '2026-10-12',
      wentWell: wentWell.trim(),
      remainingIncomplete: remainingIncomplete.trim() || 'All planned items addressed comfortably.',
      topicsNeedingAttention: topicsNeedingAttention.trim() || 'General reinforcement.',
      wasScheduleRealistic,
      scheduleFeedback: scheduleFeedback.trim() || 'Good pacing.',
      nextWeekPriorities: [
        p1.trim() || 'Complete assignments on time',
        p2.trim() || 'Daily problem solving sprint',
        p3.trim() || 'Career & exam milestones'
      ],
      rating
    });

    toast.success('Weekly Review Saved!', 'Great self-reflection to start the next week aligned.');
    setWentWell('');
    setRemainingIncomplete('');
    setTopicsNeedingAttention('');
    setP1('');
    setP2('');
    setP3('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Honest Feedback & Growth
            </span>
            <span className="text-xs text-slate-400">Week of October 12 – 18, 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-violet-400" /> Insights & Weekly Reviews
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Compassionate metrics and reflection without shaming: celebrate progress and recalibrate buffers.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Completed Tasks</span>
          <p className="text-2xl font-black text-white font-mono">{completedTasks.length} <span className="text-xs text-slate-500 font-normal">/ {tasks.length}</span></p>
          <span className="text-[11px] text-emerald-400 font-medium">No penalties on missed</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deep Focus Time</span>
          <p className="text-2xl font-black text-violet-300 font-mono">{totalFocusMins} <span className="text-xs text-slate-500 font-normal">mins</span></p>
          <span className="text-[11px] text-violet-400 font-medium">{focusSessions.length} recorded blocks</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Syllabus Mastered</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{overallCoverage}%</p>
          <span className="text-[11px] text-slate-400 font-medium">{masteredTopics} of {totalSyllabusTopics} units</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Applications</span>
          <p className="text-2xl font-black text-sky-400 font-mono">{applications.length}</p>
          <span className="text-[11px] text-sky-300 font-medium">Summer '27 / FTE '26</span>
        </div>
      </div>

      {/* Weekly Review Reflective Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0E1528] via-[#0A0E1A] to-[#070A11] border border-violet-500/30 shadow-2xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-base">
            <Sparkles className="w-5 h-5 text-violet-400" /> Weekly Reflective Review Questionnaire
          </div>
          <p className="text-xs text-slate-400 mt-1">
            "Were your schedules realistic? What remains incomplete?" Take 3 minutes to align your mind for next week.
          </p>
        </div>

        <form onSubmit={handleSaveReview} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                1. What went well this week? 🌟
              </label>
              <textarea
                rows={3}
                required
                value={wentWell}
                onChange={(e) => setWentWell(e.target.value)}
                placeholder="e.g. Consistently worked out at 5:30 AM, solved 10 graph problems, cleared OS lab simulation..."
                className="w-full p-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2. What remains incomplete or needs rescheduling? ⏳
              </label>
              <textarea
                rows={3}
                value={remainingIncomplete}
                onChange={(e) => setRemainingIncomplete(e.target.value)}
                placeholder="e.g. Missed Friday's quant arithmetic drills because tuition ran overtime..."
                className="w-full p-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                3. Which specific academic or exam topics need attention? 🎯
              </label>
              <input
                type="text"
                value={topicsNeedingAttention}
                onChange={(e) => setTopicsNeedingAttention(e.target.value)}
                placeholder="e.g. Dijkstra algorithm proof, DILR matrix arrangements, ACID transaction concurrency"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                4. Were your daily schedules realistic with breaks? ⚖️
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setWasScheduleRealistic(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    wasScheduleRealistic
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-white/5 text-slate-400'
                  }`}
                >
                  Yes, well-buffered
                </button>
                <button
                  type="button"
                  onClick={() => setWasScheduleRealistic(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    !wasScheduleRealistic
                      ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                      : 'bg-slate-900 border-white/5 text-slate-400'
                  }`}
                >
                  Too tight / Need more buffers
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              5. Next Week's 3 Biggest Non-Negotiable Priorities:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                placeholder="Priority 1: e.g. Microsoft OA test"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <input
                type="text"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                placeholder="Priority 2: e.g. Complete OS lab assignment"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
              <input
                type="text"
                value={p3}
                onChange={(e) => setP3(e.target.value)}
                placeholder="Priority 3: e.g. Take SIMCAT 12 mock"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Overall Week Rating:</span>
              {[1, 2, 3, 4, 5].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setRating(st)}
                  className={`p-1 ${st <= rating ? 'text-amber-400' : 'text-slate-600'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <button type="submit" className="px-6 py-2.5 rounded-xl btn-primary text-xs font-semibold">
              Save Reflective Review
            </button>
          </div>
        </form>
      </div>

      {/* Past Reviews Archive */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-violet-400" /> Previous Weekly Review Logs
        </h3>

        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Week of {r.weekStartDate}</span>
                <span className="text-amber-400 text-xs font-bold font-mono">
                  {'★'.repeat(r.rating)} ({r.rating}/5)
                </span>
              </div>
              <p className="text-xs text-slate-300"><strong>Went well:</strong> {r.wentWell}</p>
              <p className="text-xs text-slate-400"><strong>Needs attention:</strong> {r.topicsNeedingAttention}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {r.nextWeekPriorities.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[10px]">
                    🎯 {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
