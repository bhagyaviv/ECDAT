import React, { useState, useRef } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
  GitBranch, 
  UploadCloud, 
  FileCheck2, 
  Box, 
  Globe, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  ArrowRight, 
  ShieldAlert, 
  FileCode, 
  FileText,
  Lock,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';
import { RiskBadge } from '../common/Badge';

type ScanSourceType = 'GIT' | 'ZIP' | 'CERT' | 'CONTAINER' | 'ENDPOINT';

interface CustomUploadedFinding {
  name: string;
  sourceFile: string;
  algorithm: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  hndlExposure: string;
  priority: string;
  lines: string;
}

export const NewScanScreen: React.FC = () => {
  const { 
    assets,
    scanStages, 
    scanLogs, 
    isScanning, 
    scanProgress, 
    startScan, 
    setActiveView,
    navigateToAssetInGraph,
    showToast
  } = useCrypto();

  // Scan Target Selection
  const [selectedSource, setSelectedSource] = useState<ScanSourceType>('GIT');
  
  // Input fields for various sources
  const [gitUrl, setGitUrl] = useState('github.com/enterprise/core-platform');
  const [gitBranch, setGitBranch] = useState('main');
  const [containerImage, setContainerImage] = useState('registry.enterprise.com/auth:4.2');
  const [networkEndpoint, setNetworkEndpoint] = useState('auth.enterprise.com:443');
  const [certContent, setCertContent] = useState(`-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIUeN7hQ... (Legacy RSA-2048 TLS Certificate)
-----END CERTIFICATE-----`);
  
  // Real File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [customFindings, setCustomFindings] = useState<CustomUploadedFinding[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Parse uploaded files for cryptographic primitives
  const handleFileAnalysis = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
    showToast(`Added ${fileArray.length} file(s) to scan queue`);

    const newFindings: CustomUploadedFinding[] = [];

    for (const file of fileArray) {
      const text = await file.text().catch(() => '');
      
      // Heuristic cryptographic pattern analysis
      if (text.includes('RSA') || text.includes('generate_private_key') || text.includes('PKCS1')) {
        newFindings.push({
          name: 'RSA Private Key / Signature Handler',
          sourceFile: file.name,
          algorithm: 'RSA-2048 (PKCS#1 v1.5)',
          riskLevel: 'CRITICAL',
          hndlExposure: 'High (Passwords & JWT Tokens)',
          priority: 'P1 - Immediate',
          lines: 'Line 24-58'
        });
      }

      if (text.includes('ECDSA') || text.includes('SECP256R1') || text.includes('ec.generate_private_key')) {
        newFindings.push({
          name: 'ECDSA Elliptic Curve Signer',
          sourceFile: file.name,
          algorithm: 'ECDSA P-256',
          riskLevel: 'HIGH',
          hndlExposure: 'High (API Bearer Tokens)',
          priority: 'P1 - Immediate',
          lines: 'Line 12-40'
        });
      }

      if (text.includes('AES') || text.includes('AESGCM') || text.includes('AES-256')) {
        newFindings.push({
          name: 'AES Data-at-Rest Encryption',
          sourceFile: file.name,
          algorithm: 'AES-256-GCM',
          riskLevel: 'LOW',
          hndlExposure: 'Protected (128-bit Quantum Margin)',
          priority: 'Compliant',
          lines: 'Line 88-112'
        });
      }

      if (text.includes('SHA1') || text.includes('sha1') || text.includes('hashlib.sha1')) {
        newFindings.push({
          name: 'Legacy SHA-1 Hash Digest',
          sourceFile: file.name,
          algorithm: 'SHA-1 (Broken Collision)',
          riskLevel: 'CRITICAL',
          hndlExposure: 'Vulnerable',
          priority: 'P1 - Immediate',
          lines: 'Line 104'
        });
      }

      if (text.includes('BEGIN CERTIFICATE') || text.includes('X509') || file.name.endsWith('.pem') || file.name.endsWith('.crt')) {
        newFindings.push({
          name: 'X.509 TLS Ingress Certificate',
          sourceFile: file.name,
          algorithm: 'RSA-2048 / SHA256withRSA',
          riskLevel: 'HIGH',
          hndlExposure: 'High (Session Interception)',
          priority: 'P2 - Near-term',
          lines: 'X.509 Leaf Cert'
        });
      }
    }

    if (newFindings.length > 0) {
      setCustomFindings(prev => [...newFindings, ...prev]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      handleFileAnalysis(e.dataTransfer.files);
    }
  };

  const handleResetScan = () => {
    setUploadedFiles([]);
    setCustomFindings([]);
    showToast('Scan target reset to default baseline');
  };

  // Metrics (dynamic based on scan state)
  const isFinished = scanProgress === 100;
  const filesCount = isFinished ? 48912 + uploadedFiles.length * 12 : 0;
  const dependenciesCount = isFinished ? 1736 : 0;
  const certsCount = isFinished ? 214 : 0;
  const cryptoAssetsCount = isFinished ? 1284 + customFindings.length : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Header with Breadcrumb and Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-extrabold text-sky-800 tracking-wider uppercase mb-1">
            DISCOVERY
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Cryptographic Discovery
          </h1>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Scan source code, dependencies, container images, certificates and live endpoints to build the cryptographic inventory.
          </p>
        </div>

        <button
          onClick={handleResetScan}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-card text-black font-extrabold text-xs hover:border-slate-400 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>Reset scan</span>
        </button>
      </div>

      {/* 2. Main Two-Column Layout: Scan Target (Left) vs Scanner Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Scan Target Selection (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl space-y-5 shadow-sm">
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-700 border border-sky-300">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-950">
                Scan Target
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">
                Select a discovery source. Multiple sources can be scanned in a single enterprise run.
              </p>
            </div>
          </div>

          {/* 5 Source Mode Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* 1. Git Repository */}
            <div
              onClick={() => setSelectedSource('GIT')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                selectedSource === 'GIT'
                  ? 'bg-sky-500/20 border-sky-600 ring-2 ring-sky-500/40 shadow-sm'
                  : 'glass-card hover:bg-white/80'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                selectedSource === 'GIT' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <GitBranch className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-extrabold text-slate-950 block">Git Repository</span>
                <span className="text-[11px] text-slate-600 truncate block font-mono">
                  github.com/enterprise/core-platform
                </span>
              </div>
            </div>

            {/* 2. Upload ZIP / Source Files */}
            <div
              onClick={() => {
                setSelectedSource('ZIP');
                fileInputRef.current?.click();
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                selectedSource === 'ZIP'
                  ? 'bg-sky-500/20 border-sky-600 ring-2 ring-sky-500/40 shadow-sm'
                  : 'glass-card hover:bg-white/80'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                selectedSource === 'ZIP' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <UploadCloud className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-extrabold text-slate-950 block">Upload ZIP / Code</span>
                <span className="text-[11px] text-slate-600 truncate block">
                  {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) attached` : 'Source archive up to 2 GB'}
                </span>
              </div>
            </div>

            {/* 3. Certificate */}
            <div
              onClick={() => setSelectedSource('CERT')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                selectedSource === 'CERT'
                  ? 'bg-sky-500/20 border-sky-600 ring-2 ring-sky-500/40 shadow-sm'
                  : 'glass-card hover:bg-white/80'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                selectedSource === 'CERT' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-extrabold text-slate-950 block">Certificate</span>
                <span className="text-[11px] text-slate-600 truncate block">
                  PEM / DER / PKCS#12 bundle
                </span>
              </div>
            </div>

            {/* 4. Container Image */}
            <div
              onClick={() => setSelectedSource('CONTAINER')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                selectedSource === 'CONTAINER'
                  ? 'bg-sky-500/20 border-sky-600 ring-2 ring-sky-500/40 shadow-sm'
                  : 'glass-card hover:bg-white/80'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                selectedSource === 'CONTAINER' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <Box className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-extrabold text-slate-950 block">Container Image</span>
                <span className="text-[11px] text-slate-600 truncate block font-mono">
                  registry.enterprise.com/auth:4.2
                </span>
              </div>
            </div>

            {/* 5. Network Endpoint (Spans Full Width on mobile) */}
            <div
              onClick={() => setSelectedSource('ENDPOINT')}
              className={`sm:col-span-2 p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                selectedSource === 'ENDPOINT'
                  ? 'bg-sky-500/20 border-sky-600 ring-2 ring-sky-500/40 shadow-sm'
                  : 'glass-card hover:bg-white/80'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                selectedSource === 'ENDPOINT' ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                <Globe className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-extrabold text-slate-950 block">Network Endpoint</span>
                <span className="text-[11px] text-slate-600 truncate block font-mono">
                  auth.enterprise.com:443 (Live TLS Handshake Probing)
                </span>
              </div>
            </div>

          </div>

          {/* Dynamic Configuration Panel according to Selected Source */}
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-300 space-y-3">
            
            {/* Git Configuration Form */}
            {selectedSource === 'GIT' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Repository URL:</span>
                  <span className="text-[11px] text-sky-800">Branch: {gitBranch}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    placeholder="https://github.com/org/repo.git"
                    className="sm:col-span-2 glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-950 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={gitBranch}
                    onChange={(e) => setGitBranch(e.target.value)}
                    placeholder="main"
                    className="glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-950 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* ZIP / Code Drag-and-Drop Area */}
            {selectedSource === 'ZIP' && (
              <div className="space-y-2">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-sky-600 bg-sky-100/80 scale-[1.01]' 
                      : 'border-slate-400 bg-white/50 hover:bg-white/80'
                  }`}
                >
                  <UploadCloud className="w-8 h-8 text-sky-700 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-extrabold text-slate-950">
                    Click to browse or drag and drop source files / ZIP archive
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Supports Python (.py), Java (.java), TypeScript (.ts/.js), C/C++, YAML, JSON &amp; ZIP
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileAnalysis(e.target.files)}
                    className="hidden"
                  />
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-sky-100/90 text-sky-950 font-bold border border-sky-300">
                    <span className="flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-sky-700" />
                      {uploadedFiles.length} file(s) loaded for AST discovery
                    </span>
                    <span className="text-[11px] text-sky-800">Ready to analyze</span>
                  </div>
                )}
              </div>
            )}

            {/* Certificate Form */}
            {selectedSource === 'CERT' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Paste PEM / X.509 Certificate or Key:</span>
                  <button
                    onClick={() => certInputRef.current?.click()}
                    className="text-[11px] text-sky-800 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <UploadCloud className="w-3 h-3" />
                    <span>Upload .crt / .pem file</span>
                  </button>
                  <input
                    ref={certInputRef}
                    type="file"
                    accept=".pem,.crt,.cer,.der,.key"
                    onChange={(e) => handleFileAnalysis(e.target.files)}
                    className="hidden"
                  />
                </div>
                <textarea
                  rows={3}
                  value={certContent}
                  onChange={(e) => setCertContent(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 text-[11px] font-mono font-bold text-slate-950 focus:outline-none resize-none"
                />
              </div>
            )}

            {/* Container Image Form */}
            {selectedSource === 'CONTAINER' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  OCI / Docker Image Reference:
                </label>
                <input
                  type="text"
                  value={containerImage}
                  onChange={(e) => setContainerImage(e.target.value)}
                  placeholder="docker.io/library/app:latest"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-950 focus:outline-none"
                />
              </div>
            )}

            {/* Network Endpoint Form */}
            {selectedSource === 'ENDPOINT' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Live TLS Host &amp; Port Probe:
                </label>
                <input
                  type="text"
                  value={networkEndpoint}
                  onChange={(e) => setNetworkEndpoint(e.target.value)}
                  placeholder="auth.example.com:443"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-950 focus:outline-none"
                />
              </div>
            )}

          </div>

          {/* Action Trigger & Security Boundary Note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-300">
            <button
              onClick={startScan}
              disabled={isScanning}
              className={`flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl font-extrabold text-xs transition-all shadow-md cursor-pointer ${
                isScanning
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-sky-400 hover:bg-sky-300 text-black shadow-sky-500/25 active:scale-95 border border-sky-300'
              }`}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin stroke-[2.5]" />
                  <span className="text-black font-extrabold">Scanning Target ({scanProgress}%)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-black fill-black stroke-[2.5]" />
                  <span className="text-black font-extrabold">
                    {scanProgress === 100 ? 'Re-run enterprise scan' : 'Launch Discovery Scan'}
                  </span>
                </>
              )}
            </button>

            <span className="text-[11px] text-slate-600 font-medium">
              Read-only analysis. No source code leaves the enterprise boundary.
            </span>
          </div>

        </div>

        {/* Right Column: Scanner Console (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-4 shadow-sm flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-300 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-300">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-950">
                    Scanner Console
                  </h2>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Live pipeline stages for the current discovery run.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLogs(!showLogs)}
                className="text-[11px] font-extrabold text-black glass-card px-2.5 py-1 rounded-xl cursor-pointer hover:bg-white"
              >
                {showLogs ? 'Hide Raw Logs' : 'View Raw Logs'}
              </button>
            </div>

            {/* Live Pipeline Checklist (Matching the reference layout) */}
            <div className="space-y-2 text-xs">
              {[
                { label: 'Initializing scanner', done: scanProgress >= 15 },
                { label: 'Repository / source connected', done: scanProgress >= 30 },
                { label: 'Source files analyzed', done: scanProgress >= 45 },
                { label: 'Dependencies analyzed', done: scanProgress >= 60 },
                { label: 'Cryptographic patterns detected', done: scanProgress >= 75 },
                { label: 'Certificates analyzed', done: scanProgress >= 88 },
                { label: 'Crypto assets normalized', done: scanProgress >= 95 },
                { label: 'Risk analysis completed', done: scanProgress === 100 },
              ].map((stage, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2.5 p-2 rounded-xl transition-all ${
                    stage.done 
                      ? 'text-emerald-950 font-bold bg-emerald-100/60 border border-emerald-200' 
                      : isScanning && scanProgress > idx * 12 
                      ? 'text-sky-950 font-bold bg-sky-100/70 border border-sky-300'
                      : 'text-slate-600 font-medium'
                  }`}
                >
                  {stage.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  ) : isScanning && scanProgress > idx * 12 ? (
                    <Loader2 className="w-4 h-4 text-sky-700 animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-400 shrink-0 inline-block" />
                  )}
                  <span>{stage.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Log Drawer if enabled */}
          {showLogs && (
            <div className="p-3 bg-slate-950 text-slate-100 rounded-2xl h-44 overflow-y-auto font-mono text-[10px] space-y-1 mt-2 select-text">
              {scanLogs.length === 0 ? (
                <div className="text-slate-400 text-center py-6">
                  Ready to log scanner events.
                </div>
              ) : (
                scanLogs.map(l => (
                  <div key={l.id} className="flex gap-2">
                    <span className="text-slate-400">{l.timestamp}</span>
                    <span className="text-sky-300">{l.message}</span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

      {/* 3. Scan Completed Status Banner (When scan finishes) */}
      {isFinished && (
        <div className="glass-panel p-4 rounded-2xl bg-emerald-100/90 border border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-950 block">
                Scan Completed
              </span>
              <span className="text-[11px] text-emerald-800 font-medium">
                Enterprise cryptographic inventory normalized and risk-scored.
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveView('ASSETS')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md cursor-pointer transition-all"
          >
            <span>Open crypto inventory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Four Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
            FILES ANALYZED
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {filesCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Source &amp; configuration files
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
            DEPENDENCIES ANALYZED
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {dependenciesCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            NPM, PyPI, Maven &amp; Cargo pkgs
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
            CERTIFICATES DISCOVERED
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            {certsCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            TLS, Ingress &amp; internal X.509
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-1 shadow-sm">
          <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider block">
            CRYPTO ASSETS DISCOVERED
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700">
            {cryptoAssetsCount.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            4 critical quantum vulnerabilities
          </span>
        </div>

      </div>

      {/* 5. Discovered Assets Table Preview */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-extrabold text-slate-950">
              Discovered Assets
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              Representative findings from this run, ordered by quantum risk.
            </p>
          </div>

          <button
            onClick={() => setActiveView('ASSETS')}
            className="text-xs text-sky-800 hover:text-sky-950 font-extrabold flex items-center gap-1 cursor-pointer"
          >
            <span>View Full CBOM Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-200/90 text-slate-800 border-b border-slate-300">
                <th className="py-3 px-4 font-extrabold">ASSET</th>
                <th className="py-3 px-4 font-extrabold">APPLICATION / LOCATION</th>
                <th className="py-3 px-4 font-extrabold">ALGORITHM</th>
                <th className="py-3 px-4 font-extrabold">QUANTUM RISK</th>
                <th className="py-3 px-4 font-extrabold">HNDL EXPOSURE</th>
                <th className="py-3 px-4 font-extrabold">PRIORITY</th>
                <th className="py-3 px-4 font-extrabold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300/60">
              {/* Custom uploaded findings first if any */}
              {customFindings.map((cf, idx) => (
                <tr key={`cf-${idx}`} className="bg-sky-50/70 hover:bg-sky-100/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-950">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                      <span>{cf.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sky-900 font-bold">
                    {cf.sourceFile} ({cf.lines})
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {cf.algorithm}
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={cf.riskLevel} />
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {cf.hndlExposure}
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-700">
                    {cf.priority}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveView('MIGRATION')}
                      className="px-3 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-black font-extrabold text-[11px] cursor-pointer"
                    >
                      Fix
                    </button>
                  </td>
                </tr>
              ))}

              {/* Standard Baseline Assets */}
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-white/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-950">
                    {asset.name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{asset.dependencies.serviceName}</div>
                    <div className="text-[11px] text-slate-600 font-mono">{asset.location}</div>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {asset.algorithm} ({asset.keySize})
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={asset.riskLevel} />
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {asset.mosca.isViolating ? (
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Violated ($X+Y &gt; Z$)
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold">
                        Protected
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {asset.migrationPriority}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigateToAssetInGraph(asset.id)}
                      className="px-3 py-1 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-black font-extrabold text-[11px] cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Map</span>
                      <ArrowRight className="w-3 h-3 text-black stroke-[2.5]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
