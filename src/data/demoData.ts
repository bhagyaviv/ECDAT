import { CryptoAsset, ScanStage, ScanLog } from '../types';

export const DEMO_CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: 'asset-rsa-2048',
    name: 'RSA-2048 Authentication Keypair',
    algorithm: 'RSA',
    keySize: '2048-bit',
    category: 'ASYMMETRIC',
    location: 'services/auth/auth.py',
    repository: 'github.com/enterprise/auth-service',
    lineNumbers: 'L42-L89',
    detectedAt: '2026-08-29 10:14:22 UTC',
    riskLevel: 'HIGH',
    migrationPriority: 'CRITICAL',
    mosca: {
      dataLifetimeYears: 7,    // X: Customer session tokens & master identity records valid for 7 years
      migrationTimeYears: 2,   // Y: Time to transition identity providers and client SDKs
      threatTimelineYears: 6,  // Z: CRQC estimated by 2032
      isViolating: true,       // 7 + 2 = 9 > 6 -> Mosca Theorem Violated!
      hndlVulnerabilityLevel: 'IMMEDIATE',
    },
    businessCriticality: 'MISSION_CRITICAL',
    dependencies: {
      serviceId: 'svc-auth-01',
      serviceName: 'Core Authentication Service',
      serviceType: 'AUTH',
      applications: ['Customer Portal (Web/Mobile)', 'Single Sign-On (SSO) Gateway', 'Admin Console', 'Partner B2B API'],
      sensitiveDataTypes: ['JWT Session Signing Keys', 'User Passwords / Salt Hashes', 'OAuth2 Refresh Tokens', 'PII Master Records'],
      businessCriticality: 'MISSION_CRITICAL',
      dataClassification: 'TOP_SECRET_PII',
      annualRiskExposureUSD: '$14.2M (Direct regulatory fines & credential takeover)',
    },
    pqcRecommendation: {
      nistStandard: 'FIPS 204 (ML-DSA-65) & Hybrid Dilithium',
      algorithmFamily: 'LATTICE',
      recommendedAction: 'Migrate RSA-2048 signing to Hybrid RSA + ML-DSA-65 (NIST FIPS 204) with stateless JWT tokens.',
      migrationPhase: 'Phase 1 (Immediate - Q3 2026)',
      estimatedEffortWeeks: 3,
      codeSnippetBefore: `# Legacy RSA Signing (Vulnerable to Shor's Algorithm)
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes

private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
signature = private_key.sign(
    payload_data,
    padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
    hashes.SHA256()
)`,
      codeSnippetAfter: `# Post-Quantum ML-DSA-65 Hybrid Signing (NIST FIPS 204 Compliant)
import liboqs
from pqcrypto.sign import mldsa65

# Dual-sign with classical fallback + Quantum-Resistant ML-DSA
classical_sig = sign_rsa_sha256(payload_data, rsa_key)
pqc_sig = mldsa65.sign(payload_data, mldsa_privkey)
hybrid_token = bundle_hybrid_signature(classical_sig, pqc_sig)`
    },
    cbom: {
      cycloneDxRef: 'urn:cdx:crypto:alg:rsa-2048:auth-py',
      cryptoType: 'algorithm',
      oid: '1.2.840.113549.1.1.1',
      nistStatus: 'PQC_TRANSITION_REQUIRED',
      quantumSecurityBits: 0,
      fipsStatus: 'FIPS 140-2 Legacy',
    },
    summary: 'RSA-2048 key used in user session JWT signing. Completely vulnerable to Shor\'s algorithm on a quantum computer with ~4,096 logical qubits. Immediate Harvest Now Decrypt Later risk.',
    quantumAttackVector: 'Shor\'s Algorithm factorizes RSA-2048 in polynomial time O((log N)³). Attackers recording encrypted traffic today will decrypt JWT auth tokens retrospectively.'
  },
  {
    id: 'asset-ecdsa-p256',
    name: 'ECDSA P-256 Edge TLS Certificate',
    algorithm: 'ECDSA',
    keySize: 'secp256r1 (256-bit)',
    category: 'ASYMMETRIC',
    location: 'infra/certs/cert.pem',
    repository: 'github.com/enterprise/edge-gateway-config',
    lineNumbers: 'L1-L32',
    detectedAt: '2026-08-29 10:14:24 UTC',
    riskLevel: 'HIGH',
    migrationPriority: 'HIGH',
    mosca: {
      dataLifetimeYears: 5,
      migrationTimeYears: 1.5,
      threatTimelineYears: 6,
      isViolating: true, // 5 + 1.5 = 6.5 > 6 -> Mosca Violation
      hndlVulnerabilityLevel: 'IMMEDIATE',
    },
    businessCriticality: 'HIGH',
    dependencies: {
      serviceId: 'svc-gateway-02',
      serviceName: 'API Edge Gateway',
      serviceType: 'GATEWAY',
      applications: ['Public REST API Gateway', 'Mobile Banking App Backend', 'Partner Webhook Receiver'],
      sensitiveDataTypes: ['In-transit API Payload Tokens', 'Credit Card Validation Webhooks', 'mTLS Client Certificates'],
      businessCriticality: 'HIGH',
      dataClassification: 'FINANCIAL_RECORDS',
      annualRiskExposureUSD: '$8.5M (API MitM & Transaction Tampering)',
    },
    pqcRecommendation: {
      nistStandard: 'FIPS 204 (ML-DSA-44) / Falcon-512 (FIPS 206)',
      algorithmFamily: 'LATTICE',
      recommendedAction: 'Re-issue edge TLS certificates with Hybrid X.509 certificates (ECDSA-P256 + ML-DSA-44) for quantum-safe mTLS handshakes.',
      migrationPhase: 'Phase 2 (Near-Term - Q4 2026)',
      estimatedEffortWeeks: 2,
      codeSnippetBefore: `# Legacy TLS Certificate (ECDSA P-256)
Certificate:
    Data:
        Version: 3 (0x2)
        Signature Algorithm: ecdsa-with-SHA256
        Public Key Algorithm: id-ecPublicKey
            Public-Key: (256 bit)
            Curve: P-256 (prime256v1)`,
      codeSnippetAfter: `# Post-Quantum Composite X.509 Certificate (FIPS 204 ML-DSA-44)
Certificate:
    Data:
        Version: 3 (0x2)
        Signature Algorithm: composite-ecdsa-p256-mldsa44
        Public Key Algorithm: id-composite-key
            Classical: secp256r1 (256 bit)
            Post-Quantum: ML-DSA-44 (1312 bytes)`
    },
    cbom: {
      cycloneDxRef: 'urn:cdx:crypto:cert:ecdsa-p256:edge-gateway',
      cryptoType: 'certificate',
      oid: '1.2.840.10045.2.1',
      nistStatus: 'PQC_TRANSITION_REQUIRED',
      quantumSecurityBits: 0,
      fipsStatus: 'FIPS 140-3 Validated',
    },
    summary: 'Elliptic Curve Digital Signature Algorithm on NIST P-256 curve. Vulnerable to Shor\'s algorithm discrete logarithm solver in O(n³) operations.',
    quantumAttackVector: 'Shor\'s discrete logarithm algorithm solves elliptic curve discrete logarithm problem (ECDLP) in polynomial time, completely forging TLS signatures.'
  },
  {
    id: 'asset-aes-256',
    name: 'AES-256-GCM Database Column Encryption',
    algorithm: 'AES-GCM',
    keySize: '256-bit',
    category: 'SYMMETRIC',
    location: 'services/payments/payment.py',
    repository: 'github.com/enterprise/payment-vault',
    lineNumbers: 'L112-L148',
    detectedAt: '2026-08-29 10:14:26 UTC',
    riskLevel: 'LOW',
    migrationPriority: 'LOW',
    mosca: {
      dataLifetimeYears: 10,
      migrationTimeYears: 0.5,
      threatTimelineYears: 15,
      isViolating: false, // 10 + 0.5 = 10.5 < 15 -> Safe!
      hndlVulnerabilityLevel: 'SAFE',
    },
    businessCriticality: 'MISSION_CRITICAL',
    dependencies: {
      serviceId: 'svc-payment-03',
      serviceName: 'Payment Tokenization Vault',
      serviceType: 'PAYMENT',
      applications: ['Credit Card Vault', 'Settlement Engine', 'PCI-DSS Compliance Microservice'],
      sensitiveDataTypes: ['PCI-DSS Cardholder Primary Account Numbers (PAN)', 'Card Expiry & CVV Hashes', 'Billing Addresses'],
      businessCriticality: 'MISSION_CRITICAL',
      dataClassification: 'FINANCIAL_RECORDS',
      annualRiskExposureUSD: '$0 (Quantum Resistant with 128-bit quantum security margin)',
    },
    pqcRecommendation: {
      nistStandard: 'AES-256-GCM (NIST Approved Quantum Resistant)',
      algorithmFamily: 'SYMMETRIC',
      recommendedAction: 'Retain AES-256-GCM. Grover\'s algorithm reduces effective security from 256 bits to 128 bits, which exceeds the minimum 112-bit NIST security threshold.',
      migrationPhase: 'Compliant (Maintain)',
      estimatedEffortWeeks: 0,
      codeSnippetBefore: `# AES-256-GCM (Symmetric 256-bit Key)
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

aesgcm = AESGCM(key_256_bits)
ciphertext = aesgcm.encrypt(nonce, raw_pan_data, associated_data)`,
      codeSnippetAfter: `# AES-256-GCM is Quantum Resistant (No Migration Required)
# Grover's algorithm quantum search: 2^(256/2) = 2^128 operations (Computationally infeasible)
# Status: Compliant with NIST PQC Guidelines & NSA CNSA 2.0`
    },
    cbom: {
      cycloneDxRef: 'urn:cdx:crypto:alg:aes-256-gcm:payment-vault',
      cryptoType: 'algorithm',
      oid: '2.16.840.1.101.3.4.1.46',
      nistStatus: 'QUANTUM_RESISTANT',
      quantumSecurityBits: 128,
      fipsStatus: 'FIPS 140-3 Validated',
    },
    summary: 'Symmetric cipher AES with 256-bit key length and Galois/Counter Mode authenticated encryption. Fully compliant with post-quantum security requirements against Grover\'s speedup.',
    quantumAttackVector: 'Grover\'s algorithm provides quadratic speedup O(√N), halving key length from 256-bit to 128-bit quantum security, which remains unbreakable by physical quantum computers.'
  },
  {
    id: 'asset-tls-12',
    name: 'TLS 1.2 Ingress with RSA Key Exchange',
    algorithm: 'TLS 1.2 (ECDHE-RSA-AES128-SHA256)',
    keySize: 'TLSv1.2 Protocol',
    category: 'PROTOCOL',
    location: 'infra/k8s/gateway/load-balancer.yaml',
    repository: 'github.com/enterprise/kubernetes-cluster-infra',
    lineNumbers: 'L28-L55',
    detectedAt: '2026-08-29 10:14:27 UTC',
    riskLevel: 'MEDIUM',
    migrationPriority: 'MEDIUM',
    mosca: {
      dataLifetimeYears: 4,
      migrationTimeYears: 1.0,
      threatTimelineYears: 6,
      isViolating: false, // 4 + 1 = 5 <= 6 (borderline)
      hndlVulnerabilityLevel: 'ELEVATED',
    },
    businessCriticality: 'HIGH',
    dependencies: {
      serviceId: 'svc-ingress-04',
      serviceName: 'Enterprise Ingress Load Balancer',
      serviceType: 'INGRESS',
      applications: ['Customer Mobile App Backend', 'Internal Admin Dashboard', 'Public Marketing Site'],
      sensitiveDataTypes: ['In-transit HTTP Session Headers', 'Bearer Tokens', 'Encrypted TLS Traffic Stream'],
      businessCriticality: 'HIGH',
      dataClassification: 'SESSION_CREDENTIALS',
      annualRiskExposureUSD: '$4.2M (Harvest Now Decrypt Later Wiretapping Risk)',
    },
    pqcRecommendation: {
      nistStandard: 'TLS 1.3 with Hybrid ML-KEM-768 (X25519Kyber768Draft00 / FIPS 203)',
      algorithmFamily: 'HYBRID_KEM',
      recommendedAction: 'Enforce TLS 1.3 protocol and enable hybrid Post-Quantum Key Encapsulation Mechanism (X25519Kyber768) at the Ingress Controller.',
      migrationPhase: 'Phase 1 (Immediate - Q3 2026)',
      estimatedEffortWeeks: 1,
      codeSnippetBefore: `# Legacy TLS 1.2 Ingress Config
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2"
    nginx.ingress.kubernetes.io/ssl-ciphers: "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384"`,
      codeSnippetAfter: `# Quantum-Safe TLS 1.3 with Hybrid ML-KEM-768
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.3"
    nginx.ingress.kubernetes.io/ssl-ciphers: "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256"
    nginx.ingress.kubernetes.io/ssl-ecdh-curve: "X25519MLKEM768:X25519:secp256r1"`
    },
    cbom: {
      cycloneDxRef: 'urn:cdx:crypto:proto:tls-1.2:k8s-ingress',
      cryptoType: 'protocol',
      nistStatus: 'LEGACY_USE_ONLY',
      quantumSecurityBits: 0,
      fipsStatus: 'FIPS 140-2 Legacy',
    },
    summary: 'TLS 1.2 endpoint lacking post-quantum key agreement. Network adversaries can store encrypted handshakes today and break the ECDHE ephemeral keys once CRQC becomes available.',
    quantumAttackVector: 'Harvest Now, Decrypt Later (HNDL): Passive wiretapping of encrypted TLS handshakes. Shor\'s algorithm can factorize or compute discrete logs retrospectively.'
  },
  {
    id: 'asset-sha1-legacy',
    name: 'SHA-1 Legacy Webhook Digest',
    algorithm: 'SHA-1',
    keySize: '160-bit',
    category: 'HASH',
    location: 'services/webhooks/legacy_hash.py',
    repository: 'github.com/enterprise/webhook-dispatcher',
    lineNumbers: 'L18-L34',
    detectedAt: '2026-08-29 10:14:28 UTC',
    riskLevel: 'CRITICAL',
    migrationPriority: 'CRITICAL',
    mosca: {
      dataLifetimeYears: 3,
      migrationTimeYears: 0.5,
      threatTimelineYears: 1, // Already classically broken!
      isViolating: true,
      hndlVulnerabilityLevel: 'IMMEDIATE',
    },
    businessCriticality: 'MEDIUM',
    dependencies: {
      serviceId: 'svc-webhook-05',
      serviceName: 'Legacy Webhook Dispatcher',
      serviceType: 'MICROSERVICE',
      applications: ['Legacy Partner Notification System', 'ERP Data Sync Webhook'],
      sensitiveDataTypes: ['Webhook HMAC Signatures', 'Payload Integrity Hashes'],
      businessCriticality: 'MEDIUM',
      dataClassification: 'INTERNAL_TELEMETRY',
      annualRiskExposureUSD: '$2.1M (Collision Attack & Webhook Spoofing)',
    },
    pqcRecommendation: {
      nistStandard: 'SHA-384 / SHA3-256 (Quantum & Collision Resistant)',
      algorithmFamily: 'STATELESS_HASH',
      recommendedAction: 'Replace deprecated SHA-1 immediately with SHA-384 or SHA3-256 for all HMAC calculations.',
      migrationPhase: 'Phase 1 (Immediate - Q3 2026)',
      estimatedEffortWeeks: 1,
      codeSnippetBefore: `# Deprecated SHA-1 HMAC (Vulnerable to Collision Attacks)
import hashlib
import hmac

digest = hmac.new(secret_key, webhook_payload, hashlib.sha1).hexdigest()`,
      codeSnippetAfter: `# Quantum-Safe SHA-384 HMAC (NIST SP 800-107 Compliant)
import hashlib
import hmac

digest = hmac.new(secret_key, webhook_payload, hashlib.sha384).hexdigest()`
    },
    cbom: {
      cycloneDxRef: 'urn:cdx:crypto:alg:sha1:webhook-dispatcher',
      cryptoType: 'algorithm',
      oid: '1.3.14.3.2.26',
      nistStatus: 'DEPRECATED',
      quantumSecurityBits: 0,
      fipsStatus: 'Non-Compliant',
    },
    summary: 'SHA-1 has known classical collision vulnerabilities (SHAttered attack) and zero quantum preimage resistance margin.',
    quantumAttackVector: 'Classically broken with practical chosen-prefix collisions, plus Grover\'s algorithm reduces preimage search to 2^80 operations.'
  },
  {
    id: 'asset-dh-2048',
    name: 'Diffie-Hellman 2048-bit VPN Key Exchange',
    algorithm: 'DH-2048 (MODP Group 14)',
    keySize: '2048-bit',
    category: 'KEY_EXCHANGE',
    location: 'infra/vpn/vpn-config.ovpn',
    repository: 'github.com/enterprise/network-security',
    lineNumbers: 'L72-L105',
    detectedAt: '2026-08-29 10:14:30 UTC',
    riskLevel: 'HIGH',
    migrationPriority: 'HIGH',
    mosca: {
      dataLifetimeYears: 8,
      migrationTimeYears: 1.5,
      threatTimelineYears: 6,
      isViolating: true,
      hndlVulnerabilityLevel: 'IMMEDIATE',
    },
    businessCriticality: 'HIGH',
    dependencies: {
      serviceId: 'svc-vpn-06',
      serviceName: 'Remote Access Corporate VPN',
      serviceType: 'GATEWAY',
      applications: ['Employee Corporate VPN', 'Internal Admin SSH Bastion', 'Database Cluster Management Plane'],
      sensitiveDataTypes: ['Internal Corporate Traffic', 'Database Queries & Dumps', 'Source Code Access Stream'],
      businessCriticality: 'HIGH',
      dataClassification: 'TOP_SECRET_PII',
      annualRiskExposureUSD: '$11.8M (Internal Infrastructure Compromise)',
    },
    pqcRecommendation: {
      nistStandard: 'FIPS 203 (ML-KEM-1024) / Kyber-1024',
      algorithmFamily: 'LATTICE',
      recommendedAction: 'Migrate IPsec/OpenVPN tunnels to PQC Hybrid KEM using ML-KEM-1024 for quantum-secure tunnel key agreement.',
      migrationPhase: 'Phase 2 (Near-Term - Q4 2026)',
      estimatedEffortWeeks: 2,
      codeSnippetBefore: `# Legacy OpenVPN DH Parameters (MODP Group 14)
dh dh2048.pem
tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384`,
      codeSnippetAfter: `# Post-Quantum OpenVPN with Hybrid ML-KEM-1024
dh none # Use Ephemeral Hybrid KEM
tls-groups X25519MLKEM1024:MLKEM1024
tls-cipher TLS-AES-256-GCM-SHA384`
    },
    cbom: {
      cycloneDxRef: 'urn:cdx:crypto:alg:dh-2048:corp-vpn',
      cryptoType: 'algorithm',
      oid: '1.2.840.113549.1.3.1',
      nistStatus: 'PQC_TRANSITION_REQUIRED',
      quantumSecurityBits: 0,
      fipsStatus: 'FIPS 140-2 Legacy',
    },
    summary: 'Diffie-Hellman 2048-bit discrete logarithm key exchange used in perimeter VPN tunnels. High-priority target for state-sponsored Harvest Now Decrypt Later programs.',
    quantumAttackVector: 'Shor\'s discrete logarithm algorithm breaks finite-field Diffie-Hellman in polynomial time, exposing captured enterprise VPN communications.'
  }
];

