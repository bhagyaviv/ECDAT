import React from 'react';
import { RiskLevel, AlgorithmCategory } from '../../types';

export const RiskBadge: React.FC<{ level: RiskLevel; size?: 'sm' | 'md' }> = ({ level, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs font-semibold' : 'px-3 py-1 text-sm font-semibold';
  
  switch (level) {
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/20 text-rose-200 border-t border-l border-rose-400/40 border-r border-b border-rose-500/20 shadow-md backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5 animate-pulse shadow-sm shadow-rose-400" />
          CRITICAL RISK
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center rounded-full bg-orange-500/20 text-orange-200 border-t border-l border-orange-400/40 border-r border-b border-orange-500/20 shadow-md backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5 shadow-sm shadow-orange-400" />
          HIGH RISK
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-500/20 text-amber-200 border-t border-l border-amber-400/40 border-r border-b border-amber-500/20 shadow-md backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 shadow-sm shadow-amber-400" />
          MEDIUM RISK
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/20 text-emerald-200 border-t border-l border-emerald-400/40 border-r border-b border-emerald-500/20 shadow-md backdrop-blur-md ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 shadow-sm shadow-emerald-400" />
          LOW (QUANTUM SAFE)
        </span>
      );
  }
};

export const CategoryBadge: React.FC<{ category: AlgorithmCategory }> = ({ category }) => {
  const labels: Record<AlgorithmCategory, { text: string; bg: string; textCol: string; border: string }> = {
    ASYMMETRIC: { text: 'Asymmetric Key', bg: 'bg-purple-500/15', textCol: 'text-purple-200', border: 'border-purple-400/30' },
    SYMMETRIC: { text: 'Symmetric Cipher', bg: 'bg-emerald-500/15', textCol: 'text-emerald-200', border: 'border-emerald-400/30' },
    HASH: { text: 'Hash Function', bg: 'bg-rose-500/15', textCol: 'text-rose-200', border: 'border-rose-400/30' },
    KEY_EXCHANGE: { text: 'Key Agreement', bg: 'bg-cyan-500/15', textCol: 'text-cyan-200', border: 'border-cyan-400/30' },
    PROTOCOL: { text: 'Security Protocol', bg: 'bg-blue-500/15', textCol: 'text-blue-200', border: 'border-blue-400/30' },
  };

  const item = labels[category] || labels.ASYMMETRIC;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border-t border-l ${item.border} border-r border-b border-white/5 ${item.bg} ${item.textCol} shadow-sm backdrop-blur-md`}>
      {item.text}
    </span>
  );
};

export const MoscaBadge: React.FC<{ isViolating: boolean }> = ({ isViolating }) => {
  if (isViolating) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-200 border-t border-l border-rose-400/40 border-r border-b border-rose-500/20 backdrop-blur-md shadow-sm">
        <span className="mr-1">⚠️</span> X+Y &gt; Z (HNDL Threat)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border-t border-l border-emerald-400/40 border-r border-b border-emerald-500/20 backdrop-blur-md shadow-sm">
      <span className="mr-1">✓</span> Mosca Safe
    </span>
  );
};
