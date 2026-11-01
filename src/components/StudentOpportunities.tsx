import React, { useState } from 'react';
import { StudentProject } from '../types/research';
import {
  GraduationCap,
  Target,
  Wrench,
  TrendingUp,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Code2,
  Calendar,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface StudentOpportunitiesProps {
  projects: StudentProject[];
  paperTitle: string;
}

export const StudentOpportunities: React.FC<StudentOpportunitiesProps> = ({ projects, paperTitle }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedCodeModal, setSelectedCodeModal] = useState<StudentProject | null>(null);

  const handleCopyBullet = (bullet: string, idx: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const generateStarterCode = (proj: StudentProject) => {
    return `# Starter Scaffold: ${proj.title}
# Target Stack: ${proj.techStack}
# Goal: ${proj.targetedMetric}

import torch
import torch.nn as nn
from typing import Optional, Tuple

class StudentExtensionModule(nn.Module):
    """
    Implementation scaffold for: ${proj.exactExtension}
    Target Metric: ${proj.targetedMetric}
    """
    def __init__(self, d_model: int = 512, **kwargs):
        super().__init__()
        self.d_model = d_model
        print(f"[Init] Initializing student research module with d_model={d_model}")
        # Scaffold linear transformation & student extension blocks
        self.in_proj = nn.Linear(d_model, d_model * 2)
        self.out_proj = nn.Linear(d_model * 2, d_model)
        self.norm = nn.LayerNorm(d_model)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Input tensor shape: [batch_size, seq_len, d_model]
        residual = x
        projected = self.in_proj(x)
        # Apply custom student optimization/quantization hook
        out = self.out_proj(projected)
        return self.norm(out + residual)

def run_benchmark():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Running latency and memory benchmark on: {device}")
    model = StudentExtensionModule().to(device)
    dummy_input = torch.randn(4, 1024, 512, device=device)
    
    # Warmup
    for _ in range(5):
        _ = model(dummy_input)
        
    start_time = torch.cuda.Event(enable_timing=True)
    end_time = torch.cuda.Event(enable_timing=True)
    
    start_time.record()
    for _ in range(50):
        _ = model(dummy_input)
    end_time.record()
    torch.cuda.synchronize()
    
    elapsed = start_time.elapsed_time(end_time) / 50.0
    print(f"Average step latency: {elapsed:.2f} ms")

if __name__ == "__main__":
    run_benchmark()
`;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Future Work & Internship Project Blueprints
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                3rd-Year CS Student
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-impact extensions, targeted metrics, tech stacks, and interview-ready STAR resume bullets
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Portfolio & Resume Ready
        </div>
      </div>

      {/* Projects Grid / Accordion */}
      <div className="space-y-4">
        {projects.map((proj, idx) => {
          const isExpanded = expandedIndex === idx;
          const techList = proj.techStack.split(',').map((t) => t.trim());

          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-slate-950/90 border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-lg'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Card Header (Clickable) */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="flex items-start justify-between gap-3 p-4 cursor-pointer select-none"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                      Idea #{idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                        proj.difficulty === 'Beginner-Friendly'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800/50'
                          : proj.difficulty === 'Intermediate 3rd Year'
                          ? 'bg-sky-950 text-sky-300 border-sky-800/50'
                          : 'bg-purple-950 text-purple-300 border-purple-800/50'
                      }`}
                    >
                      {proj.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {proj.timeline}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-semibold text-slate-100 hover:text-indigo-300 transition-colors">
                    {proj.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Target className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="line-clamp-1">
                      <strong className="text-slate-300 font-medium">Metric:</strong> {proj.targetedMetric}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCodeModal(proj);
                    }}
                    className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                    title="View starter code scaffold"
                  >
                    <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Starter Code</span>
                  </button>

                  <div className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 space-y-4">
                  {/* Exact Extension Statement */}
                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs">
                    <span className="font-semibold text-indigo-300 block mb-1">
                      Exact Extension:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">{proj.exactExtension}</p>
                  </div>

                  {/* Two column metrics & tech stack */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Targeted Performance Metric */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-300 font-semibold">
                        <TrendingUp className="w-4 h-4 text-rose-400" />
                        Targeted Performance Metric:
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                        {proj.targetedMetric}
                      </p>
                    </div>

                    {/* Recommended Tech Stack */}
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-sky-300 font-semibold">
                        <Wrench className="w-4 h-4 text-sky-400" />
                        Recommended Tech Stack:
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {techList.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[11px] border border-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resume Bullet Generator (STAR Format) */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Ready-to-Use Resume Bullet (STAR Method)</span>
                      </div>
                      <button
                        onClick={() => handleCopyBullet(proj.resumeBullet, idx)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium transition"
                        title="Copy resume bullet point"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <blockquote className="text-xs text-slate-200 italic font-serif pl-3 border-l-2 border-indigo-400">
                      &ldquo;{proj.resumeBullet}&rdquo;
                    </blockquote>
                  </div>

                  {/* Milestone Implementation Steps */}
                  {proj.steps && proj.steps.length > 0 && (
                    <div className="space-y-2 text-xs">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        Milestone Implementation Roadmap:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {proj.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/70"
                          >
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                              W{sIdx + 1}
                            </span>
                            <span className="text-slate-300 text-[11px] leading-snug">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mobile Starter Code Button */}
                  <div className="sm:hidden pt-1">
                    <button
                      onClick={() => setSelectedCodeModal(proj)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
                    >
                      <Code2 className="w-4 h-4" />
                      View Python / C++ Starter Scaffold
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Starter Code Modal */}
      {selectedCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                  Boilerplate Scaffold: {selectedCodeModal.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedCodeModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 bg-slate-950">
              <pre className="p-3 bg-black/50 rounded-lg border border-slate-800/80 overflow-x-auto leading-relaxed">
                <code>{generateStarterCode(selectedCodeModal)}</code>
              </pre>
            </div>

            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">
                Tech: {selectedCodeModal.techStack}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateStarterCode(selectedCodeModal));
                  alert('Starter code copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
              >
                Copy Boilerplate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