export const SCAN_STAGES_INITIAL: ScanStage[] = [
  {
    id: 1,
    title: 'Source Code & Binary Static Analysis',
    description: 'Scanning repositories, AST parsing, configuration files, and certificate stores',
    status: 'PENDING',
    durationMs: 900,
    metrics: '42 repos, 1,840 source files, 14 TLS endpoints'
  },
  {
    id: 2,
    title: 'Cryptographic Primitive Detection',
    description: 'Pattern matching, entropy distribution analysis, and library dependency probing',
    status: 'PENDING',
    durationMs: 1100,
    metrics: '6 cryptographic algorithms identified, 2 deprecated schemes'
  },
  {
    id: 3,
    title: 'CBOM (Cryptography Bill of Materials) Generation',
    description: 'Constructing CycloneDX 1.6 Cryptographic BOM with OIDs and FIPS 140 metadata',
    status: 'PENDING',
    durationMs: 800,
    metrics: '100% CBOM standard compliant with NIST SP 800-227'
  },
  {
    id: 4,
    title: 'Quantum Risk & Mosca Theorem Assessment',
    description: 'Calculating X + Y > Z risk factors, Shor/Grover vulnerability margins, and HNDL score',
    status: 'PENDING',
    durationMs: 1000,
    metrics: '4 of 6 assets violate Mosca Theorem (66.7% quantum exposure)'
  },
  {
    id: 5,
    title: 'Prioritized PQC Migration Synthesis',
    description: 'Synthesizing FIPS 203/204/205/206 replacement pathways and impact blast radiuses',
    status: 'PENDING',
    durationMs: 900,
    metrics: '3 immediate Phase 1 actions generated with code diffs'
  }
];

