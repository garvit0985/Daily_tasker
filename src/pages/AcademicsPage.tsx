// DUO OS — Academic Subjects & Syllabus Coverage Command Center
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getSubjects, toggleTopicCompleted, addSubject } from '../lib/store';
import { Subject, SyllabusTopic } from '../lib/types';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Circle,
  Plus,
  Layers,
  FileText,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  BookMarked
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const AcademicsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const subjects = getSubjects(user.id);

  const [expandedSubjectId, setExpandedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);

  // New Subject Form
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCredits, setNewCredits] = useState(4);
  const [newProf, setNewProf] = useState('');

  const handleToggleTopic = (subjectId: string, topicId: string, topicTitle: string) => {
    toggleTopicCompleted(subjectId, topicId);
    toast.success('Syllabus updated', `Updated progress on "${topicTitle}"`);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSubject({
      id: `sub_${Date.now()}`,
      userId: user.id,
      code: newCode.trim() || 'CS',
      title: newTitle.trim(),
      credits: Number(newCredits) || 3,
      professor: newProf.trim() || undefined,
      colorCode: '#8B5CF6',
      topics: [
        {
          id: `top_${Date.now()}_1`,
          subjectId: `sub_${Date.now()}`,
          unitNumber: 1,
          title: 'Unit 1: Fundamentals & Core Principles',
          difficulty: 'medium',
          isCompleted: false,
          revisionCount: 0
        }
      ]
    });

    toast.success('Subject added successfully', newTitle);
    setNewTitle('');
    setNewCode('');
    setIsAddSubjectOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {user.degreeProgram}
            </span>
            <span className="text-xs text-slate-400">Semester Coursework & Labs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-violet-400" /> Academic Subjects & Syllabus Coverage
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Unit-wise topic tracking, difficulty tagging, notes and revision logs.
          </p>
        </div>

        <button
          onClick={() => setIsAddSubjectOpen(true)}
          className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      {/* Subject Cards Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(sub => {
          const totalTopics = sub.topics.length;
          const completedTopics = sub.topics.filter(t => t.isCompleted).length;
          const coveragePercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
          const isExpanded = expandedSubjectId === sub.id;

          return (
            <div
              key={sub.id}
              onClick={() => setExpandedSubjectId(sub.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-[#0E1529] border-violet-500/50 shadow-[0_0_20px_-5px_rgba(139,92,246,0.25)]'
                  : 'bg-[#0D1322]/80 border-white/8 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/5 font-mono text-[11px] font-bold text-violet-300">
                  {sub.code}
                </span>
                <span className="text-[10px] text-slate-400">{sub.credits} Credits</span>
              </div>

              <h4 className="text-sm font-bold text-white line-clamp-1">{sub.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{sub.professor || 'Department Faculty'}</p>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Coverage</span>
                  <span className="text-white font-mono font-bold">{coveragePercent}% ({completedTopics}/{totalTopics})</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full"
                    style={{ width: `${coveragePercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Subject Topic Deep-Dive */}
      {subjects.find(s => s.id === expandedSubjectId) && (
        (() => {
          const activeSub = subjects.find(s => s.id === expandedSubjectId)!;
          return (
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-violet-400">{activeSub.code}</span>
                  <h3 className="text-lg font-bold text-white">{activeSub.title}</h3>
                  <p className="text-xs text-slate-400">Faculty: {activeSub.professor}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-semibold text-emerald-400">
                    {activeSub.topics.filter(t => t.isCompleted).length} / {activeSub.topics.length} Units Mastered
                  </span>
                </div>
              </div>

              {/* Topic List */}
              <div className="space-y-3">
                {activeSub.topics.map(topic => (
                  <div
                    key={topic.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      topic.isCompleted
                        ? 'bg-slate-900/30 border-white/5 opacity-80'
                        : 'bg-slate-900/70 border-white/8 hover:border-violet-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => handleToggleTopic(activeSub.id, topic.id, topic.title)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                      >
                        {topic.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            UNIT {topic.unitNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                            topic.difficulty === 'hard'
                              ? 'bg-rose-500/20 text-rose-300'
                              : topic.difficulty === 'medium'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {topic.difficulty}
                          </span>
                          {topic.revisionCount > 0 && (
                            <span className="text-[10px] text-violet-300 font-mono">
                              {topic.revisionCount}x revised
                            </span>
                          )}
                        </div>
                        <h5 className={`text-xs font-semibold mt-1 ${topic.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                          {topic.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()
      )}

      {/* Add Subject Modal */}
      <Modal isOpen={isAddSubjectOpen} onClose={() => setIsAddSubjectOpen(false)} title="Add Academic Subject">
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subject Code *</label>
            <input
              type="text"
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g. CS305 / AI405"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subject Title *</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Theory of Computation & Automata"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Credits</label>
              <input
                type="number"
                min={1}
                max={5}
                value={newCredits}
                onChange={(e) => setNewCredits(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Faculty / Professor</label>
              <input
                type="text"
                value={newProf}
                onChange={(e) => setNewProf(e.target.value)}
                placeholder="e.g. Dr. K. Ramanujan"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAddSubjectOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold">
              Save Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
