import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  CryptoAsset, 
  ActiveView, 
  ScanStage, 
  ScanLog, 
  CopilotMessage,
  IngressHandshakeLog
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
  
  // Traffic Control State & Actions
  pqcEnforced: boolean;
  setPqcEnforced: (val: boolean) => void;
  blockLegacyCiphers: boolean;
  setBlockLegacyCiphers: (val: boolean) => void;
  rateLimitingEnabled: boolean;
  setRateLimitingEnabled: (val: boolean) => void;
  rateLimitThreshold: number;
  setRateLimitThreshold: (val: number) => void;
  pqcTrafficRatio: number;
  setPqcTrafficRatio: (val: number) => void;
  isSimulatingSpike: boolean;
  simulateTrafficSpike: () => void;
  simulateLegacyAttack: () => void;
  resetTrafficBaselines: () => void;
  handshakeLogs: IngressHandshakeLog[];
  currentThroughput: number;
  blockedRate: number;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

const INITIAL_HANDSHAKES: IngressHandshakeLog[] = [
  {
    id: 'hs-1',
    timestamp: '10:42:15.820',
    clientIp: '192.168.1.45',
    targetService: 'services/auth (SSO)',
    cipherSuite: 'TLS_AES_256_GCM_SHA384 + ML-KEM-768',
    protocol: 'PQC Hybrid (Kyber-768)',
    action: 'ALLOWED (PQC)',
    latencyMs: 1.2
  },
  {
    id: 'hs-2',
    timestamp: '10:42:15.412',
    clientIp: '10.0.4.128',
    targetService: 'services/payments (Vault)',
    cipherSuite: 'TLS_AES_256_GCM_SHA384 + X25519',
    protocol: 'TLS 1.3',
    action: 'UPGRADED',
    latencyMs: 2.1
  },
  {
    id: 'hs-3',
    timestamp: '10:42:14.980',
    clientIp: '198.51.100.72',
    targetService: 'infra/k8s/gateway (Edge)',
    cipherSuite: 'TLS_RSA_WITH_AES_128_CBC_SHA',
    protocol: 'TLS 1.2',
    action: 'BLOCKED',
    latencyMs: 0.4
  },
  {
    id: 'hs-4',
    timestamp: '10:42:14.210',
    clientIp: '172.16.0.88',
    targetService: 'services/auth (JWT Token API)',
    cipherSuite: 'ECDHE-ECDSA-AES256-GCM-SHA384',
    protocol: 'TLS 1.3',
    action: 'UPGRADED',
    latencyMs: 1.8
  },
  {
    id: 'hs-5',
    timestamp: '10:42:13.650',
    clientIp: '203.0.113.19',
    targetService: 'services/webhooks (Dispatcher)',
    cipherSuite: 'TLS_RSA_WITH_AES_256_CBC_SHA',
    protocol: 'TLS 1.2',
    action: 'BLOCKED',
    latencyMs: 0.3
  }
];

