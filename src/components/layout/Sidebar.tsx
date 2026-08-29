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
  FileText
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
  const { activeView, setActiveView, stats, isScanning } = useCrypto();

  const navItems: NavItem[] = [
    {
      id: 'DASHBOARD',
      label: '1. Dashboard',
      subtext: 'Overview & Health',
      icon: LayoutDashboard,
    },
    {
      id: 'SCAN',
      label: '2. New Scan',
      subtext: '5-Second AST Scanner',
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
      id: 'REPORTS',
      label: '7. CBOM & Reports',
      subtext: 'Export Audit Dossier',
      icon: FileText,
    },
  ];

  return (
    <aside className="w-64 glass-sidebar flex flex-col justify-between shrink-0 select-none">
      
      {/* Navigation List */}
      <div className="p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-600 font-bold">
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
                  ? 'bg-sky-500/20 text-sky-950 border border-sky-400 shadow-sm backdrop-blur-md font-bold'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-white/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-sky-600 text-white shadow-sm' 
                    : 'bg-slate-300/80 text-slate-700'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm tracking-tight">{item.label}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{item.subtext}</p>
                </div>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  item.badge === 'Main Feature'
                    ? 'bg-sky-100 text-sky-800 border-sky-300 font-bold'
                    : item.badge.includes('Risk') || item.badge.includes('Scanning')
                    ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                    : 'bg-slate-200 text-slate-700 border-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-400/40">
        <div className="p-3.5 rounded-2xl glass-card space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-900">System Ready</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-tight">
            6 enterprise cryptosystems loaded in memory.
          </p>
        </div>
      </div>

    </aside>
  );
};
