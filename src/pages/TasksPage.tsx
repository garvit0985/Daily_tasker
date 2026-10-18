// DUO OS — Task & Sprint Management Command Center
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getTasks, updateTask, deleteTask, toggleTaskComplete } from '../lib/store';
import { Task, TaskCategory, TaskPriority, TaskStatus } from '../lib/types';
import {
  CheckSquare2,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  Unlock,
  Trash2,
  MoreVertical,
  Calendar,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { QuickTaskModal } from '../components/tasks/QuickTaskModal';

const STATUS_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'planned', label: 'Planned', color: 'border-slate-700 bg-slate-900/40 text-slate-300' },
  { id: 'in_progress', label: 'In Progress', color: 'border-violet-500/40 bg-violet-950/20 text-violet-300' },
  { id: 'completed', label: 'Completed', color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' },
  { id: 'skipped', label: 'Skipped / Rescheduled', color: 'border-slate-800 bg-slate-950/40 text-slate-500' }
];

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasks = getTasks(user.id);

  // Filtering
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    updateTask({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
    });
    toast.info(`Moved to ${newStatus.toUpperCase()}`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete task "${title}"?`)) {
      deleteTask(id);
      toast.info('Task deleted');
    }
  };

  const handleToggleLock = (task: Task) => {
    updateTask({ ...task, isLocked: !task.isLocked });
    toast.info(task.isLocked ? 'Unlocked task' : 'Locked task time block');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Tools */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <CheckSquare2 className="w-6 h-6 text-violet-400" /> Tasks & Sprints
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Organize coursework, LeetCode milestones, mock drills & career deadlines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View toggle */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-white/8">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-violet-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, problems, subjects..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/60 border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/60 border border-white/8 text-slate-300 text-xs focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Categories</option>
          <option value="academics">Academics</option>
          <option value="dsa">DSA & Algorithms</option>
          <option value="cat">CAT Prep</option>
          <option value="gate">GATE Prep</option>
          <option value="career">Career & Jobs</option>
          <option value="tuition">Tuition</option>
          <option value="fitness">Fitness / Gym</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900/60 border border-white/8 text-slate-300 text-xs focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent Priority</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="p-4 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-3 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[65vh]">
                  {columnTasks.length === 0 ? (
                    <p className="text-[11px] text-slate-500 py-6 text-center italic">No tasks</p>
                  ) : (
                    columnTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 transition-all space-y-2.5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-white leading-snug">{task.title}</p>
                          <button
                            onClick={() => handleToggleLock(task)}
                            className="text-slate-500 hover:text-white"
                            title={task.isLocked ? 'Locked' : 'Unlocked'}
                          >
                            {task.isLocked ? <Lock className="w-3.5 h-3.5 text-violet-400" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                            {task.category.toUpperCase()}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-semibold ${
                            task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="text-slate-500 font-mono">~{task.estimatedMinutes}m</span>
                        </div>

                        {/* Move status buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task, e.target.value as TaskStatus)}
                            className="bg-transparent text-[10px] text-slate-400 font-medium focus:outline-none"
                          >
                            <option value="planned" className="bg-slate-900">Move to Planned</option>
                            <option value="in_progress" className="bg-slate-900">Move to In Progress</option>
                            <option value="completed" className="bg-slate-900">Move to Completed</option>
                            <option value="skipped" className="bg-slate-900">Move to Skipped</option>
                          </select>

                          <button
                            onClick={() => handleDelete(task.id, task.title)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-2.5">
          {filteredTasks.map(task => {
            const isDone = task.status === 'completed';
            return (
              <div
                key={task.id}
                className="p-3 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center justify-between gap-3 hover:border-white/10"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button onClick={() => toggleTaskComplete(task.id)}>
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                      {task.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Due: {task.dueDate} • {task.category.toUpperCase()} • ~{task.estimatedMinutes}m
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                    {task.status.toUpperCase()}
                  </span>
                  <button onClick={() => handleDelete(task.id, task.title)} className="text-slate-500 hover:text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuickTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
