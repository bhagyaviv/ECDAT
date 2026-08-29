import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCrypto } from '../../context/CryptoContext';
import { 
  PrimitiveNode, 
  ServiceNode, 
  ApplicationNode, 
  DataAssetNode
} from './CustomNodes';
import { RiskBadge } from '../common/Badge';
import { 
  Network, 
  ShieldAlert, 
  Bot, 
  GitFork, 
  ArrowRight
} from 'lucide-react';

const nodeTypes = {
  primitiveNode: PrimitiveNode,
  serviceNode: ServiceNode,
  applicationNode: ApplicationNode,
  dataNode: DataAssetNode,
};

export const ImpactGraph: React.FC = () => {
  const { 
    assets, 
    selectedAssetId, 
    setSelectedAssetId, 
    triggerCannedPrompt, 
    setActiveView 
  } = useCrypto();

  const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];
  const [activeNodeId, setActiveNodeId] = useState<string>(`prim-${selectedAsset.id}`);

  useEffect(() => {
    setActiveNodeId(`prim-${selectedAssetId}`);
  }, [selectedAssetId]);

  const { initialNodes, initialEdges, edgeMap, reverseEdgeMap, nodeAssetMap } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const outgoingMap: Record<string, string[]> = {};
    const incomingMap: Record<string, string[]> = {};
    const assetMapping: Record<string, string> = {};

    const addEdge = (source: string, target: string, edgeId: string) => {
      edges.push({
        id: edgeId,
        source,
        target,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#64748b', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#64748b',
          width: 14,
          height: 14,
        },
      });

      if (!outgoingMap[source]) outgoingMap[source] = [];
      outgoingMap[source].push(target);

      if (!incomingMap[target]) incomingMap[target] = [];
      incomingMap[target].push(source);
    };

    assets.forEach((asset, idx) => {
      const yPos = 40 + idx * 130;
      
      const primId = `prim-${asset.id}`;
      const svcId = `svc-${asset.dependencies.serviceId}`;
      const appId = `app-${asset.id}`;
      const dataId = `data-${asset.id}`;

      assetMapping[primId] = asset.id;
      assetMapping[svcId] = asset.id;
      assetMapping[appId] = asset.id;
      assetMapping[dataId] = asset.id;

      // 1. Primitive Node
      nodes.push({
        id: primId,
        type: 'primitiveNode',
        position: { x: 40, y: yPos },
        data: {
          label: `${asset.algorithm} (${asset.keySize})`,
          sublabel: asset.location,
          type: 'PRIMITIVE',
          riskLevel: asset.riskLevel,
          category: asset.category,
          isViolating: asset.mosca.isViolating,
          nodeDetails: asset,
        },
      });

      // 2. Service Node
      nodes.push({
        id: svcId,
        type: 'serviceNode',
        position: { x: 340, y: yPos },
        data: {
          label: asset.dependencies.serviceName,
          sublabel: `Tier: ${asset.dependencies.businessCriticality}`,
          type: 'SERVICE',
          nodeDetails: asset.dependencies,
        },
      });

      // 3. Application Node
      nodes.push({
        id: appId,
        type: 'applicationNode',
        position: { x: 640, y: yPos },
        data: {
          label: asset.dependencies.applications[0] || 'Enterprise App',
          sublabel: `${asset.dependencies.applications.length} Connected Apps`,
          type: 'APPLICATION',
          nodeDetails: asset.dependencies.applications,
        },
      });

      // 4. Sensitive Data Node
      nodes.push({
        id: dataId,
        type: 'dataNode',
        position: { x: 940, y: yPos },
        data: {
          label: asset.dependencies.sensitiveDataTypes[0] || 'Sensitive Data Asset',
          sublabel: asset.dependencies.dataClassification,
          type: 'DATA',
          nodeDetails: asset.dependencies.sensitiveDataTypes,
        },
      });

      addEdge(primId, svcId, `e-${primId}-${svcId}`);
      addEdge(svcId, appId, `e-${svcId}-${appId}`);
      addEdge(appId, dataId, `e-${appId}-${dataId}`);
    });

    return {
      initialNodes: nodes,
      initialEdges: edges,
      edgeMap: outgoingMap,
      reverseEdgeMap: incomingMap,
      nodeAssetMap: assetMapping,
    };
  }, [assets]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const getConnectedNodeIds = useCallback((startId: string): Set<string> => {
    const connected = new Set<string>([startId]);

    const queue = [startId];
    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = edgeMap[current] || [];
      for (const n of neighbors) {
        if (!connected.has(n)) {
          connected.add(n);
          queue.push(n);
        }
      }
    }

    const upQueue = [startId];
    while (upQueue.length > 0) {
      const current = upQueue.shift()!;
      const parents = reverseEdgeMap[current] || [];
      for (const p of parents) {
        if (!connected.has(p)) {
          connected.add(p);
          upQueue.push(p);
        }
      }
    }

    return connected;
  }, [edgeMap, reverseEdgeMap]);

  useEffect(() => {
    if (!activeNodeId) return;

    const connectedIds = getConnectedNodeIds(activeNodeId);

    setNodes((nds) =>
      nds.map((node) => {
        const isHighlighted = connectedIds.has(node.id);
        const isDimmed = !isHighlighted;
        return {
          ...node,
          data: {
            ...node.data,
            isHighlighted,
            isDimmed,
          },
        };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        const isConnectedEdge = connectedIds.has(edge.source) && connectedIds.has(edge.target);
        return {
          ...edge,
          animated: isConnectedEdge,
          style: {
            stroke: isConnectedEdge ? '#0284c7' : '#94a3b8',
            strokeWidth: isConnectedEdge ? 3.5 : 1.5,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isConnectedEdge ? '#0284c7' : '#94a3b8',
            width: 16,
            height: 16,
          },
        };
      })
    );
  }, [activeNodeId, getConnectedNodeIds, setNodes, setEdges]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    setActiveNodeId(node.id);
    const relatedAssetId = nodeAssetMap[node.id];
    if (relatedAssetId) {
      setSelectedAssetId(relatedAssetId);
    }
  };

  return (
    <div className="space-y-5 flex flex-col h-[calc(100vh-100px)]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Cryptographic Impact Map (Signature Feature ⭐)
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs bg-sky-100 text-sky-900 font-bold border border-sky-300">
              Interactive #D3D3D3 Glass Canvas
            </span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-1">
            Click on any key on the left to see the chain of what gets compromised on the right.
          </p>
        </div>

        {/* 4-Step Legend */}
        <div className="hidden lg:flex items-center gap-2 text-xs glass-pill rounded-2xl px-4 py-2 text-slate-800 shadow-sm font-semibold">
          <span className="text-sky-700 font-bold">1. Key</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="text-blue-700 font-bold">2. Service</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="text-purple-700 font-bold">3. App</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="text-rose-700 font-bold">4. Data Stolen</span>
        </div>
      </div>

      {/* Main Canvas + Glass Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-[480px]">
        
        {/* React Flow Glass Canvas */}
        <div className="lg:col-span-8 glass-panel rounded-3xl overflow-hidden relative shadow-sm flex flex-col">
          
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 glass-pill rounded-2xl px-3.5 py-1.5 text-xs text-slate-800 shadow-sm font-semibold">
            <Network className="w-3.5 h-3.5 text-sky-700" />
            <span>Currently Viewing: <strong className="text-slate-950">{selectedAsset.name}</strong></span>
          </div>

          <div className="w-full h-full min-h-[450px] flex-1">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={handleNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.12 }}
              minZoom={0.3}
              maxZoom={1.5}
            >
              <Background color="#94a3b8" gap={24} size={1} />
              <Controls />
              <MiniMap
                nodeColor={(n) => {
                  if (n.data?.isHighlighted) return '#0284c7';
                  if (n.data?.riskLevel === 'CRITICAL') return '#e11d48';
                  if (n.data?.riskLevel === 'HIGH') return '#ea580c';
                  return '#64748b';
                }}
                maskColor="rgba(211, 211, 211, 0.85)"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #94a3b8',
                  borderRadius: '12px',
                }}
              />
            </ReactFlow>
          </div>
        </div>

        {/* Glassmorphic Blast Radius Inspector */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between overflow-y-auto">
          
          <div className="space-y-4">
            
            {/* Header */}
            <div className="border-b border-slate-300/80 pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                  Impact Diagnosis
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedAsset.name}
                </h2>
              </div>
              <RiskBadge level={selectedAsset.riskLevel} />
            </div>

            {/* What Breaks Card */}
            <div className="p-4 rounded-2xl glass-card space-y-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>What breaks if this key is cracked?</span>
              </span>

              <div className="space-y-2 text-xs text-slate-700 pt-1 font-medium">
                <div>
                  <span className="text-slate-600 block text-[11px]">1. Service that breaks:</span>
                  <strong className="text-sky-800 font-bold">{selectedAsset.dependencies.serviceName}</strong>
                </div>

                <div>
                  <span className="text-slate-600 block text-[11px]">2. Customer apps affected:</span>
                  <strong className="text-purple-800 font-bold">{selectedAsset.dependencies.applications.join(', ')}</strong>
                </div>

                <div>
                  <span className="text-slate-600 block text-[11px]">3. Sensitive data leaked:</span>
                  <strong className="text-rose-800 font-bold">{selectedAsset.dependencies.sensitiveDataTypes.join(', ')}</strong>
                </div>

                <div className="pt-2 border-t border-slate-300/80 text-slate-600 font-semibold">
                  Estimated Financial Risk: <strong className="text-orange-700 font-bold">{selectedAsset.dependencies.annualRiskExposureUSD}</strong>
                </div>
              </div>
            </div>

            {/* The Fix Box */}
            <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-300 space-y-1 text-xs">
              <div className="flex items-center justify-between text-emerald-900 font-bold">
                <span>The Fix (NIST Post-Quantum Standard):</span>
              </div>
              <p className="font-extrabold text-slate-950 mt-1">
                {selectedAsset.pqcRecommendation.nistStandard}
              </p>
              <p className="text-slate-700 text-[11px] mt-0.5 leading-relaxed font-medium">
                {selectedAsset.pqcRecommendation.recommendedAction}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-300/80 space-y-2">
            <button
              onClick={() => triggerCannedPrompt('WHY_RISKY')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold border border-purple-300 transition-all cursor-pointer"
            >
              <Bot className="w-4 h-4 text-purple-700" />
              <span>Ask AI Copilot to Explain</span>
            </button>

            <button
              onClick={() => setActiveView('MIGRATION')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/25 transition-all cursor-pointer"
            >
              <GitFork className="w-4 h-4" />
              <span>Get Copy-Paste Code Fix</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
