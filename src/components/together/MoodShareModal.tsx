// DUO OS — Consent-Based Shared Mood Check-in Modal
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { MoodType } from '../../lib/types';
import { updateMood, getLiveMood } from '../../lib/store';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Heart, Sparkles, Eye, EyeOff, Zap } from 'lucide-react';

interface MoodShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOODS: { type: MoodType; label: string; icon: string; color: string }[] = [
  { type: 'focused', label: 'Focused', icon: '🎯', color: 'from-violet-600 to-indigo-600' },
  { type: 'motivated', label: 'Motivated', icon: '⚡', color: 'from-emerald-600 to-teal-600' },
  { type: 'happy', label: 'Happy', icon: '✨', color: 'from-amber-500 to-yellow-600' },
  { type: 'tired', label: 'Tired', icon: '😴', color: 'from-slate-600 to-slate-700' },
  { type: 'stressed', label: 'Stressed', icon: '🌪️', color: 'from-orange-600 to-rose-700' },
  { type: 'low', label: 'Low Energy', icon: '🌧️', color: 'from-blue-700 to-slate-800' },
  { type: 'need_break', label: 'Need a Break', icon: '☕', color: 'from-pink-600 to-purple-700' }
];

export const MoodShareModal: React.FC<MoodShareModalProps> = ({ isOpen, onClose }) => {
  const { user, partner } = useAuth();
  const toast = useToast();
  const existingMood = getLiveMood(user.id);

  const [selectedMood, setSelectedMood] = useState<MoodType>(existingMood?.mood || 'focused');
  const [energyLevel, setEnergyLevel] = useState<number>(existingMood?.energyLevel || 4);
  const [message, setMessage] = useState(existingMood?.message || '');
  const [isPrivate, setIsPrivate] = useState(existingMood?.isPrivate || false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateMood({
      userId: user.id,
      userName: user.displayName.split(' ')[0],
      mood: selectedMood,
      energyLevel,
      message: message.trim() || undefined,
      isPrivate
    });

    toast.success(
      'Mood updated',
      isPrivate
        ? 'Stored privately (only visible to you)'
        : `Shared with your partner ${partner.displayName.split(' ')[0]}`
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How are you feeling right now?"
      subtitle={`Check-in for ${user.displayName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        {/* Mood Grid */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Select Current State</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MOODS.map(m => {
              const isSelected = selectedMood === m.type;
              return (
                <button
                  key={m.type}
                  type="button"
                  onClick={() => setSelectedMood(m.type)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500 shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)] text-white'
                      : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40 hover:border-white/10'
                  }`}
                >
                  <span className="text-xl shrink-0">{m.icon}</span>
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Slider */}
        <div className="p-3.5 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Energy Level
            </span>
            <span className="text-violet-400 font-semibold">{energyLevel} / 5</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Drained (1)</span>
            <span>Balanced (3)</span>
            <span>Peak Flow (5)</span>
          </div>
        </div>

        {/* Optional Message */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Quick Note / Update for {partner.displayName.split(' ')[0]} (Optional)
          </label>
          <input
            type="text"
            maxLength={140}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., LeetCode contest tonight! / Heading for tea break."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-xs"
          />
        </div>

        {/* Privacy consent control */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/30 border border-white/5">
          <div className="flex items-center gap-2">
            {isPrivate ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-emerald-400" />}
            <div>
              <p className="text-xs font-medium text-slate-200">
                {isPrivate ? 'Private to me' : `Visible to partner (${partner.displayName.split(' ')[0]})`}
              </p>
              <p className="text-[10px] text-slate-500">Consent-based: change or hide anytime.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isPrivate
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {isPrivate ? 'Make Public' : 'Make Private'}
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-medium btn-primary flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Save Status
          </button>
        </div>
      </form>
    </Modal>
  );
};
