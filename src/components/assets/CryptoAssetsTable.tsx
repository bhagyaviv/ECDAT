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
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Cryptographic Inventory (CBOM)
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs bg-sky-100 text-sky-900 font-bold border border-sky-300">
              6 Keys Discovered
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Click on any encryption key below to inspect its details and see its blast radius in the Impact Graph.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('IMPACT_GRAPH')}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-card text-sky-800 text-xs font-bold hover:border-sky-500 transition-all cursor-pointer"
          >
            <Network className="w-4 h-4" />
            <span>Open Impact Map</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by key name (RSA, AES, ECDSA), file, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-slate-950 font-medium placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 text-xs">
          <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-sky-700" />
            <span className="text-slate-700 font-bold">Risk:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-transparent text-slate-950 border-none outline-none text-xs font-bold cursor-pointer"
            >
              <option value="ALL">All Risks</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low (Safe)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 glass-card px-3 py-1.5 rounded-xl">
            <Layers className="w-3.5 h-3.5 text-purple-700" />
            <span className="text-slate-700 font-bold">Type:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-950 border-none outline-none text-xs font-bold cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="ASYMMETRIC">Asymmetric (RSA/ECC)</option>
              <option value="SYMMETRIC">Symmetric (AES)</option>
              <option value="HASH">Hash Functions</option>
              <option value="KEY_EXCHANGE">Key Exchange</option>
              <option value="PROTOCOL">Protocols (TLS)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Table + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Table Area */}
        <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-200/90 text-slate-800 border-b border-slate-300">
                  <th className="py-3.5 px-4 font-extrabold">Key &amp; Algorithm</th>
                  <th className="py-3.5 px-4 font-extrabold">Location</th>
                  <th className="py-3.5 px-4 font-extrabold">Risk Level</th>
                  <th className="py-3.5 px-4 font-extrabold">Affected Service</th>
                  <th className="py-3.5 px-4 font-extrabold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/70">
                {filteredAssets.map((asset) => {
                  const isSelected = asset.id === selectedAssetId;

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-sky-500/25 border-l-4 border-l-sky-600' 
                          : 'hover:bg-white/60'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-950">
                          {asset.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <CategoryBadge category={asset.category} />
                          <span className="text-slate-700 font-bold">{asset.keySize}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-sky-800 font-mono font-bold text-[11px] truncate max-w-[150px]">
                          {asset.location}
                        </div>
                        <div className="text-slate-600 font-medium text-[11px]">{asset.lineNumbers}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <RiskBadge level={asset.riskLevel} />
                      </td>

                      <td className="py-3.5 px-4 text-slate-900 font-bold">
                        {asset.dependencies.serviceName}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToAssetInGraph(asset.id);
                          }}
                          className="px-3 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-sky-900 text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          title="See what breaks in graph"
                        >
                          <span>Map</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="p-8 text-center text-slate-600 font-semibold text-xs">
              No encryption keys matched your search filter.
            </div>
          )}
        </div>

        {/* Side Inspector Pane */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-300 pb-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-sky-700" />
              <span className="text-xs font-extrabold text-slate-950 uppercase tracking-wider">
                Quick Inspector
              </span>
            </div>
            <RiskBadge level={selectedAsset.riskLevel} />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-950">
                {selectedAsset.name}
              </h2>
              <p className="text-xs font-mono text-sky-800 mt-0.5 font-bold">
                {selectedAsset.location} ({selectedAsset.lineNumbers})
              </p>
            </div>

            {/* Quick Specs */}
            <div className="p-3.5 rounded-2xl glass-card space-y-1.5 text-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Algorithm:</span>
                <span className="font-extrabold text-slate-950">{selectedAsset.algorithm} ({selectedAsset.keySize})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Quantum Margin:</span>
                <span className={`font-extrabold ${selectedAsset.cbom.quantumSecurityBits > 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {selectedAsset.cbom.quantumSecurityBits > 0 ? `${selectedAsset.cbom.quantumSecurityBits} bits (Safe)` : '0 bits (Breaks)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-semibold">Status:</span>
                <span className="text-slate-900 font-bold">{selectedAsset.cbom.nistStatus}</span>
              </div>
            </div>

            {/* What is the Risk */}
            <div className="space-y-1">
              <span className="font-bold text-rose-800 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                Why is it at risk?
              </span>
              <p className="text-slate-800 font-medium bg-rose-100/80 p-3 rounded-2xl border border-rose-300 leading-relaxed">
                {selectedAsset.quantumAttackVector}
              </p>
            </div>

            {/* Recommended Fix */}
            <div className="p-3.5 rounded-2xl bg-emerald-100/80 border border-emerald-300 space-y-1">
              <div className="text-emerald-900 font-bold">
                Recommended Upgrade Target:
              </div>
              <p className="font-extrabold text-slate-950">
                {selectedAsset.pqcRecommendation.nistStandard}
              </p>
              <p className="text-slate-700 font-medium text-[11px] leading-relaxed">
                {selectedAsset.pqcRecommendation.recommendedAction}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigateToAssetInGraph(selectedAsset.id)}
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all shadow-md shadow-sky-600/25 cursor-pointer"
              >
                <Network className="w-4 h-4" />
                <span>See What Breaks in Impact Map</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => triggerCannedPrompt('WHY_RISKY')}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-900 text-xs font-bold transition-all cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI Copilot</span>
                </button>

                <button
                  onClick={() => setActiveView('MIGRATION')}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl glass-card text-slate-900 text-xs font-bold hover:border-sky-500 transition-all cursor-pointer"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>View Code Diff</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
