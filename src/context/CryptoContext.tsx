import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  CryptoAsset, 
  ActiveView, 
  ScanStage, 
  ScanLog, 
  CopilotMessage 
} from '../types';
import { 
  DEMO_CRYPTO_ASSETS, 
  SCAN_STAGES_INITIAL, 
  DEMO_SCAN_LOGS, 
  DEMO_STATS 
} from '../data/demoData';

interface CryptoContextType {
  assets: CryptoAsset[];
  selectedAssetId: string;
  selectedAsset: CryptoAsset;
  setSelectedAssetId: (id: string) => void;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  sendMessageToCopilot: (text: string) => void;
  triggerCannedPrompt: (promptKey: 'WHY_RISKY' | 'WHAT_MIGRATE' | 'EXPLAIN_CBOM') => void;
  scanStages: ScanStage[];
  scanLogs: ScanLog[];
  isScanning: boolean;
  scanProgress: number;
  startScan: () => void;
  isDemoTourActive: boolean;
  demoTourStep: number;
  startDemoTour: () => void;
  stopDemoTour: () => void;
  nextDemoTourStep: () => void;
  stats: typeof DEMO_STATS;
  filterRisk: string;
  setFilterRisk: (risk: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateToAssetInGraph: (assetId: string) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets] = useState<CryptoAsset[]>(DEMO_CRYPTO_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('asset-rsa-2048');
  const [activeView, setActiveView] = useState<ActiveView>('DASHBOARD');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Default logged in for immediate hackathon judging preview
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scan state
  const [scanStages, setScanStages] = useState<ScanStage[]>(SCAN_STAGES_INITIAL);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Demo Tour State
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(0);

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Initial Copilot Welcome
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome-1',
      sender: 'COPILOT',
      timestamp: 'Just now',
      text: `Greetings, Analyst. I am the ECDAT Cryptographic Security Intelligence Assistant. I have loaded the live CBOM inventory. Currently inspecting **${selectedAsset.name}** (${selectedAsset.algorithm}, ${selectedAsset.location}). How can I assist with your Post-Quantum transition?`,
      suggestedPrompts: [
        'Why is this risky?',
        'What should I migrate first?',
        'Explain this CBOM.'
      ]
    }
  ]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const navigateToAssetInGraph = (assetId: string) => {
    setSelectedAssetId(assetId);
    setActiveView('IMPACT_GRAPH');
  };

  const startScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([]);
    
    // Reset stages
    setScanStages(prev => prev.map(s => ({ ...s, status: 'PENDING' })));

    let currentStageIndex = 0;
    const totalDuration = 4800; // ~4.8 seconds total
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setScanProgress(progress);

      // Determine active stage
      const stageIdx = Math.min(4, Math.floor((elapsed / totalDuration) * 5));
      if (stageIdx !== currentStageIndex) {
        currentStageIndex = stageIdx;
      }

      setScanStages(prev => prev.map((stage, idx) => {
        if (idx < stageIdx) return { ...stage, status: 'COMPLETED' };
        if (idx === stageIdx) return { ...stage, status: 'IN_PROGRESS' };
        return { ...stage, status: 'PENDING' };
      }));

      // Add appropriate logs
      const logToPush = DEMO_SCAN_LOGS.find(l => !l.id.includes('pushed') && (elapsed / totalDuration) * DEMO_SCAN_LOGS.length >= DEMO_SCAN_LOGS.indexOf(l));
      if (logToPush) {
        setScanLogs(prev => {
          if (prev.some(p => p.id === logToPush.id)) return prev;
          return [...prev, logToPush];
        });
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setScanStages(prev => prev.map(s => ({ ...s, status: 'COMPLETED' })));
        setScanLogs(DEMO_SCAN_LOGS);
        setScanProgress(100);
        setIsScanning(false);
        showToast('Scan Completed: Discovered 6 cryptographic primitives (4 vulnerable)');
        setTimeout(() => {
          setActiveView('ASSETS');
        }, 800);
      }
    }, intervalTime);
  };

  // AI Copilot template interpolations
  const generateCopilotResponse = (promptKey: 'WHY_RISKY' | 'WHAT_MIGRATE' | 'EXPLAIN_CBOM', asset: CryptoAsset): string => {
    switch (promptKey) {
      case 'WHY_RISKY':
        if (asset.riskLevel === 'LOW' && !asset.mosca.isViolating) {
          return `### Analysis for ${asset.name} (${asset.algorithm}):
- **Quantum Vulnerability Status**: **QUANTUM RESISTANT (LOW RISK)**
- **Algorithm Strength**: ${asset.keySize} symmetric encryption.
- **Quantum Attack Analysis**: Under Grover's search algorithm, the effective key strength drops from 256 bits to **128 quantum bits**. 128-bit quantum security is mathematically unfeasible to break even with fault-tolerant quantum computers.
- **Mosca Assessment**: Data lifetime ($X=${asset.mosca.dataLifetimeYears}y$) + Migration time ($Y=${asset.mosca.migrationTimeYears}y$) = **${asset.mosca.dataLifetimeYears + asset.mosca.migrationTimeYears}y**, well within the estimated threat horizon ($Z=${asset.mosca.threatTimelineYears}y$).
- **Recommendation**: Retain current configuration; no immediate migration required.`;
        }

        return `### Critical Quantum Risk Breakdown: ${asset.name}
- **Location**: \`${asset.location}\` (${asset.repository})
- **Vulnerability Mechanism**: ${asset.quantumAttackVector}
- **Harvest Now, Decrypt Later (HNDL)**: Adversaries can intercept and archive encrypted traffic or signatures today. Once a Cryptographically Relevant Quantum Computer (CRQC) exists, ${asset.algorithm} keys will be factored in polynomial time.
- **Mosca's Theorem Violation**: 
  - Data Shelf-life ($X$): **${asset.mosca.dataLifetimeYears} years**
  - Migration Duration ($Y$): **${asset.mosca.migrationTimeYears} years**
  - Estimated CRQC Horizon ($Z$): **${asset.mosca.threatTimelineYears} years**
  - **Condition ($X+Y > Z$)**: $${asset.mosca.dataLifetimeYears} + ${asset.mosca.migrationTimeYears} = ${asset.mosca.dataLifetimeYears + asset.mosca.migrationTimeYears} > ${asset.mosca.threatTimelineYears}$ ⚠️ **VIOLATED**
- **Business Blast Radius**: Threatens **${asset.dependencies.serviceName}**, exposing **${asset.dependencies.applications.join(', ')}** with an estimated risk exposure of **${asset.dependencies.annualRiskExposureUSD}**.`;

      case 'WHAT_MIGRATE':
        return `### Migration Action Plan for ${asset.name}:
- **Migration Priority**: **${asset.migrationPriority}** (${asset.pqcRecommendation.migrationPhase})
- **Target NIST PQC Standard**: **${asset.pqcRecommendation.nistStandard}**
- **Algorithm Family**: ${asset.pqcRecommendation.algorithmFamily} (Lattice-based Post-Quantum Cryptography)
- **Actionable Steps**:
  1. ${asset.pqcRecommendation.recommendedAction}
  2. Implement dual/hybrid mechanism to preserve backward compatibility with legacy clients.
  3. Validate against FIPS 203/204 reference implementations (\`liboqs\` / \`pqcrypto\`).
- **Estimated Development Effort**: **~${asset.pqcRecommendation.estimatedEffortWeeks} weeks** for security engineering and validation.`;

      case 'EXPLAIN_CBOM':
        return `### CBOM (Cryptography Bill of Materials) Specification:
- **CycloneDX Ref**: \`${asset.cbom.cycloneDxRef}\`
- **Crypto Type**: \`${asset.cbom.cryptoType}\`
- **Object Identifier (OID)**: \`${asset.cbom.oid || 'N/A'}\`
- **NIST Status**: **${asset.cbom.nistStatus}**
- **FIPS Validation**: ${asset.cbom.fipsStatus}
- **Quantum Security Level**: **${asset.cbom.quantumSecurityBits} bits** (Classical: ${asset.keySize})
- **Downstream Dependency Service**: ${asset.dependencies.serviceName}
- **Affected Data Classification**: \`${asset.dependencies.dataClassification}\`
- **Standard Alignment**: Fully formatted for CycloneDX 1.6 Cryptographic Extension & NIST SP 800-227.`;
    }
  };

  const triggerCannedPrompt = (promptKey: 'WHY_RISKY' | 'WHAT_MIGRATE' | 'EXPLAIN_CBOM') => {
    setIsCopilotOpen(true);
    let promptTitle = '';
    if (promptKey === 'WHY_RISKY') promptTitle = `Why is ${selectedAsset.name} risky?`;
    if (promptKey === 'WHAT_MIGRATE') promptTitle = `What should I migrate first for ${selectedAsset.name}?`;
    if (promptKey === 'EXPLAIN_CBOM') promptTitle = `Explain the CBOM for ${selectedAsset.name}.`;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      timestamp: 'Just now',
      text: promptTitle,
    };

    const responseText = generateCopilotResponse(promptKey, selectedAsset);

    const botMsg: CopilotMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'COPILOT',
      timestamp: 'Just now',
      text: responseText,
      assetContextId: selectedAsset.id,
      metadata: {
        riskLevel: selectedAsset.riskLevel,
        pqcTarget: selectedAsset.pqcRecommendation.nistStandard,
        moscaViolation: selectedAsset.mosca.isViolating,
        businessImpact: selectedAsset.dependencies.annualRiskExposureUSD
      },
      suggestedPrompts: [
        'Why is this risky?',
        'What should I migrate first?',
        'Explain this CBOM.'
      ]
    };

    setCopilotMessages(prev => [...prev, userMsg, botMsg]);
  };

  const sendMessageToCopilot = (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'USER',
      timestamp: 'Just now',
      text: text,
    };

    const lower = text.toLowerCase();
    let promptKey: 'WHY_RISKY' | 'WHAT_MIGRATE' | 'EXPLAIN_CBOM' = 'WHY_RISKY';
    if (lower.includes('migrate') || lower.includes('priority') || lower.includes('fix') || lower.includes('upgrade') || lower.includes('pqc')) {
      promptKey = 'WHAT_MIGRATE';
    } else if (lower.includes('cbom') || lower.includes('spec') || lower.includes('oid') || lower.includes('cyclonedx') || lower.includes('bill of materials')) {
      promptKey = 'EXPLAIN_CBOM';
    } else {
      promptKey = 'WHY_RISKY';
    }

    const responseText = generateCopilotResponse(promptKey, selectedAsset);

    const botMsg: CopilotMessage = {
      id: `bot-${Date.now() + 1}`,
      sender: 'COPILOT',
      timestamp: 'Just now',
      text: responseText,
      assetContextId: selectedAsset.id,
      suggestedPrompts: [
        'Why is this risky?',
        'What should I migrate first?',
        'Explain this CBOM.'
      ]
    };

    setCopilotMessages(prev => [...prev, userMsg, botMsg]);
  };

  // Demo Tour Logic
  const startDemoTour = () => {
    setIsDemoTourActive(true);
    setDemoTourStep(1);
    setActiveView('SCAN');
  };

  const stopDemoTour = () => {
    setIsDemoTourActive(false);
    setDemoTourStep(0);
    setIsCopilotOpen(false);
  };

  const nextDemoTourStep = () => {
    const next = demoTourStep + 1;
    setDemoTourStep(next);

    switch (next) {
      case 1:
        setActiveView('SCAN');
        startScan();
        break;
      case 2:
        setActiveView('ASSETS');
        setSelectedAssetId('asset-rsa-2048');
        break;
      case 3:
        setActiveView('QUANTUM_RISK');
        break;
      case 4:
        setActiveView('IMPACT_GRAPH');
        setSelectedAssetId('asset-rsa-2048');
        break;
      case 5:
        setActiveView('MIGRATION');
        break;
      case 6:
        setIsCopilotOpen(true);
        triggerCannedPrompt('WHY_RISKY');
        break;
      default:
        stopDemoTour();
        showToast('Demo Tour Completed! You can now freely explore ECDAT.');
        break;
    }
  };

  return (
    <CryptoContext.Provider
      value={{
        assets,
        selectedAssetId,
        selectedAsset,
        setSelectedAssetId,
        activeView,
        setActiveView,
        isAuthenticated,
        setIsAuthenticated,
        isCopilotOpen,
        setIsCopilotOpen,
        copilotMessages,
        sendMessageToCopilot,
        triggerCannedPrompt,
        scanStages,
        scanLogs,
        isScanning,
        scanProgress,
        startScan,
        isDemoTourActive,
        demoTourStep,
        startDemoTour,
        stopDemoTour,
        nextDemoTourStep,
        stats: DEMO_STATS,
        filterRisk,
        setFilterRisk,
        searchQuery,
        setSearchQuery,
        navigateToAssetInGraph,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCrypto must be used within a CryptoProvider');
  }
  return context;
};
