import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = '' }) => {
  switch (level) {
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-rose-200 text-rose-950 border border-rose-400 shadow-sm ${className}`}>
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
          <span>CRITICAL RISK</span>
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-950 border border-amber-400 shadow-sm ${className}`}>
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          <span>HIGH RISK</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-yellow-200 text-yellow-950 border border-yellow-400 shadow-sm ${className}`}>
          <span className="w-2 h-2 rounded-full bg-yellow-600" />
          <span>MEDIUM RISK</span>
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-200 text-emerald-950 border border-emerald-400 shadow-sm ${className}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>LOW (QUANTUM SAFE)</span>
        </span>
      );
    default:
      return null;
  }
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'ASYMMETRIC':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-200 text-purple-950 border border-purple-400">
          Asymmetric Key
        </span>
      );
    case 'SYMMETRIC':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-200 text-emerald-950 border border-emerald-400">
          Symmetric Cipher
        </span>
      );
    case 'HASH':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-200 text-rose-950 border border-rose-400">
          Hash Function
        </span>
      );
    case 'KEY_EXCHANGE':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-sky-200 text-sky-950 border border-sky-400">
          Key Exchange
        </span>
      );
    case 'PROTOCOL':
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-200 text-indigo-950 border border-indigo-400">
          Security Protocol
        </span>
      );
    default:
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-200 text-slate-950 border border-slate-400">
          {category}
        </span>
      );
  }
};

export const MoscaBadge: React.FC<{ isViolating: boolean }> = ({ isViolating }) => {
  if (isViolating) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-200 text-rose-950 border border-rose-400">
        <ShieldAlert className="w-3.5 h-3.5 text-rose-800 stroke-[2.5]" />
        <span>Violated (X+Y &gt; Z)</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-200 text-emerald-950 border border-emerald-400">
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 stroke-[2.5]" />
      <span>Protected (Safe)</span>
    </span>
  );
};
