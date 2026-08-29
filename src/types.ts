export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AlgorithmCategory = 'ASYMMETRIC' | 'SYMMETRIC' | 'HASH' | 'KEY_EXCHANGE' | 'PROTOCOL';

export type MigrationPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface MoscaFactors {
  dataLifetimeYears: number;   // X: Shelf-life of sensitive data (years)
  migrationTimeYears: number;  // Y: Time required to complete migration (years)
  threatTimelineYears: number; // Z: Time until Cryptographically Relevant Quantum Computer (CRQC) is realized
  isViolating: boolean;        // If X + Y > Z -> Immediate HNDL (Harvest Now, Decrypt Later) Vulnerability
  hndlVulnerabilityLevel: 'IMMEDIATE' | 'ELEVATED' | 'MONITORED' | 'SAFE';
}

export interface DownstreamDependency {
  serviceId: string;
  serviceName: string;
  serviceType: 'AUTH' | 'GATEWAY' | 'STORAGE' | 'PAYMENT' | 'INGRESS' | 'MICROSERVICE';
  applications: string[];
  sensitiveDataTypes: string[];
  businessCriticality: 'MISSION_CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dataClassification: 'TOP_SECRET_PII' | 'FINANCIAL_RECORDS' | 'SESSION_CREDENTIALS' | 'INTERNAL_TELEMETRY';
  annualRiskExposureUSD: string;
}

export interface PqcReplacement {
  nistStandard: string;        // e.g. "FIPS 203 (ML-KEM-768)", "FIPS 204 (ML-DSA-65)", "AES-256-GCM (Quantum Safe)"
  algorithmFamily: 'LATTICE' | 'STATELESS_HASH' | 'HYBRID_KEM' | 'SYMMETRIC';
  recommendedAction: string;  // e.g. "Migrate to Hybrid X25519 + ML-KEM-768 for TLS key exchange"
  migrationPhase: 'Phase 1 (Immediate - Q3 2026)' | 'Phase 2 (Near-Term - Q4 2026)' | 'Phase 3 (Long-Term - 2027)' | 'Compliant (Maintain)';
  estimatedEffortWeeks: number;
  codeSnippetBefore: string;
  codeSnippetAfter: string;
}

export interface CbomMetadata {
  cycloneDxRef: string;
  cryptoType: 'algorithm' | 'certificate' | 'protocol' | 'library';
  oid?: string;
  nistStatus: 'DEPRECATED' | 'LEGACY_USE_ONLY' | 'PQC_TRANSITION_REQUIRED' | 'QUANTUM_RESISTANT';
  quantumSecurityBits: number; // e.g. 0 bits vs Shor's, 128 bits vs Grover's
  fipsStatus: 'FIPS 140-3 Validated' | 'FIPS 140-2 Legacy' | 'Non-Compliant';
}

export interface CryptoAsset {
  id: string;
  name: string;
  algorithm: string;
  keySize: string;
  category: AlgorithmCategory;
  location: string;
  repository: string;
  lineNumbers: string;
  detectedAt: string;
  riskLevel: RiskLevel;
  migrationPriority: MigrationPriority;
  mosca: MoscaFactors;
  businessCriticality: 'MISSION_CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dependencies: DownstreamDependency;
  pqcRecommendation: PqcReplacement;
  cbom: CbomMetadata;
  summary: string;
  quantumAttackVector: string; // e.g., "Shor's Algorithm factoring RSA keys in O(log^3 N) polynomial time"
}

export interface ScanStage {
  id: number;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  durationMs: number;
  metrics: string;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  stageId: number;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'CRITICAL';
  message: string;
  target?: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'USER' | 'COPILOT' | 'SYSTEM';
  timestamp: string;
  text: string;
  suggestedPrompts?: string[];
  assetContextId?: string;
  metadata?: {
    riskLevel?: RiskLevel;
    pqcTarget?: string;
    moscaViolation?: boolean;
    businessImpact?: string;
  };
}

export type ActiveView = 
  | 'DASHBOARD'
  | 'SCAN'
  | 'ASSETS'
  | 'QUANTUM_RISK'
  | 'IMPACT_GRAPH'
  | 'MIGRATION'
  | 'REPORTS';