export const DEMO_SCAN_LOGS: ScanLog[] = [
  { id: 'log-1', timestamp: '00:00.12', stageId: 1, level: 'INFO', message: 'Initializing ECDAT Cryptographic AST Scanner v2.4 (SIH26164 engine)...' },
  { id: 'log-2', timestamp: '00:00.35', stageId: 1, level: 'INFO', message: 'Mounted repo: github.com/enterprise/auth-service [Branch: main]' },
  { id: 'log-3', timestamp: '00:00.62', stageId: 1, level: 'WARN', message: 'Detected asymmetric key generation in auth.py: RSA-2048 (L42-L89)' },
  { id: 'log-4', timestamp: '00:01.05', stageId: 2, level: 'INFO', message: 'Scanning X.509 certificate chain in edge-gateway-config/cert.pem...' },
  { id: 'log-5', timestamp: '00:01.32', stageId: 2, level: 'WARN', message: 'Detected Elliptic Curve Primitive: ECDSA secp256r1 (OID: 1.2.840.10045.2.1)' },
  { id: 'log-6', timestamp: '00:01.78', stageId: 2, level: 'CRITICAL', message: 'Identified deprecated hash function: SHA-1 in legacy_hash.py (Collision risk)' },
  { id: 'log-7', timestamp: '00:02.10', stageId: 3, level: 'SUCCESS', message: 'Assembling CycloneDX 1.6 Cryptographic BOM Schema...' },
  { id: 'log-8', timestamp: '00:02.45', stageId: 3, level: 'INFO', message: 'Mapped 6 cryptographic components to NIST SP 800-227 standard taxonomy.' },
  { id: 'log-9', timestamp: '00:03.02', stageId: 4, level: 'CRITICAL', message: 'Mosca Theorem Alert: RSA-2048 (X:7y + Y:2y = 9y) > CRQC Timeline Z:6y! Immediate HNDL exposure.' },
  { id: 'log-10', timestamp: '00:03.48', stageId: 4, level: 'WARN', message: 'Calculated Quantum Vulnerability Exposure: $38.7M annual enterprise blast radius.' },
  { id: 'log-11', timestamp: '00:04.12', stageId: 5, level: 'SUCCESS', message: 'Mapped NIST PQC FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA) drop-in replacement candidates.' },
  { id: 'log-12', timestamp: '00:04.70', stageId: 5, level: 'SUCCESS', message: 'Scan completed. Enterprise Quantum Readiness Score: 38% (Vulnerable). Navigating to Asset Inventory.' }
];

