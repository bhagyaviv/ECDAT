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
      <div className="rounded-3xl glass-panel p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-sky-500/20 via-indigo-500/15 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/90 text-sky-900 text-xs font-bold border border-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>SIH 2026 • NTRO Problem Statement SIH26164</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Enterprise Cryptographic Health Dashboard
            </h1>
            
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed font-medium">
              <strong>Core Message:</strong> ECDAT doesn&apos;t just find cryptography — it shows <strong>what is at risk</strong>, <strong>what breaks</strong>, and <strong>what to migrate first</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView('SCAN');
                startScan();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Run 5s Discovery Scan</span>
            </button>

            <button
              onClick={() => setActiveView('IMPACT_GRAPH')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card text-slate-800 font-bold text-xs transition-all cursor-pointer hover:text-sky-800"
            >
              <span>See Impact Map ⭐</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-700" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Frosted KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Quantum Health */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Overall Quantum Health</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 border border-rose-300">
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-700">{stats.readinessScore}%</span>
            <span className="text-[11px] font-bold text-rose-800 px-2 py-0.5 rounded-full bg-rose-100 border border-rose-300">
              Grade {stats.readinessGrade}
            </span>
          </div>

          <div className="w-full bg-slate-300/80 rounded-full h-2 overflow-hidden border border-white/60">
            <div 
              className="bg-gradient-to-r from-rose-600 to-amber-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${stats.readinessScore}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 font-medium">
            4 of 6 keys will break when Quantum arrives
          </p>
        </div>

        {/* 2. Discovered Keys */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Discovered Encryption Keys</span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-300">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalAssets}</span>
            <span className="text-xs text-slate-600 font-medium">across 6 services</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-700 font-bold">✓ 2 Safe (AES)</span>
            <span>•</span>
            <span className="text-rose-700 font-bold">⚠️ 4 Vulnerable</span>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            Full CBOM inventory extracted
          </p>
        </div>

        {/* 3. Urgent Danger */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Urgent Countdown Danger</span>
            <div className="p-2 rounded-xl bg-orange-100 text-orange-700 border border-orange-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-orange-700">{stats.moscaViolationsCount} Keys</span>
          </div>

          <div className="text-xs text-orange-800 flex items-center gap-1 font-bold">
            <Clock className="w-3.5 h-3.5 text-orange-600" />
            <span>Data shelf-life &gt; Quantum arrival</span>
          </div>

          <p className="text-xs text-slate-600 font-medium">
            Attackers are stealing encrypted data today
          </p>
        </div>

        {/* 4. Business Impact */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
            <span>Total Business Impact</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 border border-purple-300">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">$38.7M</span>
            <span className="text-xs text-rose-700 font-bold">Risk / Year</span>
          </div>

          <div className="text-xs text-slate-600 font-medium">
            Affects Authentication &amp; Payment streams
          </div>

          <p className="text-xs text-slate-600 font-medium">
            User Passwords, Tokens &amp; VPN traffic
          </p>
        </div>

      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donut Chart Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Key Threat Distribution
              </h2>
              <p className="text-xs text-slate-600 font-medium">Classified by severity</p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold border border-slate-300">
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
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-300/80">
            {stats.riskDistribution.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-2.5 rounded-xl glass-card">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: r.color }} />
                  <span className="text-xs font-bold text-slate-800">{r.name} Risk</span>
                </div>
                <span className="text-xs font-extrabold text-slate-950">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Bar Chart Card */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                The 6-Year Countdown (Mosca Theorem)
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                <span className="text-rose-700 font-bold">Red Bar (Data Lifetime)</span> should NEVER exceed <span className="text-sky-700 font-bold">Blue Bar (Quantum Arrival ~6 yrs)</span>
              </p>
            </div>
            <button
              onClick={() => setActiveView('QUANTUM_RISK')}
              className="text-xs text-sky-700 hover:text-sky-800 flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>Explain Math</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.moscaComparisonData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.2)" horizontal={false} />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} unit=" yrs" />
                <YAxis dataKey="name" type="category" stroke="#1e293b" tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 600 }} width={80} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#cbd5e1', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    color: '#0f172a',
                    fontSize: '12px'
                  }}
                  formatter={(val: any, name: any) => [`${val} Years`, name === 'needed' ? 'Data Lifetime + Migration' : 'Quantum Arrival Window']}
                />
                <Bar dataKey="needed" name="needed" fill="#e11d48" radius={[0, 6, 6, 0]} />
                <Bar dataKey="threat" name="threat" fill="#0284c7" radius={[0, 6, 6, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-2 border-t border-slate-300/80">
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
      <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Top 3 Things to Fix Right Now
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-rose-100 text-rose-800 font-bold border border-rose-300">
                Immediate Action
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              These 3 keys will leak critical passwords and API tokens first if not upgraded.
            </p>
          </div>

          <button
            onClick={() => setActiveView('MIGRATION')}
            className="text-xs text-sky-700 hover:text-sky-800 flex items-center gap-1 font-bold cursor-pointer"
          >
            <span>View All Code Fixes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPriorities.map((asset, idx) => (
            <div 
              key={asset.id} 
              className="p-5 rounded-2xl glass-card space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    PRIORITY #{idx + 1}
                  </span>
                  <RiskBadge level={asset.riskLevel} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-sky-700 mt-0.5 font-mono font-bold">
                    {asset.location}
                  </p>
                </div>

                <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                  {asset.summary}
                </p>

                <div className="p-3 rounded-xl bg-slate-200/80 border border-slate-300 text-xs">
                  <div className="text-slate-600 font-semibold">Recommended Fix:</div>
                  <div className="font-bold text-emerald-800 mt-0.5">
                    {asset.pqcRecommendation.nistStandard}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-300/80 flex items-center gap-2">
                <button
                  onClick={() => navigateToAssetInGraph(asset.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-sky-900 text-xs font-bold transition-all cursor-pointer"
                  title="See what breaks in the Impact Graph"
                >
                  <span>See What Breaks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    triggerCannedPrompt('WHY_RISKY');
                  }}
                  className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-800 transition-all cursor-pointer"
                  title="Ask AI Copilot why this is risky"
                >
                  <Bot className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
