import React from 'react';
import { CryptoProvider, useCrypto } from './context/CryptoContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginScreen } from './components/auth/LoginScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { NewScanScreen } from './components/scan/NewScanScreen';
import { CryptoAssetsTable } from './components/assets/CryptoAssetsTable';
import { QuantumRiskView } from './components/risk/QuantumRiskView';
import { ImpactGraph } from './components/graph/ImpactGraph';
import { MigrationRoadmap } from './components/migration/MigrationRoadmap';
import { ReportScreen } from './components/reports/ReportScreen';
import { AICopilotPanel } from './components/copilot/AICopilotPanel';
import { DemoTourOverlay } from './components/demo/DemoTourOverlay';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { isAuthenticated, activeView } = useCrypto();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#D3D3D3] text-slate-800 flex flex-col font-sans relative overflow-hidden">
      
      {/* Smooth Ambient Pastel Aurora Spheres for Glass Refraction (No Grid) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="aurora-blob-1 top-0 left-0" />
        <div className="aurora-blob-2 -top-20 right-10" />
        <div className="aurora-blob-3 bottom-10 right-20" />
        <div className="aurora-blob-4 -bottom-20 left-1/4" />
      </div>

      {/* Glass Top Navbar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main Glass Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Frosted Glass Sidebar */}
        <Sidebar />

        {/* Dynamic Center View Stage */}
        <main className="flex-1 overflow-y-auto relative p-3 sm:p-5">
          <div className="max-w-7xl mx-auto">
            {activeView === 'DASHBOARD' && <Dashboard />}
            {activeView === 'SCAN' && <NewScanScreen />}
            {activeView === 'ASSETS' && <CryptoAssetsTable />}
            {activeView === 'QUANTUM_RISK' && <QuantumRiskView />}
            {activeView === 'IMPACT_GRAPH' && <ImpactGraph />}
            {activeView === 'MIGRATION' && <MigrationRoadmap />}
            {activeView === 'REPORTS' && <ReportScreen />}
          </div>
        </main>

        {/* Right Frosted AI Copilot Drawer */}
        <AICopilotPanel />
      </div>

      {/* Floating Frosted Demo Mode Guided Overlay */}
      <DemoTourOverlay />

      {/* Global Notification Toast */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <CryptoProvider>
      <AppContent />
    </CryptoProvider>
  );
}
