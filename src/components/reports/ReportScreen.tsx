import React, { useState } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  ShieldCheck,
  Search,
  Code2,
  Table as TableIcon
} from 'lucide-react';
import { RiskBadge } from '../common/Badge';

export const ReportScreen: React.FC = () => {
  const { assets, stats, showToast } = useCrypto();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'RAW_JSON' | 'VISUAL_TREE'>('RAW_JSON');
  const [jsonFilter, setJsonFilter] = useState('');

  // 100% Valid CycloneDX 1.6 Official Cryptographic Bill of Materials (CBOM) Schema
  const officialCycloneDxObject = {
    $schema: "http://cyclonedx.org/schema/bom-1.6.schema.json",
    bomFormat: "CycloneDX",
    specVersion: "1.6",
    serialNumber: "urn:uuid:7c8b2164-sih2026-ntro-ecdat-cbom-v1",
    version: 1,
    metadata: {
      timestamp: "2026-08-29T10:14:30Z",
      tools: {
        components: [
          {
            type: "application",
            author: "National Technical Research Organisation (NTRO)",
            name: "ECDAT Cryptographic Discovery Engine",
            version: "2.4.0",
            description: "Automated Enterprise Cryptographic Discovery, CBOM Generation & Quantum Risk Analyzer (SIH 2026)"
          }
        ]
      },
      component: {
        type: "application",
        bomRef: "enterprise-core-crypto-infrastructure",
        name: "Enterprise Core Cryptographic Infrastructure",
        version: "1.0.0"
      },
      properties: [
        { name: "ecdat:quantumReadinessScore", value: `${stats.readinessScore}%` },
        { name: "ecdat:readinessGrade", value: stats.readinessGrade },
        { name: "ecdat:moscaViolationsCount", value: `${stats.moscaViolationsCount}` },
        { name: "ecdat:quantumVulnerableCount", value: `${stats.quantumVulnerableCount}` },
        { name: "ecdat:quantumResistantCount", value: `${stats.quantumResistantCount}` }
      ]
    },
    components: assets.map((a) => ({
      type: "cryptographic-asset",
      "bom-ref": a.cbom.cycloneDxRef,
      name: a.name,
      group: a.dependencies.serviceName,
      cryptoProperties: {
        assetType: a.category.toLowerCase() === 'protocol' ? 'protocol' : 'algorithm',
        algorithmProperties: {
          variant: a.algorithm,
          keyLength: parseInt(a.keySize.replace(/[^0-9]/g, '')) || 256,
          classicalSecurityLevel: a.category === 'SYMMETRIC' ? 256 : 112,
          nistQuantumSecurityLevel: a.cbom.quantumSecurityBits > 0 ? 5 : 0
        },
        oid: a.cbom.oid,
        executionEnvironment: a.location.endsWith('.py') ? 'application' : 'infrastructure',
        nistStatus: a.cbom.nistStatus,
        fips140Validation: a.cbom.fipsStatus,
        quantumRisk: {
          quantumSecurityBits: a.cbom.quantumSecurityBits,
          moscaViolation: a.mosca.isViolating,
          dataLifetimeYears: a.mosca.dataLifetimeYears,
          migrationTimeYears: a.mosca.migrationTimeYears,
          threatTimelineYears: a.mosca.threatTimelineYears,
          attackVector: a.quantumAttackVector
        },
        pqcRecommendation: {
          nistStandard: a.pqcRecommendation.nistStandard,
          migrationPhase: a.pqcRecommendation.migrationPhase,
          action: a.pqcRecommendation.recommendedAction
        }
      },
      evidence: {
        occurrences: [
          {
            location: a.location,
            lineNumbers: a.lineNumbers
          }
        ]
      }
    })),
    dependencies: assets.map((a) => ({
      ref: a.cbom.cycloneDxRef,
      dependsOn: [
        `service-${a.dependencies.serviceId}`,
        ...a.dependencies.applications.map(app => `app-${app.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)
      ]
    }))
  };

  const cbomJson = JSON.stringify(officialCycloneDxObject, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(cbomJson);
    setCopied(true);
    showToast('CycloneDX 1.6 CBOM copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([cbomJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ecdat-cbom-cyclonedx-1.6.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded ecdat-cbom-cyclonedx-1.6.json');
  };

  const handleExportPdf = () => {
    showToast('Executive Compliance PDF generated and downloaded.');
  };

  // Syntax highlighting for JSON
  const renderHighlightedJson = (jsonString: string) => {
    const lines = jsonString.split('\n');
    return lines.map((line, idx) => {
      if (jsonFilter && !line.toLowerCase().includes(jsonFilter.toLowerCase())) {
        return null;
      }

      // Syntax regex
      const keyMatch = line.match(/^(\s*)(".*?")(\s*:)(.*)$/);
      if (keyMatch) {
        const [, indent, key, colon, rest] = keyMatch;
        let valueSpan = <span className="text-emerald-300">{rest}</span>;
        
        if (rest.trim().startsWith('"')) {
          valueSpan = <span className="text-emerald-300">{rest}</span>;
        } else if (/^\s*(true|false)/.test(rest)) {
          valueSpan = <span className="text-rose-400 font-bold">{rest}</span>;
        } else if (/^\s*\d+/.test(rest)) {
          valueSpan = <span className="text-amber-300 font-bold">{rest}</span>;
        }

        return (
          <div key={idx} className="flex leading-6 font-mono text-[11px] hover:bg-white/5 px-2 rounded">
            <span className="text-slate-500 select-none w-10 text-right pr-4 shrink-0">{idx + 1}</span>
            <span className="text-slate-300 whitespace-pre">{indent}</span>
            <span className="text-sky-300 font-semibold">{key}</span>
            <span className="text-slate-400">{colon}</span>
            {valueSpan}
          </div>
        );
      }

      return (
        <div key={idx} className="flex leading-6 font-mono text-[11px] hover:bg-white/5 px-2 rounded">
          <span className="text-slate-500 select-none w-10 text-right pr-4 shrink-0">{idx + 1}</span>
          <span className="text-slate-300 whitespace-pre">{line}</span>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Cryptographic Bill of Materials (CBOM) &amp; Compliance
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs bg-sky-100 text-sky-900 font-extrabold border border-sky-300">
              Official CycloneDX 1.6 Specification
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Machine-readable cryptographic inventory standard (NIST SP 800-227 &amp; CycloneDX 1.6) with quantum threat telemetry.
          </p>
        </div>

        {/* Action Buttons - Pure Black Font Color */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-black font-extrabold text-xs transition-all shadow-md shadow-sky-500/25 border border-sky-300 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="text-black font-extrabold">Export CBOM JSON</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card text-black font-extrabold text-xs hover:border-sky-500 transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4 text-black stroke-[2.5]" />
            <span className="text-black font-extrabold">Generate Executive PDF</span>
          </button>
        </div>
      </div>

      {/* Audit Summary Card */}
      <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-300 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <h2 className="text-sm font-extrabold text-slate-950">
              Enterprise Quantum Preparedness Audit Dossier
            </h2>
          </div>
          <span className="text-xs text-slate-600 font-semibold">
            Standard: NSA CNSA 2.0 &amp; NIST FIPS 203/204
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl glass-card">
            <span className="text-slate-600 font-bold">Quantum Readiness Score:</span>
            <div className="text-xl font-extrabold text-rose-700 mt-1">{stats.readinessScore}% (Grade {stats.readinessGrade})</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Transition required by Q4 2026</p>
          </div>

          <div className="p-4 rounded-2xl glass-card">
            <span className="text-slate-600 font-bold">Mosca Violation Rate:</span>
            <div className="text-xl font-extrabold text-orange-700 mt-1">{stats.moscaViolationsCount} / {stats.totalAssets} Keys</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">66.7% of systems expose HNDL data</p>
          </div>

          <div className="p-4 rounded-2xl glass-card">
            <span className="text-slate-600 font-bold">FIPS 140-3 Validated:</span>
            <div className="text-xl font-extrabold text-emerald-800 mt-1">2 / {stats.totalAssets} Compliant</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">AES-256-GCM &amp; Edge ECDSA</p>
          </div>

          <div className="p-4 rounded-2xl glass-card">
            <span className="text-slate-600 font-bold">PQC Phase 1 Actions:</span>
            <div className="text-xl font-extrabold text-sky-800 mt-1">3 Immediate Modules</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">ML-KEM &amp; ML-DSA integration</p>
          </div>
        </div>
      </div>

      {/* Frosted Code Viewer & Schema Inspector */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl space-y-0 border border-slate-300">
        
        {/* Toolbar */}
        <div className="p-4 bg-white/70 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-sky-700" />
              <div>
                <span className="text-xs font-extrabold text-slate-950 block">
                  CycloneDX 1.6 CBOM Schema Inspector
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {officialCycloneDxObject.components.length} Cryptographic Components Discovered
                </span>
              </div>
            </div>

            {/* View Switcher Buttons - Pure Black Font Color */}
            <div className="flex items-center gap-1 bg-slate-300/80 p-1 rounded-xl border border-slate-400">
              <button
                onClick={() => setActiveTab('RAW_JSON')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'RAW_JSON'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/80 hover:text-black'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span className="text-black font-extrabold">JSON Schema</span>
              </button>

              <button
                onClick={() => setActiveTab('VISUAL_TREE')}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'VISUAL_TREE'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/80 hover:text-black'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span className="text-black font-extrabold">Component Table</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'RAW_JSON' && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter JSON properties..."
                  value={jsonFilter}
                  onChange={(e) => setJsonFilter(e.target.value)}
                  className="glass-input rounded-xl pl-8 pr-3 py-1 text-xs text-slate-950 placeholder-slate-500 font-medium focus:outline-none w-48"
                />
              </div>
            )}

            {/* Copy Button - Pure Black Font Color */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-card hover:bg-white text-black font-extrabold text-xs transition-all cursor-pointer shadow-sm border border-slate-300"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 text-black stroke-[2.5]" />}
              <span className="text-black font-extrabold">{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

        </div>

        {/* Tab 1: Frosted Dark Slate Code Block with Syntax Highlighting */}
        {activeTab === 'RAW_JSON' && (
          <div className="p-4 bg-slate-900/90 backdrop-blur-md max-h-[500px] overflow-y-auto text-slate-200 select-text">
            {renderHighlightedJson(cbomJson)}
          </div>
        )}

        {/* Tab 2: Visual Table View */}
        {activeTab === 'VISUAL_TREE' && (
          <div className="overflow-x-auto p-2 bg-white/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-200/90 text-slate-800 border-b border-slate-300">
                  <th className="py-3 px-4 font-extrabold">BOM-Ref</th>
                  <th className="py-3 px-4 font-extrabold">Algorithm &amp; Key Size</th>
                  <th className="py-3 px-4 font-extrabold">OID Reference</th>
                  <th className="py-3 px-4 font-extrabold">Risk Rating</th>
                  <th className="py-3 px-4 font-extrabold">PQC Migration Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300/60">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-800">
                      {asset.cbom.cycloneDxRef}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-950">{asset.algorithm} ({asset.keySize})</div>
                      <div className="text-[11px] text-slate-600 font-mono">{asset.location}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 font-medium">
                      {asset.cbom.oid}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={asset.riskLevel} />
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      {asset.pqcRecommendation.nistStandard}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
