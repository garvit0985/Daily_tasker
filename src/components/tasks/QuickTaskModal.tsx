// DUO OS — Quick Task Creation Modal
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { TaskCategory, TaskPriority } from '../../lib/types';
import { addTask, getSubjects } from '../../lib/store';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Calendar, Clock, Lock, Sparkles, Tag } from 'lucide-react';

interface QuickTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultCategory?: TaskCategory;
}

export const QuickTaskModal: React.FC<QuickTaskModalProps> = ({
  isOpen,
  onClose,
  defaultDate = '2026-10-18',
  defaultCategory = 'academics'
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const subjects = getSubjects(user.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(defaultCategory);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(defaultDate);
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [subjectId, setSubjectId] = useState<string>('');
  const [isLocked, setIsLocked] = useState(false);
  const [scheduledStart, setScheduledStart] = useState('');
  const [scheduledEnd, setScheduledEnd] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    const selectedSubject = subjects.find(s => s.id === subjectId);

    addTask({
      userId: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      status: 'planned',
      dueDate,
      estimatedMinutes: Number(estimatedMinutes) || 45,
      actualMinutes: 0,
      isLocked,
      isPrivate: false,
      subjectId: subjectId || undefined,
      subjectName: selectedSubject?.title,
      scheduledDate: dueDate,
      scheduledStart: scheduledStart || undefined,
      scheduledEnd: scheduledEnd || undefined,
      orderIndex: 0
    });

    toast.success('Task created successfully', `Added to ${category.toUpperCase()} plan`);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" subtitle={`Planning for ${user.displayName}`} maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Solve 3 LeetCode Graph problems / DILR practice set"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="academics">Academics & Labs</option>
              <option value="dsa">DSA & Problem Solving</option>
              <option value="cat">CAT 2026/2027 Preparation</option>
              <option value="gate">GATE Engineering Exam</option>
              <option value="career">Job & Intern Applications</option>
              <option value="tuition">Tuition Teaching</option>
              <option value="fitness">Gym & Wellness</option>
              <option value="personal">Personal / Miscellaneous</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="urgent">Urgent (Red)</option>
              <option value="high">High (Amber)</option>
              <option value="medium">Medium (Blue)</option>
              <option value="low">Low (Slate)</option>
            </select>
          </div>
        </div>

        {category === 'academics' && subjects.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Link to Academic Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="">-- General Academic Work --</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.code}: {sub.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Est. Minutes
            </label>
            <input
              type="number"
              min={10}
              max={300}
              step={5}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white text-xs focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Lock block toggle */}
        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-2.5">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-violet-600 focus:ring-0"
            />
            <Lock className="w-3.5 h-3.5 text-violet-400" />
            Lock to a specific fixed time block (prevents AI rescheduling)
          </label>

          {isLocked && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-400">Start Time</span>
                <input
                  type="time"
                  value={scheduledStart}
                  onChange={(e) => setScheduledStart(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">End Time</span>
                <input
                  type="time"
                  value={scheduledEnd}
                  onChange={(e) => setScheduledEnd(e.target.value)}
                  className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Notes & Context (Optional)</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Links, reference chapters, or target problem URLs..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-medium btn-primary flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Add to Plan
          </button>
        </div>
      </form>
    </Modal>
  );
};
