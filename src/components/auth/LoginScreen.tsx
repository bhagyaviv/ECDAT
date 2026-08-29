import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { ShieldCheck, Lock, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { setIsAuthenticated, setActiveView } = useCrypto();
  const [email, setEmail] = useState('analyst@ntro.gov.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setActiveView('DASHBOARD');
  };

  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    setActiveView('DASHBOARD');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#D3D3D3] relative overflow-hidden px-4">
      {/* Ambient Bokeh Orbs */}
      <div className="aurora-blob-1 -top-32 -left-32" />
      <div className="aurora-blob-2 -bottom-32 -right-32" />
      <div className="aurora-blob-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold mb-4 shadow-sm border border-sky-300">
            <ShieldAlert className="w-3.5 h-3.5 text-sky-700" />
            <span>Smart India Hackathon 2026 • SIH26164 (NTRO)</span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 p-0.5 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-sky-700" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
              ECDAT
            </h1>
          </div>

          <p className="text-sm font-semibold text-slate-700">
            Enterprise Cryptographic Discovery &amp; Analysis Tool
          </p>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Discover • Assess • Prioritize • Migrate
          </p>
        </div>

        {/* Frosted #D3D3D3 Glass Login Box */}
        <div className="glass-panel p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden bg-white/85">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600" />

          <div>
            <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-700" />
              Security Analyst Access
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Access the Cryptography Bill of Materials (CBOM) &amp; PQC Risk Engine.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-800 font-bold mb-1.5">
                Officer Email / Identity Handle
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@domain.gov.in"
                className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-slate-950 font-medium placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-800 font-bold mb-1.5">
                Authentication Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs text-slate-950 font-medium placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-2xl shadow-md shadow-sky-600/25 active:scale-[0.98] transition-all text-xs cursor-pointer"
              >
                <span>Authorize &amp; Enter Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 glass-card hover:bg-white text-slate-900 font-bold py-2.5 px-4 rounded-2xl text-xs transition-all cursor-pointer border border-slate-300"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>1-Click Demo Sign-In (Judge Instant Access)</span>
              </button>
            </div>
          </form>

          {/* Quick Info Box */}
          <div className="pt-4 border-t border-slate-300 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between text-slate-800 font-bold">
              <span>DEMO MODE:</span>
              <span className="text-emerald-800 font-extrabold">PRE-LOADED</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              Equipped with canonical enterprise cryptosystems (RSA-2048, ECDSA-P256, AES-256, TLS 1.2, SHA-1, DH-2048).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-slate-600 font-semibold">
          ECDAT Cryptographic Defense Suite • NTRO Problem SIH26164
        </div>
      </div>
    </div>
  );
};
