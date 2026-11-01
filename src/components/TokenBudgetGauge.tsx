import React from 'react';
import { TokenStats } from '../types/research';
import { Activity, ShieldCheck, Zap, Database } from 'lucide-react';

interface TokenBudgetGaugeProps {
  stats: TokenStats;
}

export const TokenBudgetGauge: React.FC<TokenBudgetGaugeProps> = ({ stats }) => {
  const { promptTokens, responseTokens, totalTokens, budgetCap = 25000, efficiencyScore } = stats;
  const percentage = Math.min((totalTokens / budgetCap) * 100, 100);
  const remainingTokens = Math.max(budgetCap - totalTokens, 0);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              Operational Token Efficiency
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/40">
                Budget: &lt;25,000 tokens
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {efficiencyScore || `${((1 - totalTokens / budgetCap) * 100).toFixed(1)}%`} budget conserved
          </span>
          <span className="text-slate-400">
            <strong className="text-slate-200">{totalTokens.toLocaleString()}</strong> / {budgetCap.toLocaleString()} tokens
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/80">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage > 80
              ? 'bg-rose-500'
              : percentage > 50
              ? 'bg-amber-400'
              : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
          }`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>

      {/* Sub-breakdown badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-3 font-mono">
          <span>
            Input/Context: <strong className="text-slate-300">{promptTokens.toLocaleString()}</strong>
          </span>
          <span>•</span>
          <span>
            Response: <strong className="text-slate-300">{responseTokens.toLocaleString()}</strong>
          </span>
        </div>
        <div className="font-mono text-emerald-400/90">
          Remaining Headroom: {remainingTokens.toLocaleString()} tokens
        </div>
      </div>
    </div>
  );
};
