import React, { useState, useEffect } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Sliders, 
  RotateCcw, 
  Lock, 
  Layers, 
  Globe, 
  Cpu, 
  Terminal, 
  AlertTriangle,
  Play,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export const TrafficControlView: React.FC = () => {
  const {
    pqcEnforced,
    setPqcEnforced,
    blockLegacyCiphers,
    setBlockLegacyCiphers,
    rateLimitingEnabled,
    setRateLimitingEnabled,
    rateLimitThreshold,
    setRateLimitThreshold,
    pqcTrafficRatio,
    setPqcTrafficRatio,
    isSimulatingSpike,
    simulateTrafficSpike,
    simulateLegacyAttack,
    resetTrafficBaselines,
    handshakeLogs,
    currentThroughput,
    blockedRate,
    showToast
  } = useCrypto();

  // Simulated live chart data
  const [trafficData, setTrafficData] = useState([
    { time: '10:41:50', pqc: 7200, legacy: 950, blocked: 80 },
    { time: '10:41:55', pqc: 7450, legacy: 920, blocked: 95 },
    { time: '10:42:00', pqc: 7800, legacy: 880, blocked: 110 },
    { time: '10:42:05', pqc: 8100, legacy: 820, blocked: 130 },
    { time: '10:42:10', pqc: 8350, legacy: 790, blocked: 140 },
    { time: '10:42:15', pqc: currentThroughput, legacy: Math.round(currentThroughput * ((100 - pqcTrafficRatio) / 100)), blocked: blockedRate }
  ]);

  // Push new data point periodically or during spikes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const variance = (Math.random() - 0.5) * 400;
      const effectivePqc = Math.max(1000, Math.round((currentThroughput + variance) * (pqcTrafficRatio / 100)));
      const effectiveLegacy = blockLegacyCiphers ? 0 : Math.max(100, Math.round((currentThroughput + variance) * ((100 - pqcTrafficRatio) / 100)));
      const effectiveBlocked = isSimulatingSpike ? blockedRate + Math.round(Math.random() * 200) : (blockLegacyCiphers ? blockedRate : 20);

      setTrafficData(prev => [
        ...prev.slice(1),
        { time: now, pqc: effectivePqc, legacy: effectiveLegacy, blocked: effectiveBlocked }
      ]);
    }, 2500);

    return () => clearInterval(interval);
  }, [currentThroughput, pqcTrafficRatio, blockLegacyCiphers, isSimulatingSpike, blockedRate]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header with Breadcrumb and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-black text-sky-950 tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-sky-900 stroke-[2.5]" />
            <span>INGRESS &amp; GATEWAY TRAFFIC CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Cryptographic Ingress &amp; Traffic Controller
          </h1>
          <p className="text-xs text-slate-900 font-bold mt-1">
            Enforce Post-Quantum TLS 1.3 / Kyber-768 policies, throttle volumetric DDoS spikes, and drop legacy cipher handshakes in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={resetTrafficBaselines}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-card text-black font-black text-xs hover:border-slate-400 transition-all cursor-pointer shadow-sm border border-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            <span>Reset Policies</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Live Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm border border-slate-300 bg-white/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-black uppercase tracking-wider">
              INGRESS THROUGHPUT
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            {currentThroughput.toLocaleString()} <span className="text-xs text-slate-800 font-bold">req/s</span>
          </div>
          <span className="text-[10px] text-slate-900 font-bold block">
            Peak Capacity: {rateLimitThreshold.toLocaleString()} req/s
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm border border-slate-300 bg-white/80">
          <span className="text-[11px] font-black text-black uppercase tracking-wider block">
            PQC HYBRID SHIELDED
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950">
            {pqcTrafficRatio}%
          </div>
          <span className="text-[10px] text-emerald-950 font-bold block">
            NIST FIPS 203 (ML-KEM-768)
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm border border-slate-300 bg-white/80">
          <span className="text-[11px] font-black text-black uppercase tracking-wider block">
            THREATS &amp; SPIKES BLOCKED
          </span>
          <div className="text-2xl sm:text-3xl font-black text-rose-950">
            {blockedRate} <span className="text-xs text-slate-800 font-bold">req/s</span>
          </div>
          <span className="text-[10px] text-rose-950 font-bold block">
            {blockLegacyCiphers ? 'Legacy ciphers & DDoS throttled' : 'Monitoring only'}
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm border border-slate-300 bg-white/80">
          <span className="text-[11px] font-black text-black uppercase tracking-wider block">
            AVG HANDSHAKE LATENCY
          </span>
          <div className="text-2xl sm:text-3xl font-black text-sky-950">
            1.4 <span className="text-xs text-slate-800 font-bold">ms</span>
          </div>
          <span className="text-[10px] text-slate-900 font-bold block">
            Lattice Hardware Accelerated
          </span>
        </div>

      </div>

      {/* 3. Live Traffic Flow Graph + Interactive Policy Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-time Ingress Traffic Stream Graph (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
            <div>
              <h2 className="text-sm font-black text-black flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-900 stroke-[2.5]" />
                <span>Live Cryptographic Traffic Ingress (Req/sec)</span>
              </h2>
              <p className="text-xs text-slate-800 font-bold">
                Quantum-Safe vs Legacy vs Ingress Throttled / Dropped Packets
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-black">
              <span className="flex items-center gap-1.5 text-emerald-950">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                PQC Safe
              </span>
              <span className="flex items-center gap-1.5 text-amber-950">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                Legacy
              </span>
              <span className="flex items-center gap-1.5 text-rose-950">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                Blocked
              </span>
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="pqcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="legacyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 100, 100, 0.25)" />
                <XAxis dataKey="time" stroke="#000000" tick={{ fontSize: 11, fill: '#000000', fontWeight: 800 }} />
                <YAxis stroke="#000000" tick={{ fontSize: 11, fill: '#000000', fontWeight: 800 }} />
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
                />
                <Area type="monotone" dataKey="pqc" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#pqcGradient)" name="PQC Safe Traffic" />
                <Area type="monotone" dataKey="legacy" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#legacyGradient)" name="Legacy Traffic" />
                <Area type="monotone" dataKey="blocked" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#blockedGradient)" name="Blocked / Throttled" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Simulator Trigger Deck */}
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-300 space-y-2.5">
            <span className="text-xs font-black text-black flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-700 stroke-[2.5]" />
              <span>Interactive Ingress Traffic Simulation (Judge Demonstration):</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={simulateTrafficSpike}
                disabled={isSimulatingSpike}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-200 hover:bg-amber-300 border border-amber-400 text-black font-black text-xs transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-950 stroke-[2.5]" />
                <span>Simulate 18,000+ Req/s DDoS Spike</span>
              </button>

              <button
                onClick={simulateLegacyAttack}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-200 hover:bg-rose-300 border border-rose-400 text-black font-black text-xs transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 text-rose-950 stroke-[2.5]" />
                <span>Test Insecure Cipher Handshake Attack</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ingress Gateway Policy Controller (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-slate-300 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-300 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-sky-900 stroke-[2.5]" />
                <h2 className="text-sm font-black text-black">
                  Ingress Gateway Policies
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-200 text-emerald-950 font-black border border-emerald-400">
                ACTIVE SHIELD
              </span>
            </div>

            {/* Policy 1: Post-Quantum TLS Hybrid Enforcement */}
            <div className="p-3.5 rounded-2xl glass-card space-y-2 border border-slate-300 bg-white/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
                  <span>Enforce PQC Hybrid TLS 1.3</span>
                </span>
                <input
                  type="checkbox"
                  checked={pqcEnforced}
                  onChange={(e) => {
                    setPqcEnforced(e.target.checked);
                    showToast(e.target.checked ? 'Post-Quantum ML-KEM-768 Enforced on Ingress' : 'PQC Hybrid Ingress Disabled');
                  }}
                  className="w-4 h-4 accent-sky-600 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-800 font-bold leading-relaxed">
                Automatically upgrades incoming client handshakes to <strong>FIPS 203 (ML-KEM-768) + X25519</strong> hybrid key exchange.
              </p>
            </div>

            {/* Policy 2: Drop Deprecated Ciphers */}
            <div className="p-3.5 rounded-2xl glass-card space-y-2 border border-slate-300 bg-white/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-800 stroke-[2.5]" />
                  <span>Block Insecure &amp; Legacy Ciphers</span>
                </span>
                <input
                  type="checkbox"
                  checked={blockLegacyCiphers}
                  onChange={(e) => {
                    setBlockLegacyCiphers(e.target.checked);
                    showToast(e.target.checked ? 'Dropping all TLS 1.0/1.1/1.2 & RSA key handshakes' : 'Legacy cipher block disabled');
                  }}
                  className="w-4 h-4 accent-rose-600 cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-800 font-bold leading-relaxed">
                Instantly terminates connections requesting TLS 1.0/1.1/1.2, 3DES, RC4, or unencrypted RSA key exchanges.
              </p>
            </div>

            {/* Policy 3: Token-Bucket Rate Limiter */}
            <div className="p-3.5 rounded-2xl glass-card space-y-2 border border-slate-300 bg-white/80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-black flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-sky-900 stroke-[2.5]" />
                  <span>Token-Bucket Rate Limiter</span>
                </span>
                <input
                  type="checkbox"
                  checked={rateLimitingEnabled}
                  onChange={(e) => {
                    setRateLimitingEnabled(e.target.checked);
                    showToast(e.target.checked ? 'Ingress Rate Limiting Active' : 'Rate Limiting Disabled');
                  }}
                  className="w-4 h-4 accent-sky-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-black text-black">
                  <span>Capacity Threshold:</span>
                  <span className="text-sky-950 font-black">{rateLimitThreshold.toLocaleString()} req/s</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={500}
                  value={rateLimitThreshold}
                  onChange={(e) => setRateLimitThreshold(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Policy 4: Crypto-Agility Traffic Routing Split */}
            <div className="p-3.5 rounded-2xl glass-card space-y-2 border border-slate-300 bg-white/80">
              <div className="flex justify-between text-xs font-black text-black">
                <span>Crypto-Agility Canary Split:</span>
                <span className="text-emerald-950 font-black">{pqcTrafficRatio}% PQC / {100 - pqcTrafficRatio}% Legacy</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={pqcTrafficRatio}
                onChange={(e) => setPqcTrafficRatio(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-800 font-bold">
                Gradually migrate live users to Post-Quantum microservices with zero downtime.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* 4. Live Ingress Handshake Telemetry Log Stream */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm border border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
          <div>
            <h2 className="text-sm font-black text-black flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-900 stroke-[2.5]" />
              <span>Live Ingress Cipher Handshake Telemetry</span>
            </h2>
            <p className="text-xs text-slate-800 font-bold">
              Real-time TLS handshakes inspected by the ECDAT Cryptographic Traffic Shield.
            </p>
          </div>

          <span className="text-xs text-black font-black bg-slate-200 px-3 py-1 rounded-full border border-slate-400">
            Live Gateway Stream
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-300 text-black border-b border-slate-400">
                <th className="py-3 px-4 font-black">TIMESTAMP</th>
                <th className="py-3 px-4 font-black">CLIENT IP</th>
                <th className="py-3 px-4 font-black">TARGET SERVICE</th>
                <th className="py-3 px-4 font-black">NEGOTIATED CIPHERSUITE</th>
                <th className="py-3 px-4 font-black">PROTOCOL</th>
                <th className="py-3 px-4 font-black">ENFORCEMENT ACTION</th>
                <th className="py-3 px-4 font-black text-right">LATENCY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {handshakeLogs.map((log) => {
                let actionBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-950 border border-emerald-400">
                    ALLOWED (PQC)
                  </span>
                );

                if (log.action === 'BLOCKED') {
                  actionBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-200 text-rose-950 border border-rose-400">
                      BLOCKED (CIPHER DROP)
                    </span>
                  );
                } else if (log.action === 'THROTTLED') {
                  actionBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-950 border border-amber-400">
                      THROTTLED (RATE LIMIT)
                    </span>
                  );
                } else if (log.action === 'UPGRADED') {
                  actionBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-200 text-sky-950 border border-sky-400">
                      UPGRADED TO TLS 1.3
                    </span>
                  );
                }

                return (
                  <tr key={log.id} className="hover:bg-white/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-slate-900">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-sky-950">
                      {log.clientIp}
                    </td>
                    <td className="py-3 px-4 font-black text-black">
                      {log.targetService}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-900">
                      {log.cipherSuite}
                    </td>
                    <td className="py-3 px-4 font-black text-black">
                      {log.protocol}
                    </td>
                    <td className="py-3 px-4">
                      {actionBadge}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-slate-900">
                      {log.latencyMs} ms
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
