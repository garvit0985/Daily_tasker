// DUO OS — Comprehensive CAT, GATE & Competitive Exam Command Center
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getExams, getMocks, addMockTest, updateExamGoal } from '../lib/store';
import { ExamGoal, MockTest } from '../lib/types';
import {
  Target,
  Trophy,
  TrendingUp,
  Clock,
  Sparkles,
  Plus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRight,
  Shield,
  BarChart2
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const ExamsPage: React.FC = () => {
  const { user, currentPersona } = useAuth();
  const toast = useToast();

  const exams = getExams(user.id);
  const mocks = getMocks(user.id);

  const [isAddMockOpen, setIsAddMockOpen] = useState(false);
  const [showRebalanceAdvisor, setShowRebalanceAdvisor] = useState(false);

  // New Mock Form
  const [mockTitle, setMockTitle] = useState('');
  const [testSeries, setTestSeries] = useState('TIME AIMCAT');
  const [dateTaken, setDateTaken] = useState('2026-10-18');
  const [qaScore, setQaScore] = useState(35);
  const [varcScore, setVarcScore] = useState(40);
  const [dilrScore, setDilrScore] = useState(30);
  const [accuracy, setAccuracy] = useState(86);
  const [weakTopicsInput, setWeakTopicsInput] = useState('');

  const catExam = exams.find(e => e.examType === 'CAT_2026');
  const gateExam = exams.find(e => e.examType.startsWith('GATE'));
  const cat2027Exam = exams.find(e => e.examType === 'CAT_2027');

  const todayStr = '2026-10-18';
  const daysUntilCAT = catExam
    ? Math.ceil((new Date(catExam.examDate).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleAddMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTitle.trim()) return;

    const total = Number(qaScore) + Number(varcScore) + Number(dilrScore);
    // Approximate percentile curve for CAT
    const approxPercentile = Math.min(99.9, Math.max(70, 85 + (total - 80) * 0.45));

    addMockTest({
      userId: user.id,
      examId: catExam?.id,
      title: mockTitle.trim(),
      testSeries,
      dateTaken,
      sectionBreakdown: {
        qa: Number(qaScore),
        varc: Number(varcScore),
        dilr: Number(dilrScore)
      },
      totalScore: total,
      percentile: Number(approxPercentile.toFixed(1)),
      accuracyPercent: Number(accuracy),
      weakTopics: weakTopicsInput.split(',').map(s => s.trim()).filter(Boolean),
      timeSpentMinutes: 120
    });

    toast.success('Mock Test Logged!', `Total score: ${total} (approx ${approxPercentile.toFixed(1)}%ile)`);
    setMockTitle('');
    setWeakTopicsInput('');
    setIsAddMockOpen(false);
  };

  const handleConfirmCATCompleted = () => {
    if (catExam) {
      updateExamGoal({ ...catExam, isCompleted: true });
      setShowRebalanceAdvisor(true);
      toast.success('CAT Exam marked completed!', 'Rebalance advisor generated new schedule priorities.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Exam Command Center
            </span>
            <span className="text-xs text-slate-400">Sectional Analysis & Mocks</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Target className="w-6 h-6 text-violet-400" /> Competitive Exam Preparation
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {currentPersona === 'user_b'
              ? 'Urgent countdown for CAT Nov 29, 2026 + secondary GATE Data Science roadmap.'
              : 'Long-term foundational preparation for CAT 2027 & GATE Computer Science.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddMockOpen(true)}
            className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Log Mock Test
          </button>
        </div>
      </div>

      {/* Primary Exam Hero Card */}
      {currentPersona === 'user_b' && catExam && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#11162B] to-[#0D1322] border border-rose-500/30 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                🚨 Urgent Priority #1 • {daysUntilCAT} Days to Go
              </span>
              <h3 className="text-2xl font-black text-white">{catExam.title}</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Scheduled for Sunday, November 29, 2026. Target: {catExam.targetPercentile}%ile ({catExam.targetScore} raw score).
                Current focus: speed in DILR matrix sets and QA arithmetic precision.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={handleConfirmCATCompleted}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confirm CAT Completed
              </button>
            </div>
          </div>

          {/* Sectional Breakdown Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/8">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VARC Section</span>
              <p className="text-sm font-bold text-white">Target: 42+ marks</p>
              <p className="text-[11px] text-slate-400">4 Passages (8m each) + 8 Verbal questions</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DILR Section</span>
              <p className="text-sm font-bold text-white">Target: 32+ marks</p>
              <p className="text-[11px] text-slate-400">Solve 2 full sets with 100% accuracy</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quant (QA) Section</span>
              <p className="text-sm font-bold text-white">Target: 36+ marks</p>
              <p className="text-[11px] text-slate-400">Arithmetic, Algebra & Number Systems</p>
            </div>
          </div>
        </div>
      )}

      {/* User A Hero: CAT 2027 & GATE CS */}
      {currentPersona === 'user_a' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-950/40 via-slate-900/80 to-slate-950 border border-violet-500/30 shadow-xl space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              3-Year Runway Foundation
            </span>
            <h3 className="text-lg font-bold text-white">CAT 2027 Strategic Milestone</h3>
            <p className="text-xs text-slate-300">
              Target: 99.5%ile (Graduating 2028 batch). Weekly focus: 1 arithmetic foundation module + daily reading of Aeon essays.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-violet-300">Milestone: Complete Arithmetic by Dec 31, 2026</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/40 via-slate-900/80 to-slate-950 border border-sky-500/30 shadow-xl space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              Core CS Engineering
            </span>
            <h3 className="text-lg font-bold text-white">GATE CS 2027 Preparation</h3>
            <p className="text-xs text-slate-300">
              Aligned with 3rd-year coursework: Operating Systems, Computer Networks, Database Systems, and Algorithms.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono text-sky-300">Target Score: 80+ / 100</span>
            </div>
          </div>
        </div>
      )}

      {/* Mock Test Score Cards & Trends */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Mock Test History & Sectional Analytics</h3>
          </div>
          <span className="text-[11px] text-slate-500">{mocks.length} Full Length Tests Recorded</span>
        </div>

        {mocks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-center space-y-2">
            <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No mock tests logged yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All progress is set to 0. Click &ldquo;Log Mock Test&rdquo; above whenever you complete a full-length or sectional test.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mocks.map(mock => (
              <div
                key={mock.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-3 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{mock.title}</h4>
                    <p className="text-[11px] text-slate-400">{mock.testSeries} • {mock.dateTaken}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold font-mono text-emerald-400">
                      {mock.totalScore}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {mock.percentile}%ile
                    </span>
                  </div>
                </div>

                {/* Section Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">VARC</span>
                    <span className="font-mono font-bold text-white">{mock.sectionBreakdown.varc}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">DILR</span>
                    <span className="font-mono font-bold text-white">{mock.sectionBreakdown.dilr}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-white/5">
                    <span className="text-[10px] text-slate-400 block">QA</span>
                    <span className="font-mono font-bold text-white">{mock.sectionBreakdown.qa}</span>
                  </div>
                </div>

                {/* Weak Topics */}
                {mock.weakTopics.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Flagged Weak Topics for Revision:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mock.weakTopics.map((topic, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px]">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post-CAT Rebalancing Advisor Modal */}
      {showRebalanceAdvisor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-[#0D1322] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <Sparkles className="w-5 h-5" /> Post-CAT Priority Rebalancing Advisor
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Congratulations on completing the CAT examination! Now that CAT is finished, your schedule has been automatically recalibrated to maintain momentum without burnout:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-200">
                <strong>1. New Priority #1 — GATE DA 2027:</strong> Dedicated 2-hour morning blocks for Linear Algebra, Probability & Spark Machine Learning.
              </div>
              <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-violet-200">
                <strong>2. New Priority #2 — Placement Interviews:</strong> Final-round preparation for Flipkart and Fractal Analytics ML engineer rounds.
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-slate-300">
                <strong>3. Academic Capstone:</strong> Submitting Deep Learning research report before semester deadlines.
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setShowRebalanceAdvisor(false)}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold"
              >
                Apply Rebalanced Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Mock Test Modal */}
      <Modal isOpen={isAddMockOpen} onClose={() => setIsAddMockOpen(false)} title="Log Mock Test Result">
        <form onSubmit={handleAddMock} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Mock Test Title *</label>
            <input
              type="text"
              required
              value={mockTitle}
              onChange={(e) => setMockTitle(e.target.value)}
              placeholder="e.g. SIMCAT 12 All-India Mock / GATE CS Practice 1"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Test Series</label>
              <input
                type="text"
                value={testSeries}
                onChange={(e) => setTestSeries(e.target.value)}
                placeholder="IMS / TIME / Career Launcher"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Date Taken</label>
              <input
                type="date"
                value={dateTaken}
                onChange={(e) => setDateTaken(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">VARC Score</label>
              <input
                type="number"
                value={varcScore}
                onChange={(e) => setVarcScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">DILR Score</label>
              <input
                type="number"
                value={dilrScore}
                onChange={(e) => setDilrScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">QA Score</label>
              <input
                type="number"
                value={qaScore}
                onChange={(e) => setQaScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Weak Topics (Comma-separated)</label>
            <input
              type="text"
              value={weakTopicsInput}
              onChange={(e) => setWeakTopicsInput(e.target.value)}
              placeholder="e.g. Permutations, Venn Diagrams, Truth-Tellers"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAddMockOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold">
              Save Mock Test
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
