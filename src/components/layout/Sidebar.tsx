import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { ActiveView } from '../../types';
import { 
  LayoutDashboard, 
  Radar, 
  Layers, 
  ShieldAlert, 
  Network, 
  GitFork, 
  FileText,
  Activity
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  subtext: string;
  icon: React.ElementType;
  badge?: string;
  priority?: boolean;
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, stats, isScanning, isSimulatingSpike } = useCrypto();

  const navItems: NavItem[] = [
    {
      id: 'DASHBOARD',
      label: '1. Dashboard',
      subtext: 'Overview & Health',
      icon: LayoutDashboard,
    },
    {
      id: 'SCAN',
      label: '2. Discovery Scan',
      subtext: 'Multi-Source AST Scanner',
      icon: Radar,
      badge: isScanning ? 'Scanning...' : undefined,
    },
    {
      id: 'ASSETS',
      label: '3. Crypto Assets',
      subtext: 'Discovered CBOM Keys',
      icon: Layers,
      badge: `${stats.totalAssets}`,
    },
    {
      id: 'QUANTUM_RISK',
      label: '4. Quantum Risk',
      subtext: 'Why Old Keys Fail',
      icon: ShieldAlert,
      badge: `${stats.quantumVulnerableCount} At Risk`,
    },
    {
      id: 'IMPACT_GRAPH',
      label: '5. Impact Graph ⭐',
      subtext: 'Interactive Cascade Map',
      icon: Network,
      priority: true,
      badge: 'Main Feature',
    },
    {
      id: 'MIGRATION',
      label: '6. Migration Plan',
      subtext: 'NIST PQC Code Fixes',
      icon: GitFork,
    },
    {
      id: 'TRAFFIC_CONTROL',
      label: '7. Traffic Shield',
      subtext: 'Ingress & Rate Limiting',
      icon: Activity,
      badge: isSimulatingSpike ? 'Spike Active' : 'Shield ON',
    },
    {
      id: 'REPORTS',
      label: '8. CBOM & Reports',
      subtext: 'Export Audit Dossier',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 glass-sidebar flex flex-col justify-between shrink-0 select-none border-r border-slate-300">
      
      {/* Navigation List */}
      <div className="p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-950 font-black">
          Navigation Flow
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-sky-300/80 text-black border border-sky-500 shadow-md font-black'
                  : 'text-slate-900 hover:text-black hover:bg-white/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'bg-slate-300 text-black'
                }`}>
                  <Icon className="w-4 h-4 text-inherit stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-tight text-black">{item.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-800 font-bold">{item.subtext}</p>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-black ${
                  item.badge === 'Main Feature'
                    ? 'bg-sky-200 text-sky-950 border-sky-400'
                    : item.badge === 'Shield ON'
                    ? 'bg-emerald-200 text-emerald-950 border-emerald-400'
                    : item.badge.includes('Risk') || item.badge.includes('Scanning') || item.badge.includes('Spike')
                    ? 'bg-rose-200 text-rose-950 border-rose-400'
                    : 'bg-slate-200 text-slate-950 border-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-300">
        <div className="p-3.5 rounded-2xl glass-card space-y-1 bg-white/70 border border-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-black text-black">Traffic Shield Active</span>
          </div>
          <p className="text-[11px] text-slate-800 font-bold leading-tight">
            PQC Hybrid Ingress &amp; Token-Bucket Rate Limiter enabled.
          </p>
        </div>
      </div>

    </aside>
  );
};
