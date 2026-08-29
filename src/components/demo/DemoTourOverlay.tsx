import React, { useEffect, useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
  ChevronRight, 
  X, 
  Bot, 
  Network, 
  Radar, 
  Layers, 
  GitFork,
  ShieldAlert 
} from 'lucide-react';

export const DemoTourOverlay: React.FC = () => {
  const { 
    isDemoTourActive, 
    demoTourStep, 
    nextDemoTourStep, 
    stopDemoTour 
  } = useCrypto();

  const [autoPlay, setAutoPlay] = useState(false);

  const steps = [
    {
      step: 1,
      title: 'Step 1: Automated 5s Code Scan',
      desc: 'ECDAT automatically scans your codebases and extracts all encryption keys into a clean inventory.',
      icon: Radar,
    },
    {
      step: 2,
      title: 'Step 2: Cryptographic Inventory (CBOM)',
      desc: 'Here are all 6 discovered keys (RSA, ECDSA, AES-256, TLS 1.2, SHA-1, DH). Note which ones are red.',
      icon: Layers,
    },
    {
      step: 3,
      title: 'Step 3: The 6-Year Quantum Threat',
      desc: 'See how old keys fail against Quantum computers, exposing passwords and credentials.',
      icon: ShieldAlert,
    },
    {
      step: 4,
      title: 'Step 4: Interactive Impact Map ⭐',
      desc: 'Click on RSA-2048 to see the cascade: Auth Service ➔ Customer Portal ➔ Stolen Passwords & Tokens ($14.2M).',
      icon: Network,
    },
    {
      step: 5,
      title: 'Step 5: Copy-Paste Code Fixes',
      desc: 'Actionable NIST Post-Quantum code playbooks to upgrade old keys to quantum-safe ML-DSA & ML-KEM.',
      icon: GitFork,
    },
    {
      step: 6,
      title: 'Step 6: Smart AI Copilot',
      desc: 'Instant answers to "Why is this risky?" and "What should I migrate first?" using real numbers.',
      icon: Bot,
    },
  ];

  const currentStepInfo = steps.find(s => s.step === demoTourStep) || steps[0];
  const Icon = currentStepInfo.icon;

  useEffect(() => {
    if (!isDemoTourActive || !autoPlay) return;

    const timer = setTimeout(() => {
      if (demoTourStep < 6) {
        nextDemoTourStep();
      } else {
        stopDemoTour();
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [isDemoTourActive, demoTourStep, autoPlay, nextDemoTourStep, stopDemoTour]);

  if (!isDemoTourActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl animate-in slide-in-from-bottom duration-200">
      <div className="glass-panel p-4 rounded-3xl border border-sky-500 shadow-2xl backdrop-blur-2xl bg-white/95">
        <div className="flex items-center justify-between gap-4">
          
          {/* Step Narrative */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 border border-sky-300 flex items-center justify-center shrink-0 shadow-sm">
              <Icon className="w-5 h-5" />
            </div>

            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-900">
                  DEMO STEP {demoTourStep} OF 6
                </span>
                <span className="text-xs font-extrabold text-slate-950 truncate">
                  {currentStepInfo.title}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5 truncate max-w-md">
                {currentStepInfo.desc}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                autoPlay 
                  ? 'bg-sky-600 text-white border-sky-600' 
                  : 'glass-card text-slate-800'
              }`}
              title="Automatically advance through demo steps"
            >
              {autoPlay ? 'Auto ON' : 'Auto'}
            </button>

            <button
              onClick={nextDemoTourStep}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/25 active:scale-95 cursor-pointer transition-all"
            >
              <span>{demoTourStep === 6 ? 'Finish' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={stopDemoTour}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 glass-pill hover:bg-slate-200 transition-colors cursor-pointer"
              title="Exit Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
