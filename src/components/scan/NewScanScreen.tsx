import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
  Radar, 
  Play, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  Terminal, 
  FolderGit2, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

export const NewScanScreen: React.FC = () => {
  const { 
    scanStages, 
    scanLogs, 
    isScanning, 
    scanProgress, 
    startScan, 
    setActiveView 
  } = useCrypto();

  const [selectedRepo, setSelectedRepo] = useState('enterprise-core-monorepo');
  const [showLogs, setShowLogs] = useState(true);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Automated Code Scanner
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs bg-sky-100 text-sky-900 font-extrabold border border-sky-300">
              5-Second Scan
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Scans all your repositories, detects classical encryption algorithms, and creates your Cryptography Bill of Materials (CBOM).
          </p>
        </div>

        {/* Scan Trigger Button */}
        <button
          onClick={startScan}
          disabled={isScanning}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer ${
            isScanning
              ? 'glass-card text-slate-500 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/25 active:scale-95'
          }`}
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Scanning Codebase ({scanProgress}%)...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white text-sky-600" />
              <span>Launch Discovery Scan (5s)</span>
            </>
          )}
        </button>
      </div>

      {/* Target Repo Bar */}
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 text-xs shadow-sm">
        <div className="flex items-center gap-2.5 text-slate-800 font-bold">
          <FolderGit2 className="w-4 h-4 text-sky-700" />
          <span>Selected Target:</span>
          <select 
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
            disabled={isScanning}
            className="glass-card rounded-xl px-3 py-1.5 text-slate-950 font-extrabold outline-none cursor-pointer"
          >
            <option value="enterprise-core-monorepo">Enterprise Core Monorepo (All 6 Services)</option>
            <option value="auth-service">services/auth (RSA-2048, JWT Tokens)</option>
            <option value="payment-vault">services/payments (AES-256-GCM)</option>
            <option value="edge-gateway">infra/gateway (TLS 1.2, ECDSA-P256)</option>
          </select>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-700 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>NIST Post-Quantum Standards Active</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-panel p-6 rounded-3xl space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-900">
            Scanning Progress
          </span>
          <span className="font-extrabold text-sky-700 text-sm">
            {scanProgress}%
          </span>
        </div>

        <div className="w-full bg-slate-300/80 rounded-full h-3 overflow-hidden border border-slate-400/50 p-0.5">
          <div 
            className="bg-sky-600 h-full rounded-full transition-all duration-300 shadow-sm shadow-sky-600/50"
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      </div>

      {/* 5 Stages Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {scanStages.map((stage) => {
          const isCompleted = stage.status === 'COMPLETED';
          const isInProgress = stage.status === 'IN_PROGRESS';

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isCompleted
                  ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900 shadow-sm'
                  : isInProgress
                  ? 'bg-sky-100/90 border-sky-500 text-sky-950 shadow-md ring-1 ring-sky-500'
                  : 'glass-card text-slate-600'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-slate-300">
                    STEP 0{stage.id}
                  </span>
                  
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  )}
                  {isInProgress && (
                    <Loader2 className="w-4 h-4 text-sky-700 animate-spin" />
                  )}
                  {!isCompleted && !isInProgress && (
                    <Clock className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-950 leading-snug">
                  {stage.title}
                </h3>

                <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-300/80 text-[10px] text-slate-600 font-bold">
                {stage.metrics}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Log Console */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm space-y-0">
        <div className="px-5 py-3 bg-slate-200/90 border-b border-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-sky-700" />
            <span className="text-xs font-bold text-slate-900">
              Live Scanner Output
            </span>
          </div>

          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-xs text-slate-700 hover:text-slate-950 glass-pill px-3 py-1 rounded-full cursor-pointer transition-colors font-semibold"
          >
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </button>
        </div>

        {showLogs && (
          <div className="p-4 bg-slate-950 text-slate-100 h-52 overflow-y-auto text-xs space-y-1.5 select-text font-mono">
            {scanLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-1">
                <Radar className="w-6 h-6 text-slate-500 animate-pulse" />
                <p>Scanner standby. Click &ldquo;Launch Discovery Scan&rdquo; to begin.</p>
              </div>
            ) : (
              scanLogs.map((log) => {
                let levelColor = 'text-sky-300';
                if (log.level === 'CRITICAL') levelColor = 'text-rose-400 font-bold';
                else if (log.level === 'WARN') levelColor = 'text-amber-300';
                else if (log.level === 'SUCCESS') levelColor = 'text-emerald-300';

                return (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-slate-400 text-[11px] shrink-0">{log.timestamp}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded uppercase font-semibold shrink-0 bg-white/10 text-slate-300 border border-white/10`}>
                      {log.level}
                    </span>
                    <span className={levelColor}>
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Scan Completed Banner */}
        {scanProgress === 100 && (
          <div className="p-4 bg-emerald-100/90 border-t border-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-950 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Scan complete! 6 encryption keys detected in codebase.</span>
            </div>

            <button
              onClick={() => setActiveView('ASSETS')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>View All 6 Keys</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
