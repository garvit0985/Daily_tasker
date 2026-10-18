// DUO OS — Career Command Center & Application Pipeline
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getJobOpportunities,
  getJobApplications,
  updateJobApplication,
  addJobApplication
} from '../lib/store';
import { JobOpportunity, JobApplication, JobStatus, JobRoleCategory } from '../lib/types';
import {
  Briefcase,
  ExternalLink,
  Plus,
  ShieldCheck,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  FileText,
  DollarSign,
  MapPin,
  Sparkles,
  Layers
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';

const PIPELINE_STAGES: { id: JobStatus; label: string; color: string }[] = [
  { id: 'saved', label: 'Saved', color: 'border-slate-700 bg-slate-900/40 text-slate-400' },
  { id: 'preparing', label: 'Preparing SOP / Resume', color: 'border-violet-500/40 bg-violet-950/20 text-violet-300' },
  { id: 'applied', label: 'Applied', color: 'border-sky-500/40 bg-sky-950/20 text-sky-300' },
  { id: 'assessment', label: 'Online Assessment (OA)', color: 'border-amber-500/40 bg-amber-950/20 text-amber-300' },
  { id: 'interview', label: 'Interview Rounds', color: 'border-purple-500/40 bg-purple-950/20 text-purple-300' },
  { id: 'offer', label: 'Offer Received', color: 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' }
];

export const CareerPage: React.FC = () => {
  const { user, currentPersona } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'discovery'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddAppOpen, setIsAddAppOpen] = useState(false);

  // New application form state
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRoleCat, setNewRoleCat] = useState<JobRoleCategory>('software_dev');
  const [newStatus, setNewStatus] = useState<JobStatus>('applied');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const opportunities = getJobOpportunities(currentPersona);
  const myApplications = getJobApplications(user.id);

  // Filter pipeline
  const filteredApps = myApplications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || app.roleCategory === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleStatusTransition = (app: JobApplication, newStatus: JobStatus) => {
    updateJobApplication({
      ...app,
      status: newStatus
    });
    toast.success('Status updated', `${app.companyName} (${app.jobTitle}) is now ${newStatus.toUpperCase()}`);
  };

  const handleTrackOpportunity = (opp: JobOpportunity) => {
    // Check if already tracked
    if (myApplications.some(a => a.opportunityId === opp.id || a.companyName === opp.companyName)) {
      toast.info('Already tracked in your career pipeline');
      return;
    }

    addJobApplication({
      userId: user.id,
      opportunityId: opp.id,
      companyName: opp.companyName,
      jobTitle: opp.jobTitle,
      roleCategory: opp.roleCategory,
      status: 'saved',
      officialUrl: opp.officialUrl,
      notes: `Discovered from verified portal: ${opp.source}. Eligibility: ${opp.eligibilityCriteria}`,
      compensation: opp.compensation
    });

    toast.success('Added to Career Pipeline!', `${opp.jobTitle} at ${opp.companyName}`);
    setActiveTab('pipeline');
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newTitle.trim()) return;

    addJobApplication({
      userId: user.id,
      companyName: newCompany.trim(),
      jobTitle: newTitle.trim(),
      roleCategory: newRoleCat,
      status: newStatus,
      appliedDate: newStatus === 'applied' ? new Date().toISOString().split('T')[0] : undefined,
      officialUrl: newUrl.trim() || undefined,
      notes: newNotes.trim() || undefined
    });

    toast.success('Application tracked!', `${newTitle} at ${newCompany}`);
    setNewCompany('');
    setNewTitle('');
    setNewNotes('');
    setIsAddAppOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Placement & Internship Portal
            </span>
            <span className="text-xs text-slate-400">
              {currentPersona === 'user_a' ? 'Target: SWE Internships 2027' : 'Target: AI/ML & Data Science FTE 2026'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-sky-400" /> Career Command Center
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Verified opportunities, application kanban, assessment schedules and interview tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-slate-900 border border-white/8">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pipeline' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              My Pipeline ({myApplications.length})
            </button>
            <button
              onClick={() => setActiveTab('discovery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'discovery' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Verified Leads ({opportunities.length})
            </button>
          </div>

          <button
            onClick={() => setIsAddAppOpen(true)}
            className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Track Opportunity
          </button>
        </div>
      </div>

      {activeTab === 'pipeline' ? (
        /* My Application Pipeline Kanban */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {PIPELINE_STAGES.map(stage => {
              const stageApps = filteredApps.filter(a => a.status === stage.id);
              return (
                <div key={stage.id} className="p-3.5 rounded-2xl bg-[#0D1322]/80 border border-white/8 shadow-lg flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">{stage.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[60vh]">
                    {stageApps.length === 0 ? (
                      <p className="text-[10px] text-slate-600 py-6 text-center italic">Empty</p>
                    ) : (
                      stageApps.map(app => (
                        <div
                          key={app.id}
                          className="p-3 rounded-xl bg-slate-900/60 border border-white/5 hover:border-violet-500/30 transition-all space-y-2"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-white">{app.companyName}</h4>
                            <p className="text-[11px] text-slate-300 leading-snug">{app.jobTitle}</p>
                          </div>

                          {app.assessmentDate && (
                            <span className="text-[10px] text-amber-400 font-mono block">
                              📅 OA: {app.assessmentDate}
                            </span>
                          )}

                          {app.interviewDate && (
                            <span className="text-[10px] text-emerald-400 font-mono block">
                              🎙️ Interview: {app.interviewDate}
                            </span>
                          )}

                          {app.compensation && (
                            <span className="text-[10px] text-emerald-300 font-mono block">
                              💰 {app.compensation}
                            </span>
                          )}

                          {app.notes && (
                            <p className="text-[10px] text-slate-400 bg-slate-950/40 p-1.5 rounded-lg border border-white/5 line-clamp-2">
                              {app.notes}
                            </p>
                          )}

                          {/* Quick stage transition */}
                          <div className="pt-1.5 border-t border-white/5 flex items-center justify-between">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusTransition(app, e.target.value as JobStatus)}
                              className="bg-transparent text-[10px] text-slate-400 font-medium focus:outline-none"
                            >
                              <option value="saved" className="bg-slate-900">Saved</option>
                              <option value="preparing" className="bg-slate-900">Preparing</option>
                              <option value="applied" className="bg-slate-900">Applied</option>
                              <option value="assessment" className="bg-slate-900">Assessment</option>
                              <option value="interview" className="bg-slate-900">Interview</option>
                              <option value="offer" className="bg-slate-900">Offer</option>
                              <option value="rejected" className="bg-slate-900">Rejected</option>
                            </select>

                            {app.officialUrl && (
                              <a
                                href={app.officialUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-500 hover:text-white"
                                title="Official Link"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Verified Discovery Feed */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/30 text-xs text-sky-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Verified Postings:</strong> Curated directly for {user.displayName} based on degree ({user.degreeProgram}) and year of graduation.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map(opp => (
              <div
                key={opp.id}
                className="p-5 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-3.5 hover:border-violet-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-white/5 text-[11px] font-bold text-white font-mono">
                      {opp.companyName}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3 h-3" /> Verified Official
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{opp.jobTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">{opp.eligibilityCriteria}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {opp.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span>📍 {opp.location} ({opp.workMode})</span>
                    {opp.compensation && <span className="text-emerald-300 font-mono font-semibold">💵 {opp.compensation}</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                  <a
                    href={opp.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    Careers Portal <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleTrackOpportunity(opp)}
                    className="px-3.5 py-1.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Track in Pipeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Track Modal */}
      <Modal isOpen={isAddAppOpen} onClose={() => setIsAddAppOpen(false)} title="Track Career Application">
        <form onSubmit={handleManualAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company *</label>
              <input
                type="text"
                required
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Google / Atlassian"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Software Engineer Intern / ML Associate"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Role Category</label>
              <select
                value={newRoleCat}
                onChange={(e) => setNewRoleCat(e.target.value as JobRoleCategory)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="software_dev">Software Development</option>
                <option value="data_science">Data Science</option>
                <option value="ai_ml">AI / Machine Learning</option>
                <option value="data_analyst">Data Analyst</option>
                <option value="general_fresher">General Fresher Program</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                <option value="saved">Saved</option>
                <option value="preparing">Preparing</option>
                <option value="applied">Applied</option>
                <option value="assessment">Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Posting URL</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://careers.company.com/..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Referral Details</label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="Referred by senior; tailored resume version 3..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsAddAppOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold">
              Save to Pipeline
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
