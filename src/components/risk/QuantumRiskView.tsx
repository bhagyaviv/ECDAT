import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { MoscaBadge, RiskBadge } from '../common/Badge';
import { 
  Clock, 
  Cpu, 
  Network, 
  ArrowRight, 
  ShieldAlert, 
  ShieldCheck 
} from 'lucide-react';

export const QuantumRiskView: React.FC = () => {
  const { 
    assets, 
    selectedAssetId, 
    setSelectedAssetId, 
    navigateToAssetInGraph, 
    filterRisk
  } = useCrypto();

  const [selectedQuantumAlg, setSelectedQuantumAlg] = useState<'ALL' | 'SHOR' | 'GROVER'>('ALL');

  const filteredAssets = assets.filter(a => {
    if (filterRisk !== 'ALL' && a.riskLevel !== filterRisk) return false;
    if (selectedQuantumAlg === 'SHOR') return a.category === 'ASYMMETRIC' || a.category === 'KEY_EXCHANGE' || a.category === 'PROTOCOL';
    if (selectedQuantumAlg === 'GROVER') return a.category === 'SYMMETRIC' || a.category === 'HASH';
    return true;
  });

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Quantum Threat &amp; Mosca Countdown Analyzer
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs bg-rose-200 text-rose-950 font-black border border-rose-400">
              The 6-Year Horizon
            </span>
          </div>
          <p className="text-xs text-slate-900 font-bold mt-1">
            Understanding why traditional encryption breaks and why adversaries steal encrypted data today (&ldquo;Harvest Now, Decrypt Later&rdquo;).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateToAssetInGraph(selectedAsset.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-card text-black text-xs font-black hover:border-slate-400 transition-all cursor-pointer border border-slate-300 shadow-sm"
          >
            <Network className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="text-black font-black">See What Breaks in Graph</span>
          </button>
        </div>
      </div>

      {/* Glass Mosca Theorem Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm border border-slate-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-300 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-950 stroke-[2.5]" />
              <h2 className="text-sm font-black text-black uppercase tracking-wider">
                Mosca&apos;s Theorem Explained in 10 Seconds
              </h2>
            </div>
            <p className="text-xs text-slate-900 font-bold">
              If your data needs to stay secret for longer than the time it takes for Quantum computers to arrive, you are in immediate danger today.
            </p>
          </div>

          <div className="flex items-center gap-2.5 glass-card rounded-2xl px-4 py-2 text-center text-xs border border-slate-300">
            <span className="font-black text-rose-950 text-sm">X + Y &gt; Z</span>
            <span className="text-slate-600 font-black">&rarr;</span>
            <span className="font-black text-rose-950 bg-rose-200 px-2.5 py-0.5 rounded-full border border-rose-400">
              Danger: Immediate Upgrade Needed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl glass-card space-y-1.5 border border-slate-300 bg-white/80">
            <div className="flex items-center justify-between text-sky-950 font-black">
              <span>X: Data Shelf-Life</span>
              <span>Years Needed</span>
            </div>
            <p className="text-slate-900 font-bold leading-relaxed">
              How many years your sensitive passwords, health records, or tokens must stay private (e.g. 7 years).
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-card space-y-1.5 border border-slate-300 bg-white/80">
            <div className="flex items-center justify-between text-amber-950 font-black">
              <span>Y: Migration Time</span>
              <span>Years Needed</span>
            </div>
            <p className="text-slate-900 font-bold leading-relaxed">
              How long it takes your engineering team to replace all old keys across apps and servers (e.g. 2 years).
            </p>
          </div>

          <div className="p-4 rounded-2xl glass-card space-y-1.5 border border-slate-300 bg-white/80">
            <div className="flex items-center justify-between text-rose-950 font-black">
              <span>Z: Quantum Arrival</span>
              <span>~6 Years (2032)</span>
            </div>
            <p className="text-slate-900 font-bold leading-relaxed">
              Estimated years until Quantum Computers exist that can easily crack classical encryption.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Glass Cards: What Breaks vs What Survives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Shor's Algorithm Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-400 space-y-3 shadow-sm bg-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-900 stroke-[2.5]" />
              <h3 className="text-sm font-black text-black">
                What Breaks: Asymmetric Keys (RSA, ECC)
              </h3>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-400">
              0 Bits Safe (Broken)
            </span>
          </div>

          <p className="text-xs text-slate-900 font-bold leading-relaxed">
            Quantum computers use <strong>Shor&apos;s Algorithm</strong> to solve math factors in seconds. This completely cracks website logins, digital signatures, and TLS certificates.
          </p>

          <div className="p-3.5 rounded-2xl bg-rose-200/80 border border-rose-400 text-xs space-y-1.5 font-bold">
            <div className="flex justify-between text-black">
              <span>RSA-2048 / RSA-4096:</span>
              <span className="text-rose-950 font-black">❌ 0 bits (Cracked)</span>
            </div>
            <div className="flex justify-between text-black">
              <span>ECDSA P-256 (TLS Certs):</span>
              <span className="text-rose-950 font-black">❌ 0 bits (Cracked)</span>
            </div>
            <div className="flex justify-between text-black">
              <span>Diffie-Hellman (VPN):</span>
              <span className="text-rose-950 font-black">❌ 0 bits (Cracked)</span>
            </div>
          </div>
        </div>

        {/* Grover's Algorithm Breakdown */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-400 space-y-3 shadow-sm bg-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-900 stroke-[2.5]" />
              <h3 className="text-sm font-black text-black">
                What Survives: Symmetric Ciphers (AES-256)
              </h3>
            </div>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-400">
              128 Bits Safe (Survivable)
            </span>
          </div>

          <p className="text-xs text-slate-900 font-bold leading-relaxed">
            Quantum computers use <strong>Grover&apos;s Algorithm</strong> to speed up database searches. It only halves key sizes ($256 \to 128$ bits). 128-bit security is still mathematically unbreakable!
          </p>

          <div className="p-3.5 rounded-2xl bg-emerald-200/80 border border-emerald-400 text-xs space-y-1.5 font-bold">
            <div className="flex justify-between text-black">
              <span>AES-256-GCM (Database):</span>
              <span className="text-emerald-950 font-black">✓ 128 bits (Safe)</span>
            </div>
            <div className="flex justify-between text-black">
              <span>SHA-384 Hashes:</span>
              <span className="text-emerald-950 font-black">✓ 192 bits (Safe)</span>
            </div>
            <div className="flex justify-between text-black">
              <span>AES-128 (Legacy):</span>
              <span className="text-amber-950 font-black">⚠️ 64 bits (Upgrade to 256)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Glass Asset Table */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-black">
              Mosca Countdown Table for Discovered Keys
            </h2>
            <p className="text-xs text-slate-800 font-bold">
              Comparing Data Lifetime vs Quantum Arrival for each encryption key.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSelectedQuantumAlg('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-black ${
                selectedQuantumAlg === 'ALL'
                  ? 'bg-sky-300 text-black border border-sky-500'
                  : 'glass-card text-black border border-slate-300'
              }`}
            >
              All 6 Keys
            </button>
            <button
              onClick={() => setSelectedQuantumAlg('SHOR')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-black ${
                selectedQuantumAlg === 'SHOR'
                  ? 'bg-rose-200 text-rose-950 border border-rose-400'
                  : 'glass-card text-black border border-slate-300'
              }`}
            >
              Vulnerable (Shor)
            </button>
            <button
              onClick={() => setSelectedQuantumAlg('GROVER')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-black ${
                selectedQuantumAlg === 'GROVER'
                  ? 'bg-emerald-200 text-emerald-950 border border-emerald-400'
                  : 'glass-card text-black border border-slate-300'
              }`}
            >
              Safe (Grover)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-300 text-black border-b border-slate-400">
                <th className="py-3.5 px-4 font-black text-black">Key Name</th>
                <th className="py-3.5 px-4 font-black text-black">Shelf Life (X)</th>
                <th className="py-3.5 px-4 font-black text-black">Migration Time (Y)</th>
                <th className="py-3.5 px-4 font-black text-black">Quantum Horizon (Z)</th>
                <th className="py-3.5 px-4 font-black text-black">Is it Safe?</th>
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
                      isSelected ? 'bg-sky-200 border-l-4 border-l-sky-800' : 'hover:bg-white/80'
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-black text-black text-[13px]">{asset.name}</div>
                      <div className="text-[11px] text-slate-800 font-bold">{asset.location}</div>
                    </td>

                    <td className="py-3.5 px-4 text-sky-950 font-black">
                      {asset.mosca.dataLifetimeYears} Years
                    </td>

                    <td className="py-3.5 px-4 text-amber-950 font-black">
                      {asset.mosca.migrationTimeYears} Years
                    </td>

                    <td className="py-3.5 px-4 text-rose-950 font-black">
                      {asset.mosca.threatTimelineYears} Years
                    </td>

                    <td className="py-3.5 px-4">
                      <MoscaBadge isViolating={asset.mosca.isViolating} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToAssetInGraph(asset.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-200 hover:bg-sky-300 border border-sky-400 text-black text-xs font-black transition-all inline-flex items-center gap-1 cursor-pointer"
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
      </div>

    </div>
  );
};