export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets] = useState<CryptoAsset[]>(DEMO_CRYPTO_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('asset-rsa-2048');
  const [activeView, setActiveView] = useState<ActiveView>('DASHBOARD');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
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

  // Traffic Control State
  const [pqcEnforced, setPqcEnforced] = useState<boolean>(true);
  const [blockLegacyCiphers, setBlockLegacyCiphers] = useState<boolean>(true);
  const [rateLimitingEnabled, setRateLimitingEnabled] = useState<boolean>(true);
  const [rateLimitThreshold, setRateLimitThreshold] = useState<number>(8500);
  const [pqcTrafficRatio, setPqcTrafficRatio] = useState<number>(88);
  const [isSimulatingSpike, setIsSimulatingSpike] = useState<boolean>(false);
  const [handshakeLogs, setHandshakeLogs] = useState<IngressHandshakeLog[]>(INITIAL_HANDSHAKES);
  const [currentThroughput, setCurrentThroughput] = useState<number>(8420);
  const [blockedRate, setBlockedRate] = useState<number>(142);

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
    setScanStages(prev => prev.map(s => ({ ...s, status: 'PENDING' })));

    let currentStageIndex = 0;
    const totalDuration = 4800;
    const intervalTime = 100;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      const progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setScanProgress(progress);

      const stageIdx = Math.min(4, Math.floor((elapsed / totalDuration) * 5));
      if (stageIdx !== currentStageIndex) {
        currentStageIndex = stageIdx;
      }

      setScanStages(prev => prev.map((stage, idx) => {
        if (idx < stageIdx) return { ...stage, status: 'COMPLETED' };
        if (idx === stageIdx) return { ...stage, status: 'IN_PROGRESS' };
        return { ...stage, status: 'PENDING' };
      }));

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

  // Traffic Simulator Actions
  const simulateTrafficSpike = () => {
    setIsSimulatingSpike(true);
    setCurrentThroughput(18950);
    setBlockedRate(1420);
    showToast('Simulating 18,000+ Req/sec DDoS Spike: Token-Bucket Rate Limiter Activated!');

    const newSpikeLogs: IngressHandshakeLog[] = [
      {
        id: `hs-spike-${Date.now()}-1`,
        timestamp: new Date().toLocaleTimeString(),
        clientIp: '198.51.100.102',
        targetService: 'services/auth (API Spammer)',
        cipherSuite: 'TLS_AES_128_GCM_SHA256',
        protocol: 'TLS 1.3',
        action: 'THROTTLED',
        latencyMs: 0.2
      },
      {
        id: `hs-spike-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString(),
        clientIp: '198.51.100.103',
        targetService: 'services/auth (API Spammer)',
        cipherSuite: 'TLS_AES_128_GCM_SHA256',
        protocol: 'TLS 1.3',
        action: 'THROTTLED',
        latencyMs: 0.2
      },
      {
        id: `hs-spike-${Date.now()}-3`,
        timestamp: new Date().toLocaleTimeString(),
        clientIp: '10.0.8.22',
        targetService: 'services/payments (Legitimate)',
        cipherSuite: 'TLS_AES_256_GCM_SHA384 + ML-KEM-768',
        protocol: 'PQC Hybrid (Kyber-768)',
        action: 'ALLOWED (PQC)',
        latencyMs: 1.1
      }
    ];

    setHandshakeLogs(prev => [...newSpikeLogs, ...prev.slice(0, 10)]);

    setTimeout(() => {
      setIsSimulatingSpike(false);
      setCurrentThroughput(8420);
      setBlockedRate(142);
      showToast('Traffic Spike Subsided: Normal Ingress Flow Restored.');
    }, 6000);
  };

  const simulateLegacyAttack = () => {
    showToast('Detected 380 Insecure Legacy TLS 1.0/1.2 Handshakes: All Blocked by Cryptographic Shield.');
    const attackLogs: IngressHandshakeLog[] = [
      {
        id: `hs-atk-${Date.now()}-1`,
        timestamp: new Date().toLocaleTimeString(),
        clientIp: '45.33.32.156',
        targetService: 'services/auth',
        cipherSuite: 'SSL_RSA_WITH_3DES_EDE_CBC_SHA',
        protocol: 'TLS 1.2',
        action: 'BLOCKED',
        latencyMs: 0.1
      },
      {
        id: `hs-atk-${Date.now()}-2`,
        timestamp: new Date().toLocaleTimeString(),
        clientIp: '45.33.32.157',
        targetService: 'infra/k8s/gateway',
        cipherSuite: 'TLS_RSA_WITH_RC4_128_SHA',
        protocol: 'TLS 1.2',
        action: 'BLOCKED',
        latencyMs: 0.1
      }
    ];
    setHandshakeLogs(prev => [...attackLogs, ...prev.slice(0, 10)]);
  };

  const resetTrafficBaselines = () => {
    setPqcEnforced(true);
    setBlockLegacyCiphers(true);
    setRateLimitingEnabled(true);
    setRateLimitThreshold(8500);
    setPqcTrafficRatio(88);
    setCurrentThroughput(8420);
    setBlockedRate(142);
    setHandshakeLogs(INITIAL_HANDSHAKES);
    showToast('Traffic Control & Ingress Policies reset to standard defense baseline.');
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
        blockedRate
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
