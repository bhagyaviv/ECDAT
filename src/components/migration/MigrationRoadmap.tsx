import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { RiskBadge } from '../common/Badge';
import { 
  GitFork, 
  Code2, 
  Network, 
  ChevronDown, 
  ChevronUp, 
  Bot,
  ArrowRight
} from 'lucide-react';

export const MigrationRoadmap: React.FC = () => {
  const { 
    assets, 
    selectedAssetId, 
    setSelectedAssetId, 
    navigateToAssetInGraph, 
    triggerCannedPrompt 
  } = useCrypto();

  const [expandedAssetId, setExpandedAssetId] = useState<string>(selectedAssetId);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PHASE_1' | 'PHASE_2' | 'COMPLIANT'>('ALL');

  const filteredAssets = assets.filter(a => {
    if (activeTab === 'PHASE_1') return a.pqcRecommendation.migrationPhase.includes('Phase 1');
    if (activeTab === 'PHASE_2') return a.pqcRecommendation.migrationPhase.includes('Phase 2');
    if (activeTab === 'COMPLIANT') return a.pqcRecommendation.migrationPhase.includes('Compliant');
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Post-Quantum Migration Plan &amp; Code Fixes
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs bg-sky-200 text-sky-950 font-black border border-sky-400">
              NIST Approved Standards
            </span>
          </div>
          <p className="text-xs text-slate-900 font-bold mt-1">
            Copy-paste code playbooks to upgrade vulnerable classical encryption keys to official NIST Post-Quantum standards.
          </p>
        </div>

        <button
          onClick={() => triggerCannedPrompt('WHAT_MIGRATE')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-300 hover:bg-purple-200 text-black text-xs font-black shadow-md border border-purple-500 transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4 text-black stroke-[2.5]" />
          <span className="text-black font-black">Ask AI Migration Advice</span>
        </button>
      </div>

      {/* 4 Standards Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass-card p-4 rounded-2xl space-y-1 border border-slate-300 bg-white/80">
          <span className="text-xs font-black text-sky-950">FIPS 203 (ML-KEM)</span>
          <p className="text-[11px] text-slate-900 font-bold leading-relaxed">For Quantum-Safe TLS &amp; VPN Key Exchange (Kyber-768).</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border border-slate-300 bg-white/80">
          <span className="text-xs font-black text-blue-950">FIPS 204 (ML-DSA)</span>
          <p className="text-[11px] text-slate-900 font-bold leading-relaxed">For Quantum-Safe JWT &amp; Auth Signatures (Dilithium-65).</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border border-slate-300 bg-white/80">
          <span className="text-xs font-black text-purple-950">FIPS 205 (SLH-DSA)</span>
          <p className="text-[11px] text-slate-900 font-bold leading-relaxed">For Long-Term Root Authority Signatures (SPHINCS+).</p>
        </div>

        <div className="glass-card p-4 rounded-2xl space-y-1 border border-emerald-400 bg-emerald-200/90">
          <span className="text-xs font-black text-emerald-950">AES-256-GCM</span>
          <p className="text-[11px] text-emerald-950 font-bold leading-relaxed">Already Quantum Resistant (Maintain in database vault).</p>
        </div>
      </div>

      {/* Tab Filter */}
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 overflow-x-auto text-xs shadow-sm border border-slate-300">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-black ${
            activeTab === 'ALL'
              ? 'bg-sky-300 text-black border border-sky-500'
              : 'text-slate-800 hover:text-black'
          }`}
        >
          All 6 Keys
        </button>

        <button
          onClick={() => setActiveTab('PHASE_1')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-black ${
            activeTab === 'PHASE_1'
              ? 'bg-rose-200 text-rose-950 border border-rose-400'
              : 'text-slate-800 hover:text-black'
          }`}
        >
          Phase 1: Fix Immediately (3 Keys)
        </button>

        <button
          onClick={() => setActiveTab('PHASE_2')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-black ${
            activeTab === 'PHASE_2'
              ? 'bg-amber-200 text-amber-950 border border-amber-400'
              : 'text-slate-800 hover:text-black'
          }`}
        >
          Phase 2: Near-Term Fix (2 Keys)
        </button>

        <button
          onClick={() => setActiveTab('COMPLIANT')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-black ${
            activeTab === 'COMPLIANT'
              ? 'bg-emerald-200 text-emerald-950 border border-emerald-400'
              : 'text-slate-800 hover:text-black'
          }`}
        >
          Safe: Maintain (1 Key)
        </button>
      </div>

      {/* Accordion Playbooks */}
      <div className="space-y-4">
        {filteredAssets.map((asset) => {
          const isExpanded = expandedAssetId === asset.id;

          return (
            <div
              key={asset.id}
              className={`glass-panel rounded-3xl overflow-hidden transition-all shadow-sm border ${
                isExpanded ? 'border-sky-500 shadow-md' : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => {
                  setExpandedAssetId(isExpanded ? '' : asset.id);
                  setSelectedAssetId(asset.id);
                }}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer bg-white/70 hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-sky-200 text-black border border-sky-400">
                    <GitFork className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-black">
                        {asset.name}
                      </h3>
                      <RiskBadge level={asset.riskLevel} />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-800 mt-1 font-bold">
                      <span className="text-sky-950 font-mono font-black">{asset.location}</span>
                      <span>&bull;</span>
                      <span>Dev Effort: ~{asset.pqcRecommendation.estimatedEffortWeeks} weeks</span>
                      <span>&bull;</span>
                      <span className="text-emerald-950 font-black">{asset.pqcRecommendation.migrationPhase}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToAssetInGraph(asset.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-sky-200 hover:bg-sky-300 border border-sky-400 text-black text-xs font-black transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Network className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                    <span className="text-black font-black">See Impact Map</span>
                  </button>

                  <div className="p-1 text-black">
                    {isExpanded ? <ChevronUp className="w-5 h-5 stroke-[2.5]" /> : <ChevronDown className="w-5 h-5 stroke-[2.5]" />}
                  </div>
                </div>
              </div>

              {/* Accordion Expanded Body */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-300 bg-white/95 space-y-4">
                  
                  {/* Upgrade Recommendation */}
                  <div className="p-4 rounded-2xl glass-card space-y-1.5 text-xs border border-slate-300 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sky-950">
                        Actionable Migration Recommendation:
                      </span>
                      <span className="font-black text-emerald-950">
                        Upgrade To: {asset.pqcRecommendation.nistStandard}
                      </span>
                    </div>

                    <p className="text-slate-900 font-bold leading-relaxed pt-1">
                      {asset.pqcRecommendation.recommendedAction}
                    </p>
                  </div>

                  {/* Code Diff Side by Side */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-black flex items-center gap-1.5">
                        <Code2 className="w-4 h-4 text-sky-900 stroke-[2.5]" />
                        <span>Code Migration Diff: Legacy &rarr; Post-Quantum Fix</span>
                      </span>
                      <span className="text-slate-800 font-black">Python / Config</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {/* Before */}
                      <div className="rounded-2xl border border-rose-400 bg-rose-100 overflow-hidden shadow-sm">
                        <div className="px-4 py-2 bg-rose-200 text-rose-950 font-black text-[11px] flex items-center justify-between border-b border-rose-300">
                          <span>Old Vulnerable Code</span>
                          <span className="text-rose-900">BEFORE</span>
                        </div>
                        <pre className="p-4 text-[11px] font-mono text-black font-bold overflow-x-auto leading-relaxed">
                          {asset.pqcRecommendation.codeSnippetBefore}
                        </pre>
                      </div>

                      {/* After */}
                      <div className="rounded-2xl border border-emerald-400 bg-emerald-100 overflow-hidden shadow-sm">
                        <div className="px-4 py-2 bg-emerald-200 text-emerald-950 font-black text-[11px] flex items-center justify-between border-b border-emerald-300">
                          <span>Quantum-Safe NIST Compliant Code</span>
                          <span className="text-emerald-900">AFTER (PQC)</span>
                        </div>
                        <pre className="p-4 text-[11px] font-mono text-black font-bold overflow-x-auto leading-relaxed">
                          {asset.pqcRecommendation.codeSnippetAfter}
                        </pre>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
