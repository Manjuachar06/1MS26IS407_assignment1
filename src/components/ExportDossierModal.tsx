import React, { useState } from 'react';
import { PaperAnalysis } from '../types/research';
import { Download, Copy, Check, X, FileText, Printer } from 'lucide-react';

interface ExportDossierModalProps {
  analysis: PaperAnalysis;
  onClose: () => void;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({ analysis, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const generateMarkdownReport = () => {
    return `# CS Research Agent Analysis Report: ${analysis.title}
**Authors:** ${analysis.authors?.join(', ') || 'Unknown'}  
**Category:** ${analysis.category || 'Computer Science'}  
**Source / arXiv:** ${analysis.url || analysis.arxivId || 'N/A'}  
**Date Analyzed:** ${new Date().toLocaleDateString()}  

---

## 1. CORE CONCEPT EXTRACTION (<300 Words)

### Problem Statement
${analysis.coreConcepts.problemStatement}

### Primary Methodology
${analysis.coreConcepts.primaryMethodology}

### Mathematical & Algorithmic Breakthroughs
${analysis.coreConcepts.breakthroughs}

*Word Count: ${
      `${analysis.coreConcepts.problemStatement} ${analysis.coreConcepts.primaryMethodology} ${analysis.coreConcepts.breakthroughs}`
        .trim()
        .split(/\s+/).length
    } words*

---

## 2. ARCHITECTURAL FLOWCHART (Mermaid.js)

\`\`\`mermaid
${analysis.flowchart}
\`\`\`

---

## 3. FUTURE WORK & 3RD-YEAR STUDENT RESUME OPPORTUNITIES

${analysis.studentProjects
  .map(
    (p, i) => `### Opportunity #${i + 1}: ${p.title}
- **Exact Extension:** ${p.exactExtension}
- **Targeted Performance Metric:** ${p.targetedMetric}
- **Recommended Tech Stack:** ${p.techStack}
- **Difficulty / Timeline:** ${p.difficulty} (${p.timeline})
- **Interview-Ready Resume Bullet (STAR Method):**
  > "${p.resumeBullet}"
- **Milestone Roadmap:**
${p.steps.map((s, idx) => `  ${idx + 1}. ${s}`).join('\n')}
`
  )
  .join('\n\n')}

---

## 4. OPERATIONAL EFFICIENCY AUDIT
- **Total Tokens Consumed:** ${analysis.tokenStats.totalTokens.toLocaleString()} / 25,000 budget cap
- **Efficiency Rating:** ${analysis.tokenStats.efficiencyScore}
- Generated via PaperArc CS Research Agent
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PaperArc-Research-Dossier-${analysis.title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-100">
              Research Dossier & Portfolio Export
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 space-y-4">
          <div className="p-4 bg-black/60 rounded-xl border border-slate-800/80">
            <pre className="whitespace-pre-wrap leading-relaxed font-mono text-[11px] text-slate-300">
              {generateMarkdownReport()}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Export formats: Markdown (.md), Plain Text, or Print to PDF
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
