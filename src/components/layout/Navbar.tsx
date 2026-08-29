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
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-300">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveView('DASHBOARD')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-sky-200 border border-sky-400 group-hover:border-sky-600 shadow-sm backdrop-blur-md transition-all">
              <ShieldCheck className="w-6 h-6 text-sky-950 group-hover:scale-105 transition-transform stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-black group-hover:text-sky-900 transition-colors">
                  ECDAT
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-sky-200 text-sky-950 border border-sky-400">
                  SIH 2026 • NTRO
                </span>
              </div>
              <p className="text-xs text-slate-800 font-bold hidden sm:block">
                Discover • Assess • Prioritize • Migrate
              </p>
            </div>
          </div>

          {/* Demo Data indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-black text-xs font-black border border-slate-300">
            <Database className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
            <span>Demo Data</span>
          </div>
        </div>

        {/* Center Glass Status Capsule */}
        <div className="hidden lg:flex items-center gap-4 glass-panel rounded-2xl px-4 py-1.5 shadow-sm border border-slate-300">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-900 stroke-[2.5]" />
            <span className="text-xs text-black font-black">Quantum Health:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-rose-950">{stats.readinessScore}% Safe</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-400">
                Grade {stats.readinessGrade} (Vulnerable)
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-400" />

          <div className="flex items-center gap-1.5 text-xs text-black font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-700 stroke-[2.5]" />
            <span>At Risk: <strong className="text-rose-950 font-black">{stats.quantumVulnerableCount} of {stats.totalAssets} Keys</strong></span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* 1-Click Start Demo Button */}
          <button
            onClick={startDemoTour}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-black font-black text-xs shadow-md shadow-sky-500/25 border border-sky-400 active:scale-95 transition-all cursor-pointer"
            title="Start automated 1-click guided walkthrough"
          >
            <PlayCircle className="w-4 h-4 fill-black text-black stroke-[2]" />
            <span className="text-black font-black">{isDemoTourActive ? 'Demo Active...' : 'Start Demo'}</span>
          </button>

          {/* AI Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(!isCopilotOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black backdrop-blur-md transition-all cursor-pointer ${
              isCopilotOpen 
                ? 'bg-purple-300 text-purple-950 border border-purple-500 shadow-md' 
                : 'glass-panel text-black hover:bg-purple-100 border border-slate-300'
            }`}
          >
            <Bot className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="hidden sm:inline text-black font-black">AI Copilot</span>
          </button>

          {/* User Sign Out */}
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1.5 p-2 rounded-xl text-black hover:text-black glass-pill hover:bg-white text-xs transition-colors cursor-pointer border border-slate-300"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          </button>
        </div>

      </div>
    </header>
  );
};
