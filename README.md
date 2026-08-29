# 🛡️ ECDAT — Enterprise Cryptographic Discovery & Analysis Tool

<div align="center">

![ECDAT Banner](https://img.shields.io/badge/SIH%202026-Problem%20SIH26164-0284c7?style=for-the-badge&logo=shield&logoColor=white)
![Organization](https://img.shields.io/badge/Organization-NTRO%20(National%20Technical%20Research%20Organisation)-059669?style=for-the-badge)
![Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge)
![Standard](https://img.shields.io/badge/Standard-CycloneDX%201.6%20CBOM%20%7C%20NIST%20PQC-6366f1?style=for-the-badge)

<br/>

> **Tagline:** *Discover. Assess. Prioritize. Migrate.*  
> **Core Mission:** *"ECDAT doesn't just find cryptography — it shows **what is at risk**, **what gets compromised**, and **what to migrate first**."*

[🚀 Live Demo](#-getting-started) • [📊 Key Features](#-key-features) • [🌐 Impact Graph](#-signature-feature-interactive-impact-graph-) • [📜 CycloneDX 1.6 CBOM](#-cyclonedx-16-cbom-compliance) • [🛠️ Tech Stack](#-technology-stack)

</div>

---

## 📌 Executive Summary & Problem Context

* **Event:** Smart India Hackathon (SIH 2026)
* **Problem Statement ID:** `SIH26164`
* **Ministry / Agency:** National Technical Research Organisation (NTRO)
* **Domain:** Post-Quantum Cryptography (PQC) & Cybersecurity Defense

### The Challenge
With the inevitable arrival of **Cryptographically Relevant Quantum Computers (CRQCs)**, classical public-key cryptography (**RSA**, **ECC/ECDSA**, **Diffie-Hellman**) will be broken in polynomial time via **Shor’s Algorithm**. Furthermore, adversaries are executing **"Harvest Now, Decrypt Later" (HNDL)** attacks—intercepting encrypted enterprise and national security communications today to decrypt them once quantum hardware matures.

### The ECDAT Solution
**ECDAT** is an enterprise-grade cryptographic management platform that:
1. **Discovers** all cryptographic assets across multi-repository polyglot codebases into an automated **Cryptography Bill of Materials (CBOM)** using CycloneDX 1.6 specifications.
2. **Assesses** quantum vulnerability timelines using **Mosca’s Theorem** ($X + Y > Z$).
3. **Prioritizes** migration through a 4-tier interactive **Blast Radius Impact Map** ($Primitive \to Service \to Application \to Stolen Data$).
4. **Migrates** legacy ciphers with actionable, NIST-standard Post-Quantum replacement code playbooks (**FIPS 203 ML-KEM**, **FIPS 204 ML-DSA**, **FIPS 205 SLH-DSA**).

---

## 🌟 Key Features

### 1. ⚡ Automated 5-Second Code Discovery Scanner
* Multi-stage AST parser simulating discovery across microservices, TLS gateways, and container configurations.
* Live streaming telemetry console showing cryptographic algorithm extraction, key-size detection, and FIPS compliance status.

### 2. 📋 Official CycloneDX 1.6 CBOM Inventory
* Generates strict, schema-compliant **CycloneDX 1.6 JSON** with OID mappings, key lengths, classical vs. quantum security bits, and evidence tracking.
* Filter and search across algorithm types (Asymmetric, Symmetric, Hash, Key Exchange, Protocols) and Risk Levels.
* 1-click **Export CBOM JSON** and **Executive Compliance PDF**.

### 3. ⏳ Quantum Threat & Mosca Countdown Engine
* Quantifies **Mosca's Theorem**:
  $$\text{If } X (\text{Data Shelf-Life}) + Y (\text{Migration Time}) > Z (\text{Quantum Horizon} \approx 6\text{ yrs}) \implies \text{CRITICAL DANGER}$$
* Explains the mathematical mechanics of **Shor's Algorithm** (complete breakage of RSA/ECC) vs. **Grover's Algorithm** (key-halving of AES-256 where 128-bit margin remains secure).

### 4. ⭐ Signature Feature: 4-Column Interactive Impact Graph
* Interactive React Flow canvas tracing cryptographic compromise downstream:
  $$\mathbf{Encryption\ Key} \longrightarrow \mathbf{Backend\ Service} \longrightarrow \mathbf{User\ Application} \longrightarrow \mathbf{Compromised\ Sensitive\ Data}$$
* Highlights the exact blast radius, affected user-facing apps, and calculated annual financial exposure (e.g., **RSA-2048 in auth service $\to$ \$14.2M exposure**).

### 5. 🛠️ Actionable NIST PQC Migration Playbooks
* Side-by-side **Before (Legacy Code) vs. After (Post-Quantum Fix)** code diffs.
* Direct drop-in replacements for Python, Java, Kubernetes Ingress, OpenVPN, and JWT token signers using official NIST standards:
  * `FIPS 203`: **ML-KEM (Kyber-768)**
  * `FIPS 204`: **ML-DSA (Dilithium-65)**
  * `FIPS 205`: **SLH-DSA (SPHINCS+)**

### 6. 🤖 Grounded AI Cryptographic Copilot
* Contextual AI assistant grounded exclusively on actual codebase telemetry (zero hallucinations).
* Canned instant prompts:
  * *"Why is this risky?"*
  * *"What should I migrate first?"*
  * *"Explain this CBOM."*

### 7. 🎬 1-Click Guided Demo Tour for Evaluators
* Floating 6-step presentation tour designed for SIH judges to experience the end-to-end platform workflow in under 60 seconds.

---

## 📊 Pre-Loaded Canonical Cryptographic Inventory

| Primitive / Key | Location | Risk Rating | Mosca ($X+Y>Z$) | Downstream Impact | NIST PQC Migration Target |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **RSA-2048** | `services/auth/auth.py` | 🔴 **CRITICAL** | ⚠️ $7+2 > 6$ (Violated) | Core Auth $\to$ SSO Portal $\to$ JWT Keys & User Passwords | **FIPS 204 (ML-DSA Dilithium-65)** |
| **ECDSA-P256** | `infra/certs/cert.pem` | 🔴 **HIGH** | ⚠️ $5+2 > 6$ (Violated) | API Gateway $\to$ REST API $\to$ Financial Transaction Tokens | **FIPS 204 (ML-DSA) / Dual-Cert** |
| **AES-256-GCM** | `services/payments/payment.py`| 🟢 **LOW (SAFE)** | ✓ $3+1 < 6$ (Safe) | Payment Vault $\to$ PAN Records | **Maintain AES-256 (Quantum Safe)** |
| **TLS 1.2** | `infra/k8s/gateway/ingress.yaml`| 🟡 **MEDIUM** | ⚠️ $4+3 > 6$ (Violated) | Edge Ingress $\to$ Web & Mobile $\to$ In-Transit Customer Data | **Upgrade TLS 1.3 + Hybrid Kyber** |
| **SHA-1** | `services/webhooks/legacy.py` | 🔴 **CRITICAL** | ⚠️ $6+1 > 6$ (Violated) | Webhook Dispatcher $\to$ Partner Events | **Upgrade SHA-384 / FIPS 204** |
| **DH-2048** | `infra/vpn/vpn-config.ovpn` | 🔴 **HIGH** | ⚠️ $8+2 > 6$ (Violated) | Corporate VPN $\to$ Admin Network $\to$ Internal Traffic | **FIPS 203 (ML-KEM Kyber-768)** |

---

## 🛠️ Technology Stack

* **Frontend Framework:** React 19 + Vite + TypeScript
* **Styling & Design System:** Tailwind CSS with Frosted Glassmorphism (Specular Bevels, Ambient Aurora Refraction)
* **Graph & Data Visualization:** `@xyflow/react` (React Flow), `Recharts`
* **Icons:** `lucide-react`
* **Animations:** `framer-motion`, `canvas-confetti`
* **Data Layer:** In-memory canonical React Context architecture (100% frontend, zero backend dependencies required for demo)

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bhagyaviv/ECDAT.git
   cd ECDAT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173/` (or port indicated in terminal).

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🧭 Evaluator & Judge Walkthrough (1-Minute Guide)

1. **Sign-In:** Click the amber **"1-Click Demo Sign-In"** button to enter the security analyst console.
2. **Dashboard:** Observe the **38% Quantum Readiness Score (Grade D+)** and the **Mosca Timeline countdown**.
3. **Start Guided Tour:** Click **"Start Demo"** in the top navigation bar to launch the interactive step-by-step tour.
4. **Trigger Scan:** Go to **New Scan** and click **"Launch Discovery Scan"** to watch the animated 5-second discovery AST run.
5. **Inspect Impact Map (Signature Feature):** Open **5. Impact Graph ⭐**. Click on **RSA-2048** to see the 4-column downstream blast radius light up and calculate financial risk.
6. **Code Migration:** Open **6. Migration Plan** to view side-by-side before/after code playbooks.
7. **Export CBOM:** Open **7. CBOM & Reports** to inspect the CycloneDX 1.6 schema or download `ecdat-cbom-cyclonedx-1.6.json`.

---

## 📜 Standards & Compliance References

* **CycloneDX 1.6:** Cryptography Bill of Materials (CBOM) Schema Specification
* **NIST FIPS 203:** Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM)
* **NIST FIPS 204:** Module-Lattice-Based Digital Signature Standard (ML-DSA)
* **NIST FIPS 205:** Stateless Hash-Based Digital Signature Standard (SLH-DSA)
* **NIST SP 800-227:** Recommendations for Post-Quantum Cryptography Migration
* **NSA CNSA 2.0:** Commercial National Security Algorithm Suite 2.0 Timelines

---

## 👥 Authors & Acknowledgments

* **Project:** Enterprise Cryptographic Discovery & Analysis Tool (ECDAT)
* **Smart India Hackathon 2026:** Problem Statement `SIH26164`
* **Submitted for:** National Technical Research Organisation (NTRO)

---

<div align="center">
  <sub>Built with ❤️ for Smart India Hackathon 2026</sub>
</div>
