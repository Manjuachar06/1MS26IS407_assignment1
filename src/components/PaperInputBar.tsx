import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Link2,
  FileCode,
  Zap,
  ArrowRight,
  Loader2,
  BookMarked,
  SlidersHorizontal,
  FileText,
} from 'lucide-react';

interface PaperInputBarProps {
  onAnalyze: (input: string, customPayload?: { title?: string; abstract?: string }) => void;
  isLoading: boolean;
  activePaperId?: string | null;
}

const PRESET_PAPERS = [
  {
    id: '2205.14135',
    title: 'FlashAttention',
    tag: 'IO-Aware GPU SRAM Tiling',
    url: 'https://arxiv.org/abs/2205.14135',
  },
  {
    id: '2312.00752',
    title: 'Mamba',
    tag: 'Selective State Space (S6)',
    url: 'https://arxiv.org/abs/2312.00752',
  },
  {
    id: '2106.09685',
    title: 'LoRA',
    tag: 'Low-Rank Adaptation',
    url: 'https://arxiv.org/abs/2106.09685',
  },
  {
    id: 'custom-dpo',
    title: 'Direct Preference Opt (DPO)',
    tag: 'Implicit Reward RLHF',
    url: 'https://arxiv.org/abs/2305.18290',
  },
  {
    id: 'custom-deepseek',
    title: 'DeepSeek-V3',
    tag: 'Multi-Head Latent Attention & MoE',
    url: 'https://arxiv.org/abs/2412.19437',
  },
];

export const PaperInputBar: React.FC<PaperInputBarProps> = ({
  onAnalyze,
  isLoading,
  activePaperId,
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [showPasteModal, setShowPasteModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customAbstract, setCustomAbstract] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;
    onAnalyze(inputVal.trim());
  };

  const handleSelectPreset = (url: string) => {
    setInputVal(url);
    onAnalyze(url);
  };

  const handleCustomSubmit = () => {
    if (!customTitle.trim() && !customAbstract.trim()) return;
    onAnalyze(customTitle || 'Custom Research Paper', {
      title: customTitle,
      abstract: customAbstract,
    });
    setShowPasteModal(false);
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Search Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center w-full bg-slate-900/95 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
      >
        <div className="flex items-center pl-3 pr-2 text-indigo-400">
          <Link2 className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Paste arXiv paper URL (e.g. arxiv.org/abs/2205.14135), arXiv ID, or paper title..."
          disabled={isLoading}
          className="flex-1 bg-transparent py-2.5 px-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
        />

        <div className="flex items-center gap-1.5 pr-1">
          <button
            type="button"
            onClick={() => setShowPasteModal(true)}
            disabled={isLoading}
            className="hidden sm:flex items-center gap-1 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-slate-700/60 transition"
            title="Paste paper abstract directly"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Paste Abstract</span>
          </button>

          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white transition-all shadow-md ${
              !inputVal.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/40'
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-600/30'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Paper...</span>
              </>
            ) : (
              <>
                <span>Analyze Paper</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Seminal Papers Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1 pl-1">
          <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
          Seminal Papers:
        </span>
        {PRESET_PAPERS.map((preset) => {
          const isActive =
            activePaperId === preset.id ||
            inputVal.includes(preset.id) ||
            (preset.id.startsWith('custom') && inputVal.includes(preset.title));

          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.url)}
              disabled={isLoading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/70 shadow-sm'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <span className="font-semibold">{preset.title}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
                ({preset.tag})
              </span>
            </button>
          );
        })}
      </div>

      {/* Paste Abstract Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                Analyze Custom Paper or Abstract
              </h4>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Paper Title
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Speculative Decoding with Draft Ensembles"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Paper Abstract or Architectural Summary
                </label>
                <textarea
                  value={customAbstract}
                  onChange={(e) => setCustomAbstract(e.target.value)}
                  placeholder="Paste the paper abstract, problem statement, or key architectural details here..."
                  rows={6}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomSubmit}
                disabled={!customTitle.trim() && !customAbstract.trim()}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium transition"
              >
                Extract Architecture & Opportunities
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
