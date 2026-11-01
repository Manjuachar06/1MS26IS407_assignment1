import React, { useState, useEffect } from 'react';
import { PaperAnalysis } from './types/research';
import { MermaidViewer } from './components/MermaidViewer';
import { CoreConceptView } from './components/CoreConceptView';
import { StudentOpportunities } from './components/StudentOpportunities';
import { TokenBudgetGauge } from './components/TokenBudgetGauge';
import { PaperInputBar } from './components/PaperInputBar';
import { ExportDossierModal } from './components/ExportDossierModal';
import {
  Cpu,
  BookOpen,
  Share2,
  ExternalLink,
  Layers,
  GraduationCap,
  Sparkles,
  Zap,
  FileDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  Github,
} from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<PaperAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [activePaperId, setActivePaperId] = useState<string | null>('2205.14135');

  // Load default seminal paper (FlashAttention) on initial load
  useEffect(() => {
    handleAnalyzePaper('https://arxiv.org/abs/2205.14135');
  }, []);

  const handleAnalyzePaper = async (
    queryOrUrl: string,
    customPayload?: { title?: string; abstract?: string }
  ) => {
    setIsLoading(true);
    setErrorMsg(null);

    // Track active paper ID if arXiv
    const arxivMatch = queryOrUrl.match(/(?:arxiv\.org\/(?:abs|pdf)\/|arxiv:)?([0-9]{4}\.[0-9]{4,5})/i);
    if (arxivMatch) {
      setActivePaperId(arxivMatch[1]);
    } else {
      setActivePaperId(null);
    }

    try {
      const response = await fetch('/api/analyze-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: queryOrUrl,
          paperTitle: customPayload?.title,
          paperAbstract: customPayload?.abstract,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to extract paper analysis.');
      }

      setAnalysis(data);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMsg(err.message || 'Failed to analyze paper. Please check URL or query.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateChart = (newChart: string) => {
    if (analysis) {
      setAnalysis({
        ...analysis,
        flowchart: newChart,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                PaperArc
              </span>
              <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                CS Research Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Architectural extraction, Mermaid.js flowcharts &amp; student resume project blueprints
            </p>
          </div>
        </div>

        {/* Right header controls */}
        <div className="flex items-center gap-2.5">
          {analysis && (
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-medium transition shadow-sm"
              title="Export complete research dossier"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Dossier</span>
            </button>
          )}

          {analysis?.pdfUrl && (
            <a
              href={analysis.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition"
              title="Open arXiv original PDF"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Original PDF</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* Paper Input & Seminal Selector */}
        <section className="space-y-2">
          <PaperInputBar
            onAnalyze={handleAnalyzePaper}
            isLoading={isLoading}
            activePaperId={activePaperId}
          />
        </section>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/70 text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => handleAnalyzePaper('https://arxiv.org/abs/2205.14135')}
              className="underline hover:text-white ml-2 text-rose-300 font-medium"
            >
              Load FlashAttention preset
            </button>
          </div>
        )}

        {/* Loading Overlay State */}
        {isLoading && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-100">
                CS Research Agent Ingesting Paper
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Enforcing token-efficient parsing (&lt;25,000 tokens), generating Mermaid.js system architecture graph, and formulating 3rd-year CS student resume extensions...
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1 text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> arXiv Metadata Resolution
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Core Concept Extraction (&lt;300 words)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mermaid Architecture Flowchart
              </span>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {!isLoading && analysis && (
          <div className="space-y-6">
            {/* Paper Title & Metadata Card */}
            <div className="p-5 md:p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {analysis.arxivId && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-950/70 text-rose-300 font-mono border border-rose-800/50 font-medium">
                    arXiv:{analysis.arxivId}
                  </span>
                )}
                {analysis.category && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700/60">
                    {analysis.category}
                  </span>
                )}
                {analysis.published && (
                  <span className="text-slate-400 text-xs">Published: {analysis.published}</span>
                )}
                {analysis.source && (
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 bg-emerald-950/50 rounded border border-emerald-900/50">
                    Engine: {analysis.source}
                  </span>
                )}
              </div>

              <h1 className="text-lg sm:text-2xl font-bold text-slate-50 tracking-tight leading-snug">
                {analysis.title}
              </h1>

              {analysis.authors && analysis.authors.length > 0 && (
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300 font-medium">Authors:</strong>{' '}
                  {analysis.authors.join(', ')}
                </p>
              )}
            </div>

            {/* Step 1: Core Concept Extraction (<300 words) */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold pl-1">
                <span>Step 1: Core Concept Extraction</span>
              </div>
              <CoreConceptView
                concepts={analysis.coreConcepts}
                paperTitle={analysis.title}
              />
            </section>

            {/* Step 2: Architectural Flowchart (Mermaid.js) */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold pl-1">
                <span>Step 2: Architectural Flowchart (Mermaid.js graph TD)</span>
              </div>
              <MermaidViewer
                chart={analysis.flowchart}
                onUpdateChart={handleUpdateChart}
              />
            </section>

            {/* Step 3: Future Work & Internship Opportunities */}
            <section className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold pl-1">
                <span>Step 3: Future Work &amp; 3rd-Year Student Resume Projects</span>
              </div>
              <StudentOpportunities
                projects={analysis.studentProjects}
                paperTitle={analysis.title}
              />
            </section>

            {/* Operational Constraints & Token Efficiency Telemetry */}
            <section className="pt-2">
              <TokenBudgetGauge stats={analysis.tokenStats} />
            </section>
          </div>
        )}
      </main>

      {/* Export Dossier Modal */}
      {showExportModal && analysis && (
        <ExportDossierModal
          analysis={analysis}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Clean Academic Footer */}
      <footer className="mt-12 border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <p>
          PaperArc • Advanced Computer Science Research Agent • Operational Constraint: &lt;25k Token Budget
        </p>
      </footer>
    </div>
  );
}
