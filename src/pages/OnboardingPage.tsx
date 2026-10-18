// DUO OS — Timetable Parser, OCR Confirmation & Onboarding Flow
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  parseRawTimetableText,
  SAMPLE_USER_A_TIMETABLE_CSV,
  SAMPLE_USER_B_TIMETABLE_CSV
} from '../lib/timetableParser';
import { saveTimetableEntries, getTimetable } from '../lib/store';
import { TimetableEntry } from '../lib/types';
import {
  FileSpreadsheet,
  UploadCloud,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const DAYS_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const OnboardingPage: React.FC = () => {
  const { user, currentPersona } = useAuth();
  const toast = useToast();

  const [rawInputText, setRawInputText] = useState(
    currentPersona === 'user_a' ? SAMPLE_USER_A_TIMETABLE_CSV : SAMPLE_USER_B_TIMETABLE_CSV
  );
  const [extractedEntries, setExtractedEntries] = useState<TimetableEntry[]>([]);
  const [isParsed, setIsParsed] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState<number>(0);

  // User B 3-day selection
  const [selectedDaysUserB, setSelectedDaysUserB] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri

  const handleParse = () => {
    if (!rawInputText.trim()) {
      toast.error('Please paste or upload timetable text first.');
      return;
    }

    const result = parseRawTimetableText(rawInputText, user.id);
    setExtractedEntries(result.entries);
    setConfidenceScore(result.confidenceScore);
    setIsParsed(true);

    toast.success(
      'Timetable Extracted!',
      `Found ${result.entries.length} recurring class events with ${Math.round(result.confidenceScore * 100)}% parser confidence.`
    );
  };

  const handleUpdateEntry = (index: number, field: keyof TimetableEntry, value: any) => {
    const updated = [...extractedEntries];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedEntries(updated);
  };

  const handleDeleteEntry = (index: number) => {
    setExtractedEntries(prev => prev.filter((_, i) => i !== index));
    toast.info('Class slot removed');
  };

  const handleAddNewSlot = () => {
    const newEntry: TimetableEntry = {
      id: `entry_${Date.now()}`,
      userId: user.id,
      dayOfWeek: 1,
      subjectCode: 'CS301',
      subjectName: 'Lecture Slot',
      startTime: '08:00',
      endTime: '09:00',
      room: 'LH-201',
      isLab: false
    };
    setExtractedEntries(prev => [...prev, newEntry]);
  };

  const handleSaveToTimetable = () => {
    if (extractedEntries.length === 0) {
      toast.error('No timetable entries to save');
      return;
    }

    saveTimetableEntries(extractedEntries, user.id);
    toast.success('Timetable Saved Successfully!', 'Your weekly college lectures are now active in the calendar.');
  };

  const handleLoadSample = (sample: string) => {
    setRawInputText(sample);
    const result = parseRawTimetableText(sample, user.id);
    setExtractedEntries(result.entries);
    setConfidenceScore(result.confidenceScore);
    setIsParsed(true);
    toast.info('Loaded verified NIT engineering semester timetable');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/90 border border-white/8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Timetable OCR & Extraction Engine
            </span>
            <span className="text-xs text-slate-400">Weekly Lecture & Lab Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-violet-400" /> College Timetable Import & Setup
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {currentPersona === 'user_a'
              ? 'Extract 6-day BTech Computer Science class schedule from text, spreadsheet or PDF OCR.'
              : 'Configure 3 dedicated college days (Mon/Wed/Fri) and recurring AI lab schedules.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLoadSample(currentPersona === 'user_a' ? SAMPLE_USER_A_TIMETABLE_CSV : SAMPLE_USER_B_TIMETABLE_CSV)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-violet-300 border border-white/10 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Load NIT Template
          </button>
        </div>
      </div>

      {/* User B College Day Selector */}
      {currentPersona === 'user_b' && (
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" /> Configure User B's 3 College Days
            </h3>
            <span className="text-xs text-emerald-400 font-mono">
              {selectedDaysUserB.length} days selected
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Select the 3 days per week you attend campus lectures (8:00 AM – 5:30 PM). The remaining 4 days will be automatically unlocked for intensive CAT preparation, GATE revision, and placement prep.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6].map(dayNum => {
              const isSelected = selectedDaysUserB.includes(dayNum);
              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedDaysUserB(selectedDaysUserB.filter(d => d !== dayNum));
                    } else {
                      if (selectedDaysUserB.length >= 3) {
                        toast.info('User B is set to 3 college days per week. Uncheck a day first.');
                        return;
                      }
                      setSelectedDaysUserB([...selectedDaysUserB, dayNum]);
                    }
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {DAYS_NAME[dayNum]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input / Upload Area */}
      <div className="p-6 rounded-3xl bg-[#0D1322]/80 border border-white/8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-violet-400" />
            Paste Raw Timetable Text, CSV or OCR Dump:
          </label>
          <span className="text-[10px] text-slate-400">Formats: "Day, Start, End, Code, Title, Room"</span>
        </div>

        <textarea
          rows={6}
          value={rawInputText}
          onChange={(e) => setRawInputText(e.target.value)}
          placeholder="Monday, 08:00, 09:00, CS301, Computer Networks, LH-201..."
          className="w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
        />

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-slate-400">
            Accepts raw text, CSV exports, or pasted syllabus timetable tables.
          </p>

          <button
            onClick={handleParse}
            className="px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Extract & Review
          </button>
        </div>
      </div>

      {/* Extracted Confirmation Screen */}
      {isParsed && (
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0D1322]/90 border border-violet-500/30 shadow-2xl space-y-5 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Extracted Classes Confirmation Table</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {Math.round(confidenceScore * 100)}% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Please verify and edit any fields below before saving to your recurring semester calendar.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddNewSlot}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 border border-white/8 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Slot
              </button>
              <button
                onClick={handleSaveToTimetable}
                className="px-5 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Save to Timetable
              </button>
            </div>
          </div>

          {/* Editable Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3">Start</th>
                  <th className="py-2.5 px-3">End</th>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Subject Name</th>
                  <th className="py-2.5 px-3">Room / Lab</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {extractedEntries.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2 px-3">
                      <select
                        value={entry.dayOfWeek}
                        onChange={(e) => handleUpdateEntry(idx, 'dayOfWeek', Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-white text-xs font-sans"
                      >
                        {[1, 2, 3, 4, 5, 6].map(d => (
                          <option key={d} value={d}>{DAYS_NAME[d]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="time"
                        value={entry.startTime}
                        onChange={(e) => handleUpdateEntry(idx, 'startTime', e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-white text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="time"
                        value={entry.endTime}
                        onChange={(e) => handleUpdateEntry(idx, 'endTime', e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-white text-xs"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={entry.subjectCode}
                        onChange={(e) => handleUpdateEntry(idx, 'subjectCode', e.target.value)}
                        className="w-20 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-white text-xs font-sans"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={entry.subjectName}
                        onChange={(e) => handleUpdateEntry(idx, 'subjectName', e.target.value)}
                        className="w-48 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-white text-xs font-sans"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={entry.room || ''}
                        onChange={(e) => handleUpdateEntry(idx, 'room', e.target.value)}
                        className="w-28 bg-slate-950 border border-slate-700/80 rounded-lg px-2 py-1 text-slate-300 text-xs font-sans"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleUpdateEntry(idx, 'isLab', !entry.isLab)}
                        className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                          entry.isLab ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {entry.isLab ? 'LAB' : 'LECTURE'}
                      </button>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => handleDeleteEntry(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
