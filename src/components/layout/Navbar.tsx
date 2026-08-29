import React from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
  ShieldCheck, 
  Bot, 
  PlayCircle, 
  Database, 
  Cpu, 
  LogOut,
  AlertTriangle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    stats, 
    startDemoTour, 
    isDemoTourActive, 
    isCopilotOpen, 
    setIsCopilotOpen,
    setIsAuthenticated,
    setActiveView
  } = useCrypto();

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveView('DASHBOARD')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 group-hover:border-sky-500 shadow-sm backdrop-blur-md transition-all">
              <ShieldCheck className="w-5 h-5 text-sky-700 group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  ECDAT
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  SIH 2026 • NTRO
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium hidden sm:block">
                Discover • Assess • Prioritize • Migrate
              </p>
            </div>
          </div>

          {/* Demo Data indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-slate-700 text-xs font-semibold">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Demo Data</span>
          </div>
        </div>

        {/* Center #D3D3D3 Glass Status Capsule */}
        <div className="hidden lg:flex items-center gap-4 glass-panel rounded-2xl px-4 py-1.5 shadow-sm">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-700" />
            <span className="text-xs text-slate-700 font-semibold">Quantum Health:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-rose-700">{stats.readinessScore}% Safe</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                Grade {stats.readinessGrade} (Vulnerable)
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-400/60" />

          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            <span>At Risk: <strong className="text-orange-700 font-bold">{stats.quantumVulnerableCount} of {stats.totalAssets} Keys</strong></span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* 1-Click Start Demo Button */}
          <button
            onClick={startDemoTour}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/25 active:scale-95 transition-all cursor-pointer"
            title="Start automated 1-click guided walkthrough"
          >
            <PlayCircle className="w-4 h-4 fill-white text-sky-600" />
            <span>{isDemoTourActive ? 'Demo Active...' : 'Start Demo'}</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold backdrop-blur-md transition-all cursor-pointer ${
              isCopilotOpen 
                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20' 
                : 'glass-panel text-purple-800 hover:bg-purple-100 border-purple-300'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-700" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* User Sign Out */}
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 p-2 rounded-xl text-slate-600 hover:text-slate-900 glass-pill hover:bg-white text-xs transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
