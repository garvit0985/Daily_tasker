import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Sparkles
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { checkBackendHealth, getExcelDownloadUrl, BackendHealth } from '../../lib/excelApi';
import { syncWithExcelBackend } from '../../lib/store';
import { useToast } from '../../context/ToastContext';

interface ExcelDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelDatabaseModal: React.FC<ExcelDatabaseModalProps> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const [health, setHealth] = useState<BackendHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    const data = await checkBackendHealth();
    setHealth(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  const handleSync = async () => {
    setIsSyncing(true);
    const res = await syncWithExcelBackend();
    setIsSyncing(false);
    if (res.success) {
      toast.success('Excel Synced!', res.message);
      fetchHealth();
    } else {
      toast.error('Sync Error', res.message);
    }
  };

  const handleCopyPath = () => {
    if (health?.stats.filePath) {
      navigator.clipboard.writeText(health.stats.filePath);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.info('Copied!', 'File path copied to clipboard');
    }
  };

  const handleDownload = () => {
    window.open(getExcelDownloadUrl(), '_blank');
    toast.success('Downloading Excel DB', 'Opening database.xlsx file...');
  };

  const isOnline = Boolean(health);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Excel Database Backend" maxWidth="lg">
      <div className="space-y-6">
        {/* Connection Status Banner */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isOnline
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isOnline ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {isOnline ? 'Excel Backend Online & Connected' : 'Excel Backend Server Offline'}
                </span>
                <span className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isOnline
                  ? `REST API listening on http://localhost:5000 (ExcelJS Engine)`
                  : 'Start backend using "npm run server" in your terminal'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchHealth}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Database File Details */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Live Database File
            </span>
            {health?.stats?.fileSizeBytes && (
              <span className="text-[11px] font-mono text-slate-400">
                {(health.stats.fileSizeBytes / 1024).toFixed(1)} KB
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 border border-white/5 text-xs font-mono text-slate-300">
            <span className="truncate flex-1">
              {health?.stats?.filePath || 'server/data/database.xlsx'}
            </span>
            <button
              onClick={handleCopyPath}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Copy path"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Sheets & Records Breakdown */}
        {health?.stats?.counts && (
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              Excel Sheets & Record Counts
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(health.stats.counts).map(([sheet, count]) => (
                <div
                  key={sheet}
                  className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex flex-col justify-between"
                >
                  <span className="text-xs text-slate-400 font-medium">{sheet}</span>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-lg font-bold font-mono text-white">{count}</span>
                    <span className="text-[10px] text-slate-500 uppercase">rows</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            disabled={!isOnline}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            Download database.xlsx
          </button>

          <button
            onClick={handleSync}
            disabled={!isOnline || isSyncing}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white font-medium text-sm border border-white/10 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Tasks with Excel'}
          </button>
        </div>

        {/* Terminal Run Guide */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/5 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            How to run backend server
          </span>
          <p className="text-xs text-slate-400 leading-relaxed">
            In your terminal or PowerShell, run the following command to start the Excel backend:
          </p>
          <div className="p-2.5 rounded-xl bg-black/60 font-mono text-xs text-violet-300 border border-white/5">
            npm run server
          </div>
          <p className="text-[11px] text-slate-500">
            For hot-reloading during development, you can also run: <code className="text-slate-400">npm run server:dev</code>
          </p>
        </div>
      </div>
    </Modal>
  );
};
