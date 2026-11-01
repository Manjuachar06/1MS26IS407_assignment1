import React, { useState } from 'react';
import { CoreConcepts } from '../types/research';
import {
  FileText,
  Lightbulb,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
} from 'lucide-react';

interface CoreConceptViewProps {
  concepts: CoreConcepts;
  paperTitle: string;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({ concepts, paperTitle }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Compute exact word count
  const allText = `${concepts.problemStatement} ${concepts.primaryMethodology} ${concepts.breakthroughs}`.trim();
  const wordCount = allText ? allText.split(/\s+/).filter(Boolean).length : 0;
  const isCompliant = wordCount <= 300;

  const handleCopySummary = () => {
    const markdown = `### Core Concept Extraction: ${paperTitle}

**1. Problem Statement:**
${concepts.problemStatement}

**2. Primary Methodology:**
${concepts.primaryMethodology}

**3. Mathematical & Algorithmic Breakthroughs:**
${concepts.breakthroughs}

*Word Count: ${wordCount} words (Under 300-word limit)*`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const narrative = `Core Concept Summary for ${paperTitle}. Problem Statement: ${concepts.problemStatement}. Methodology: ${concepts.primaryMethodology}. Breakthroughs: ${concepts.breakthroughs}.`;
      const utterance = new SpeechSynthesisUtterance(narrative);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md">
      {/* Header bar with word count badge and action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Core Concept Extraction
              <span className="text-xs font-normal text-slate-400 hidden sm:inline">
                (Plain, Accessible Language)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Problem framing, methodology, and mathematical breakthroughs synthesized under 300 words
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Word Count Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              isCompliant
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
            }`}
            title="Word count validation (Under 300 words target)"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-mono font-semibold">{wordCount}</span> / 300 words
          </div>

          {/* Text-to-speech audio narration */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSpeaking
                ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Listen to audio briefing"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen Briefing'}</span>
          </button>

          {/* Copy summary */}
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title="Copy formatted summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Problem Statement */}
        <div className="flex flex-col bg-slate-950/70 border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-rose-200">1. Problem Statement</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed flex-1">
            {concepts.problemStatement}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
            {concepts.problemStatement.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Pillar 2: Primary Methodology */}
        <div className="flex flex-col bg-slate-950/70 border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-indigo-200">2. Primary Methodology</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed flex-1">
            {concepts.primaryMethodology}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
            {concepts.primaryMethodology.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Pillar 3: Algorithmic & Mathematical Breakthroughs */}
        <div className="flex flex-col bg-slate-950/70 border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700/80 transition-all">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-emerald-200">3. Mathematical Breakthroughs</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed flex-1">
            {concepts.breakthroughs}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
            {concepts.breakthroughs.split(/\s+/).filter(Boolean).length} words
          </div>
        </div>
      </div>
    </div>
  );
};