export const DEMO_STATS = {
  totalAssets: 6,
  quantumVulnerableCount: 4,
  quantumResistantCount: 2,
  moscaViolationsCount: 4,
  readinessScore: 38, // 38% ready (Needs migration)
  readinessGrade: 'D+',
  targetReadinessScore: 94,
  riskDistribution: [
    { name: 'Critical', value: 2, color: '#f43f5e', fill: '#f43f5e' },
    { name: 'High', value: 2, color: '#f97316', fill: '#f97316' },
    { name: 'Medium', value: 1, color: '#eab308', fill: '#eab308' },
    { name: 'Low', value: 1, color: '#10b981', fill: '#10b981' },
  ],
  categoryDistribution: [
    { category: 'Asymmetric (RSA/ECC)', count: 2, vulnerable: true },
    { category: 'Key Exchange (DH)', count: 1, vulnerable: true },
    { category: 'Protocols (TLS 1.2)', count: 1, vulnerable: true },
    { category: 'Legacy Hash (SHA-1)', count: 1, vulnerable: true },
    { category: 'Symmetric (AES-256)', count: 1, vulnerable: false },
  ],
  moscaComparisonData: [
    { name: 'RSA-2048 (auth.py)', needed: 9, threat: 6, violation: true, assetId: 'asset-rsa-2048' },
    { name: 'ECDSA-P256 (cert.pem)', needed: 6.5, threat: 6, violation: true, assetId: 'asset-ecdsa-p256' },
    { name: 'DH-2048 (vpn-config)', needed: 9.5, threat: 6, violation: true, assetId: 'asset-dh-2048' },
    { name: 'SHA-1 (legacy_hash)', needed: 3.5, threat: 1, violation: true, assetId: 'asset-sha1-legacy' },
    { name: 'TLS 1.2 (gateway)', needed: 5.0, threat: 6, violation: false, assetId: 'asset-tls-12' },
    { name: 'AES-256-GCM (payment)', needed: 10.5, threat: 15, violation: false, assetId: 'asset-aes-256' },
  ]
};
