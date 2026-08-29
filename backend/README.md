# ☕ ECDAT Spring Boot Backend & MySQL Workbench Guide

> **Enterprise Cryptographic Discovery & Analysis Tool (ECDAT)**  
> **Smart India Hackathon 2026 • NTRO Problem Statement SIH26164**

---

## 🏗️ Architecture Overview

The backend is built with **Java 17 / 21 + Spring Boot 3 + Spring Data JPA + MySQL** and provides enterprise REST APIs for:
* **Cryptographic Assets & CBOM:** `/api/v1/assets`
* **CycloneDX 1.6 Schema Export:** `/api/v1/assets/cbom/cyclonedx`
* **Quantum Threat & Mosca Violations:** `/api/v1/assets/mosca-violations`
* **Discovery Scanner:** `/api/v1/scan/launch`
* **Ingress & Traffic Shield:** `/api/v1/traffic/handshakes`
* **Interactive Swagger UI:** `http://localhost:8080/swagger-ui.html`

---

## 🐬 Step 1: Database Setup in MySQL Workbench

1. Open **MySQL Workbench**.
2. Connect to your local MySQL server instance (e.g. `localhost:3306`, user: `root`).
3. Open the SQL script located at:
   ```
   d:/ECDAT/backend/src/main/resources/schema.sql
   ```
4. Click the **Execute (⚡ Lightning Bolt)** icon in MySQL Workbench.
5. This will create:
   * Database: `ecdat_db`
   * Tables: `crypto_assets`, `scan_records`, `ingress_logs`
   * Pre-loaded canonical cryptographic inventory seed data.

---

## 🍃 Step 2: Open and Run in Spring Tool Suite (STS)

1. Launch **Spring Tool Suite (STS)**.
2. Go to **File ➔ Import ➔ Maven ➔ Existing Maven Projects**.
3. Click **Browse** and select the folder:
   ```
   d:\ECDAT\backend
   ```
4. Click **Finish**. STS will automatically download Maven dependencies (`spring-boot-starter-web`, `spring-data-jpa`, `mysql-connector-j`, `springdoc-openapi`).
5. Open `src/main/resources/application.properties` and verify your MySQL password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
6. Right-click on the project in STS ➔ **Run As ➔ Spring Boot App** (or run `EcdatBackendApplication.java`).

---

## 🌐 Step 3: Test REST APIs & Swagger UI

Once started on port `8080`:

* **Swagger OpenAPI Documentation:**  
  👉 [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

* **Get All Cryptographic Assets (CBOM):**  
  `GET http://localhost:8080/api/v1/assets`

* **Get Mosca Theorem ($X+Y > Z$) Violations:**  
  `GET http://localhost:8080/api/v1/assets/mosca-violations`

* **Export CycloneDX 1.6 CBOM JSON:**  
  `GET http://localhost:8080/api/v1/assets/cbom/cyclonedx`

* **Get Traffic Controller Metrics:**  
  `GET http://localhost:8080/api/v1/traffic/metrics`

---

## 📁 Backend Directory Structure

```
d:/ECDAT/backend/
├── pom.xml                               # Maven Configuration
├── README.md                             # Setup & Execution Guide
└── src/
    └── main/
        ├── java/in/gov/ntro/ecdat/
        │   ├── EcdatBackendApplication.java  # Main Entrypoint
        │   ├── config/
        │   │   └── CorsConfig.java           # Cross-Origin (CORS) Filter
        │   ├── controller/
        │   │   ├── CryptoAssetController.java# CBOM & Mosca Endpoints
        │   │   ├── ScanController.java       # AST Scanner Endpoints
        │   │   └── TrafficController.java    # Ingress Telemetry Endpoints
        │   ├── entity/
        │   │   ├── CryptoAssetEntity.java    # JPA Entity for CBOM Assets
        │   │   ├── ScanRecordEntity.java     # JPA Entity for Scan History
        │   │   └── IngressLogEntity.java     # JPA Entity for Handshakes
        │   ├── repository/
        │   │   ├── CryptoAssetRepository.java
        │   │   ├── ScanRecordRepository.java
        │   │   └── IngressLogRepository.java
        │   └── service/
        │       ├── CryptoAssetService.java   # Business Logic & CBOM Generator
        │       ├── ScanService.java          # Scan Engine
        │       └── TrafficService.java       # Ingress & Rate Limiter Service
        └── resources/
            ├── application.properties        # MySQL & Server Configuration
            └── schema.sql                    # MySQL Workbench DDL & Seed Data
```
