import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { RiskBadge, CategoryBadge } from '../common/Badge';
import { 
  Search, 
  Filter, 
  Layers, 
  Network, 
  Bot, 
  GitFork, 
  Code, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const CryptoAssetsTable: React.FC = () => {
  const { 
    assets, 
    selectedAssetId, 
    setSelectedAssetId, 
    navigateToAssetInGraph, 
    setActiveView,
    triggerCannedPrompt,
    filterRisk,
    setFilterRisk,
    searchQuery,
    setSearchQuery
  } = useCrypto();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredAssets = assets.filter((asset) => {
    const matchesRisk = filterRisk === 'ALL' || asset.riskLevel === filterRisk;
    const matchesCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      asset.name.toLowerCase().includes(query) ||
      asset.algorithm.toLowerCase().includes(query) ||
      asset.location.toLowerCase().includes(query) ||
      asset.dependencies.serviceName.toLowerCase().includes(query) ||
      asset.pqcRecommendation.nistStandard.toLowerCase().includes(query);

    return matchesRisk && matchesCategory && matchesSearch;
  });

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Cryptographic Inventory (CBOM)
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs bg-sky-200 text-sky-950 font-black border border-sky-400">
              6 Keys Discovered
            </span>
          </div>
          <p className="text-xs text-slate-900 font-bold mt-1">
            Click on any encryption key below to inspect its details and see its blast radius in the Impact Graph.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('IMPACT_GRAPH')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-card text-black text-xs font-black hover:border-slate-400 transition-all cursor-pointer shadow-sm border border-slate-300"
          >
            <Network className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="text-black font-black">Open Impact Map</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm border border-slate-300">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-900 stroke-[2.5] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by key name (RSA, AES, ECDSA), file, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-black font-bold placeholder-slate-700 focus:outline-none border border-slate-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 text-xs">
          <div className="flex items-center gap-1.5 glass-card px-3 py-2 rounded-xl border border-slate-300">
            <Filter className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <span className="text-slate-950 font-black">Risk:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-transparent text-black border-none outline-none text-xs font-black cursor-pointer"
            >
              <option value="ALL" className="text-black">All Risks</option>
              <option value="CRITICAL" className="text-black">Critical Risk</option>
              <option value="HIGH" className="text-black">High Risk</option>
              <option value="MEDIUM" className="text-black">Medium Risk</option>
              <option value="LOW" className="text-black">Low (Safe)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 glass-card px-3 py-2 rounded-xl border border-slate-300">
            <Layers className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <span className="text-slate-950 font-black">Type:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-black border-none outline-none text-xs font-black cursor-pointer"
            >
              <option value="ALL" className="text-black">All Types</option>
              <option value="ASYMMETRIC" className="text-black">Asymmetric (RSA/ECC)</option>
              <option value="SYMMETRIC" className="text-black">Symmetric (AES)</option>
              <option value="HASH" className="text-black">Hash Functions</option>
              <option value="KEY_EXCHANGE" className="text-black">Key Exchange</option>
              <option value="PROTOCOL" className="text-black">Protocols (TLS)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Table + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table Area */}
        <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden shadow-sm border border-slate-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-300 text-black border-b border-slate-400">
                  <th className="py-3.5 px-4 font-black text-black">Key &amp; Algorithm</th>
                  <th className="py-3.5 px-4 font-black text-black">Location</th>
                  <th className="py-3.5 px-4 font-black text-black">Risk Level</th>
                  <th className="py-3.5 px-4 font-black text-black">Affected Service</th>
                  <th className="py-3.5 px-4 font-black text-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {filteredAssets.map((asset) => {
                  const isSelected = asset.id === selectedAssetId;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-sky-200/90 border-l-4 border-l-sky-800' 
                          : 'hover:bg-white/80'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-black text-black text-[13px]">
                          {asset.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryBadge category={asset.category} />
                          <span className="text-black font-black">{asset.keySize}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-sky-950 font-mono font-black text-xs truncate max-w-[150px]">
                          {asset.location}
                        </div>
                        <div className="text-slate-900 font-bold text-[11px]">{asset.lineNumbers}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <RiskBadge level={asset.riskLevel} />
                      </td>

                      <td className="py-3.5 px-4 text-black font-black">
                        {asset.dependencies.serviceName}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToAssetInGraph(asset.id);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-200 hover:bg-sky-300 border border-sky-400 text-black text-xs font-black transition-all inline-flex items-center gap-1 cursor-pointer shadow-sm"
                          title="See what breaks in graph"
                        >
                          <span className="text-black font-black">Map</span>
                          <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="p-8 text-center text-slate-950 font-black text-xs">
              No encryption keys matched your search filter.
            </div>
          )}
        </div>

        {/* Side Inspector Pane */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-slate-300">
          <div className="flex items-center justify-between border-b border-slate-300 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-black stroke-[2.5]" />
              <span className="text-xs font-black text-black uppercase tracking-wider">
                Quick Inspector
              </span>
            </div>
            <RiskBadge level={selectedAsset.riskLevel} />
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <h2 className="text-base font-black text-black">
                {selectedAsset.name}
              </h2>
              <p className="text-xs font-mono text-sky-950 mt-0.5 font-black">
                {selectedAsset.location} ({selectedAsset.lineNumbers})
              </p>
            </div>

            {/* Quick Specs with Crisp Dark Text */}
            <div className="p-3.5 rounded-2xl glass-card space-y-2 border border-slate-300 bg-white/80">
              <div className="flex justify-between">
                <span className="text-slate-950 font-bold">Algorithm:</span>
                <span className="font-black text-black">{selectedAsset.algorithm} ({selectedAsset.keySize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-950 font-bold">Quantum Margin:</span>
                <span className={`font-black ${selectedAsset.cbom.quantumSecurityBits > 0 ? 'text-emerald-950' : 'text-rose-950 font-black'}`}>
                  {selectedAsset.cbom.quantumSecurityBits > 0 ? `${selectedAsset.cbom.quantumSecurityBits} bits (Safe)` : '0 bits (Breaks)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-950 font-bold">Status:</span>
                <span className="text-black font-black">{selectedAsset.cbom.nistStatus}</span>
              </div>
            </div>

            {/* What is the Risk */}
            <div className="space-y-1">
              <span className="font-black text-rose-950 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-900 stroke-[2.5]" />
                Why is it at risk?
              </span>
              <p className="text-black font-bold bg-rose-200/90 p-3.5 rounded-2xl border border-rose-400 leading-relaxed">
                {selectedAsset.quantumAttackVector}
              </p>
            </div>

            {/* Recommended Fix */}
            <div className="p-3.5 rounded-2xl bg-emerald-200/90 border border-emerald-400 space-y-1">
              <div className="text-emerald-950 font-black">
                Recommended Upgrade Target:
              </div>
              <p className="font-black text-black text-[13px]">
                {selectedAsset.pqcRecommendation.nistStandard}
              </p>
              <p className="text-emerald-950 font-bold text-[11px] leading-relaxed">
                {selectedAsset.pqcRecommendation.recommendedAction}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigateToAssetInGraph(selectedAsset.id)}
                className="w-full flex items-center justify-center gap-2 bg-sky-400 hover:bg-sky-300 text-black font-black py-3 px-3 rounded-2xl text-xs transition-all shadow-md shadow-sky-500/25 border border-sky-400 cursor-pointer"
              >
                <Network className="w-4 h-4 text-black stroke-[2.5]" />
                <span className="text-black font-black">See What Breaks in Impact Map</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => triggerCannedPrompt('WHY_RISKY')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-purple-200 hover:bg-purple-300 border border-purple-400 text-black text-xs font-black transition-all cursor-pointer shadow-sm"
                >
                  <Bot className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span className="text-black font-black">Ask AI Copilot</span>
                </button>

                <button
                  onClick={() => setActiveView('MIGRATION')}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl glass-card text-black text-xs font-black hover:border-slate-400 transition-all cursor-pointer shadow-sm border border-slate-300"
                >
                  <GitFork className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                  <span className="text-black font-black">View Code Diff</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
