import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { RiskBadge } from '../common/Badge';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Cpu, 
  ArrowRight, 
  Layers, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Bot 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { 
    stats, 
    assets, 
    navigateToAssetInGraph, 
    setActiveView, 
    setSelectedAssetId,
    triggerCannedPrompt,
    startScan
  } = useCrypto();

  const topPriorities = assets
    .filter(a => a.migrationPriority === 'CRITICAL' || a.migrationPriority === 'HIGH')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Frosted Hero Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 relative overflow-hidden shadow-sm border border-slate-300">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-sky-500/20 via-indigo-500/15 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-200 text-sky-950 text-xs font-black border border-sky-400">
              <Sparkles className="w-3.5 h-3.5 text-sky-950 stroke-[2.5]" />
              <span>SIH 2026 • NTRO Problem Statement SIH26164</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              Enterprise Cryptographic Health Dashboard
            </h1>
            
            <p className="text-sm text-slate-900 max-w-2xl leading-relaxed font-bold">
              <strong>Core Message:</strong> ECDAT doesn&apos;t just find cryptography — it shows <strong className="text-black">what is at risk</strong>, <strong className="text-black">what breaks</strong>, and <strong className="text-black">what to migrate first</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView('SCAN');
                startScan();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-black font-black text-xs shadow-md shadow-sky-500/25 border border-sky-400 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-black stroke-[2.5]" />
              <span className="text-black font-black">Run 5s Discovery Scan</span>
            </button>

            <button
              onClick={() => setActiveView('IMPACT_GRAPH')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card text-black font-black text-xs transition-all cursor-pointer hover:border-slate-400 border border-slate-300"
            >
              <span className="text-black font-black">See Impact Map ⭐</span>
              <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Frosted KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Quantum Health */}
        <div className="glass-card p-5 rounded-2xl space-y-3 border border-slate-300 bg-white/80">
          <div className="flex items-center justify-between text-xs text-black font-black">
            <span>Overall Quantum Health</span>
            <div className="p-2 rounded-xl bg-rose-200 text-rose-950 border border-rose-400">
              <Cpu className="w-4 h-4 text-rose-950 stroke-[2.5]" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-950">{stats.readinessScore}%</span>
            <span className="text-[11px] font-black text-rose-950 px-2 py-0.5 rounded-full bg-rose-200 border border-rose-400">
              Grade {stats.readinessGrade}
            </span>
          </div>

          <div className="w-full bg-slate-300 rounded-full h-2.5 overflow-hidden border border-slate-400">
            <div 
              className="bg-rose-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${stats.readinessScore}%` }}
            />
          </div>

          <p className="text-xs text-slate-900 font-bold">
            4 of 6 keys will break when Quantum arrives
          </p>
        </div>

        {/* 2. Discovered Keys */}
        <div className="glass-card p-5 rounded-2xl space-y-3 border border-slate-300 bg-white/80">
          <div className="flex items-center justify-between text-xs text-black font-black">
            <span>Discovered Encryption Keys</span>
            <div className="p-2 rounded-xl bg-sky-200 text-sky-950 border border-sky-400">
              <Layers className="w-4 h-4 text-sky-950 stroke-[2.5]" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black">{stats.totalAssets}</span>
            <span className="text-xs text-slate-900 font-bold">across 6 services</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-950 font-black">✓ 2 Safe (AES)</span>
            <span>•</span>
            <span className="text-rose-950 font-black">⚠️ 4 Vulnerable</span>
          </div>

          <p className="text-xs text-slate-900 font-bold">
            Full CBOM inventory extracted
          </p>
        </div>

        {/* 3. Urgent Danger */}
        <div className="glass-card p-5 rounded-2xl space-y-3 border border-slate-300 bg-white/80">
          <div className="flex items-center justify-between text-xs text-black font-black">
            <span>Urgent Countdown Danger</span>
            <div className="p-2 rounded-xl bg-amber-200 text-amber-950 border border-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-950 stroke-[2.5]" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-950">{stats.moscaViolationsCount} Keys</span>
          </div>

          <div className="text-xs text-amber-950 flex items-center gap-1 font-black">
            <Clock className="w-3.5 h-3.5 text-amber-950 stroke-[2.5]" />
            <span>Data shelf-life &gt; Quantum arrival</span>
          </div>

          <p className="text-xs text-slate-900 font-bold">
            Attackers are stealing encrypted data today
          </p>
        </div>

        {/* 4. Business Impact */}
        <div className="glass-card p-5 rounded-2xl space-y-3 border border-slate-300 bg-white/80">
          <div className="flex items-center justify-between text-xs text-black font-black">
            <span>Total Business Impact</span>
            <div className="p-2 rounded-xl bg-purple-200 text-purple-950 border border-purple-400">
              <ShieldAlert className="w-4 h-4 text-purple-950 stroke-[2.5]" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-black">$38.7M</span>
            <span className="text-xs text-rose-950 font-black">Risk / Year</span>
          </div>

          <div className="text-xs text-slate-900 font-bold">
            Affects Authentication &amp; Payment streams
          </div>

          <p className="text-xs text-slate-900 font-bold">
            User Passwords, Tokens &amp; VPN traffic
          </p>
        </div>

      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donut Chart Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4 border border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-black">
                Key Threat Distribution
              </h2>
              <p className="text-xs text-slate-800 font-bold">Classified by severity</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-300 text-black font-black border border-slate-400">
              6 Keys Total
            </span>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#cbd5e1', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    color: '#0f172a',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-300">
            {stats.riskDistribution.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-2.5 rounded-xl glass-card border border-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: r.color }} />
                  <span className="text-xs font-black text-black">{r.name} Risk</span>
                </div>
                <span className="text-xs font-black text-black">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Bar Chart Card */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4 border border-slate-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-black">
                The 6-Year Countdown (Mosca Theorem)
              </h2>
              <p className="text-xs text-slate-800 font-bold">
                <span className="text-rose-900 font-black">Red Bar (Data Lifetime)</span> should NEVER exceed <span className="text-sky-900 font-black">Blue Bar (Quantum Arrival ~6 yrs)</span>
              </p>
            </div>
            <button
              onClick={() => setActiveView('QUANTUM_RISK')}
              className="text-xs text-black hover:text-sky-900 flex items-center gap-1 font-black cursor-pointer"
            >
              <span>Explain Math</span>
              <ChevronRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.moscaComparisonData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.25)" horizontal={false} />
                <XAxis type="number" stroke="#000000" tick={{ fontSize: 11, fill: '#000000', fontWeight: 800 }} unit=" yrs" />
                <YAxis dataKey="name" type="category" stroke="#000000" tick={{ fontSize: 11, fill: '#000000', fontWeight: 800 }} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#cbd5e1', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    color: '#000000',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                  formatter={(val: any, name: any) => [`${val} Years`, name === 'needed' ? 'Data Lifetime + Migration' : 'Quantum Arrival Window']}
                />
                <Bar dataKey="needed" name="needed" fill="#e11d48" radius={[0, 6, 6, 0]} />
                <Bar dataKey="threat" name="threat" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-black font-black pt-2 border-t border-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-rose-600 rounded-md" />
              <span>Data Lifetime Window (Years)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-sky-600 rounded-md" />
              <span>Estimated Quantum Arrival (~6 yrs)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Top 3 Priorities: Frosted Action Cards */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-black">
                Top 3 Things to Fix Right Now
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-rose-200 text-rose-950 font-black border border-rose-400">
                Immediate Action
              </span>
            </div>
            <p className="text-xs text-slate-800 font-bold mt-0.5">
              These 3 keys will leak critical passwords and API tokens first if not upgraded.
            </p>
          </div>

          <button
            onClick={() => setActiveView('MIGRATION')}
            className="text-xs text-black hover:text-sky-900 flex items-center gap-1 font-black cursor-pointer"
          >
            <span>View All Code Fixes</span>
            <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPriorities.map((asset, idx) => (
            <div 
              key={asset.id} 
              className="p-5 rounded-2xl glass-card space-y-3 flex flex-col justify-between border border-slate-300 bg-white/80"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-black">
                    PRIORITY #{idx + 1}
                  </span>
                  <RiskBadge level={asset.riskLevel} />
                </div>

                <div>
                  <h3 className="text-sm font-black text-black">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-sky-950 mt-0.5 font-mono font-black">
                    {asset.location}
                  </p>
                </div>

                <p className="text-xs text-slate-900 font-bold line-clamp-2 leading-relaxed">
                  {asset.summary}
                </p>

                <div className="p-3 rounded-xl bg-slate-200 border border-slate-300 text-xs">
                  <div className="text-slate-950 font-bold">Recommended Fix:</div>
                  <div className="font-black text-emerald-950 mt-0.5">
                    {asset.pqcRecommendation.nistStandard}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-300 flex items-center gap-2">
                <button
                  onClick={() => navigateToAssetInGraph(asset.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-200 hover:bg-sky-300 border border-sky-400 text-black text-xs font-black transition-all cursor-pointer"
                  title="See what breaks in the Impact Graph"
                >
                  <span className="text-black font-black">See What Breaks</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                </button>

                <button
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    triggerCannedPrompt('WHY_RISKY');
                  }}
                  className="p-2 rounded-xl bg-purple-200 hover:bg-purple-300 border border-purple-400 text-black transition-all cursor-pointer"
                  title="Ask AI Copilot why this is risky"
                >
                  <Bot className="w-4 h-4 text-black stroke-[2.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
