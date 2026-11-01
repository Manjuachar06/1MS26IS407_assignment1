import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Download,
  Code2,
  AlertCircle,
  Eye,
  Layers,
} from 'lucide-react';

interface MermaidViewerProps {
  chart: string;
  onUpdateChart?: (newChart: string) => void;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, onUpdateChart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editableChart, setEditableChart] = useState<string>(chart);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderId, setRenderId] = useState<number>(1);

  // Sync internal chart when prop changes
  useEffect(() => {
    setEditableChart(chart);
  }, [chart]);

  // Clean the mermaid chart text
  const sanitizeChart = (raw: string): string => {
    let clean = raw
      .replace(/\[FLOWCHART\]/gi, '')
      .replace(/```mermaid/gi, '')
      .replace(/```/gi, '')
      .trim();

    if (!clean.startsWith('graph')) {
      clean = `graph TD\n${clean}`;
    }
    return clean;
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      themeVariables: {
        darkMode: true,
        background: 'transparent',
        primaryColor: '#6366f1',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#4f46e5',
        lineColor: '#94a3b8',
        secondaryColor: '#3b82f6',
        tertiaryColor: '#1e293b',
        fontSize: '13px',
      },
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        setRenderError(null);
        const cleanSyntax = sanitizeChart(editableChart);
        const id = `mermaid-chart-${Date.now()}-${renderId}`;

        // Attempt parse first
        await mermaid.parse(cleanSyntax);

        const { svg } = await mermaid.render(id, cleanSyntax);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.warn('Mermaid rendering warning:', err);
        if (isMounted) {
          setRenderError(err.message || 'Syntax issue in Mermaid diagram. Please edit or reset.');
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [editableChart, renderId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableChart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportSVG = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-architecture-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = () => {
    if (!svgContent) return;
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * 2 || 1600;
      canvas.height = img.height * 2 || 1200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0b0f19';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `system-architecture-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const handleResetZoom = () => setScale(1);
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.4));

  return (
    <div
      className={`relative bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl ${
        isFullscreen ? 'fixed inset-4 z-50 bg-slate-950 flex flex-col' : 'w-full'
      }`}
    >
      {/* Top Header / Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-800/80 border-b border-slate-700/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              System Architecture Flowchart
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                Mermaid.js graph TD
              </span>
            </h3>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive visualization of components, data inputs, layers, and data outputs
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-900/80 border border-slate-700/70 rounded-lg p-0.5 text-xs text-slate-300">
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] min-w-[3rem] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1.5 hover:bg-slate-800 rounded hover:text-white transition-colors border-l border-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Live Editor */}
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showEditor
                ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Edit Mermaid Code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{showEditor ? 'Hide Code' : 'Edit Code'}</span>
          </button>

          {/* Export Dropdown / Actions */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title="Copy Mermaid.js Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title="Export as PNG image"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">PNG</span>
          </button>

          <button
            onClick={handleExportSVG}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title="Export as Vector SVG"
          >
            <span className="hidden md:inline">SVG</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body: Flowchart Canvas + Optional Editor Panel */}
      <div className={`grid ${showEditor ? 'lg:grid-cols-12' : 'grid-cols-1'} flex-1 overflow-hidden min-h-[380px]`}>
        {/* Mermaid Canvas Area */}
        <div
          ref={containerRef}
          className={`relative flex items-center justify-center p-6 overflow-auto academic-grid bg-[#0b101d] transition-all ${
            showEditor ? 'lg:col-span-7' : 'w-full'
          } ${isFullscreen ? 'h-full' : 'min-h-[420px] max-h-[620px]'}`}
        >
          {renderError ? (
            <div className="max-w-md p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs">
              <div className="flex items-center gap-2 mb-2 font-semibold text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Mermaid Syntax Error
              </div>
              <p className="font-mono bg-black/40 p-2 rounded mb-3 text-[11px] overflow-x-auto">
                {renderError}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditableChart(sanitizeChart(chart));
                    setRenderId((prev) => prev + 1);
                  }}
                  className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 rounded-lg text-white font-medium text-xs transition"
                >
                  Reset to Original Diagram
                </button>
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 text-xs transition"
                >
                  Open Code Editor
                </button>
              </div>
            </div>
          ) : svgContent ? (
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out',
              }}
              className="mermaid select-none flex items-center justify-center w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
              <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing system architecture...</span>
            </div>
          )}

          {/* Floating Flowchart Quick Legend */}
          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 backdrop-blur-md text-[11px] text-slate-300 pointer-events-none">
            <span className="text-slate-400 font-medium">Layers:</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Inputs
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Compute
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Memory/State
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Outputs
            </span>
          </div>
        </div>

        {/* Live Code Editor Side Panel */}
        {showEditor && (
          <div className="lg:col-span-5 flex flex-col bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
              <span className="font-mono text-indigo-300 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Mermaid.js Source [graph TD]
              </span>
              <button
                onClick={() => {
                  setRenderId((prev) => prev + 1);
                  if (onUpdateChart) onUpdateChart(editableChart);
                }}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-[11px] transition"
              >
                Re-Render Flowchart
              </button>
            </div>
            <textarea
              value={editableChart}
              onChange={(e) => setEditableChart(e.target.value)}
              className="flex-1 w-full p-3 font-mono text-xs text-slate-200 bg-slate-950/90 focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
              rows={14}
              placeholder="graph TD\n  In[Input] --> Out[Output]"
            />
            <div className="p-2.5 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Edit any node or edge to test architecture variations.</span>
              <button
                onClick={() => setEditableChart(sanitizeChart(chart))}
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Reset code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
