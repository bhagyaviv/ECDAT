import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Key, 
  Server, 
  Globe, 
  Database
} from 'lucide-react';
import { RiskLevel } from '../../types';

export interface CryptoNodeData {
  label: string;
  sublabel: string;
  type: 'PRIMITIVE' | 'SERVICE' | 'APPLICATION' | 'DATA';
  riskLevel?: RiskLevel;
  category?: string;
  isViolating?: boolean;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  nodeDetails?: any;
}

// 1. Primitive Node (Column 1)
export const PrimitiveNode = memo(({ data }: { data: CryptoNodeData }) => {
  const isHigh = data.riskLevel === 'CRITICAL' || data.riskLevel === 'HIGH';
  const isSafe = data.riskLevel === 'LOW';

  return (
    <div className={`px-4 py-3.5 rounded-2xl border transition-all duration-200 min-w-[215px] select-none backdrop-blur-md ${
      data.isHighlighted 
        ? 'ring-2 ring-sky-600 border-sky-600 bg-white shadow-xl scale-105' 
        : data.isDimmed 
        ? 'opacity-40 border-slate-400 bg-slate-200/70'
        : 'border-slate-300 bg-white/95 hover:border-sky-500 shadow-md'
    }`}>
      <Handle type="source" position={Position.Right} className="!bg-sky-600 !w-3 !h-3 !border-2 !border-white" />
      
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-300 text-black">
          1. Encryption Key
        </span>
        
        {isHigh ? (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-200 text-rose-950 border border-rose-400">
            ⚠️ Vulnerable
          </span>
        ) : isSafe ? (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-950 border border-emerald-400">
            ✓ Quantum Safe
          </span>
        ) : (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-400">
            Medium
          </span>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-xl shrink-0 ${
          isHigh ? 'bg-rose-200 text-rose-950 border border-rose-400' : isSafe ? 'bg-emerald-200 text-emerald-950 border border-emerald-400' : 'bg-amber-200 text-amber-950 border border-amber-400'
        }`}>
          <Key className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-black text-black truncate">
            {data.label}
          </div>
          <div className="text-[11px] text-sky-950 truncate font-mono font-black">
            {data.sublabel}
          </div>
        </div>
      </div>
    </div>
  );
});

PrimitiveNode.displayName = 'PrimitiveNode';

// 2. Service Node (Column 2)
export const ServiceNode = memo(({ data }: { data: CryptoNodeData }) => {
  return (
    <div className={`px-4 py-3.5 rounded-2xl border transition-all duration-200 min-w-[205px] select-none backdrop-blur-md ${
      data.isHighlighted 
        ? 'ring-2 ring-blue-600 border-blue-600 bg-white shadow-xl scale-105' 
        : data.isDimmed 
        ? 'opacity-40 border-slate-400 bg-slate-200/70'
        : 'border-slate-300 bg-white/95 hover:border-blue-500 shadow-md'
    }`}>
      <Handle type="target" position={Position.Left} className="!bg-blue-600 !w-3 !h-3 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!bg-blue-600 !w-3 !h-3 !border-2 !border-white" />
      
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-200 text-blue-950">
          2. Backend Service
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-blue-200 text-blue-950 border border-blue-400 shrink-0">
          <Server className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-black text-black truncate">
            {data.label}
          </div>
          <div className="text-[11px] text-slate-800 truncate font-bold">
            {data.sublabel}
          </div>
        </div>
      </div>
    </div>
  );
});

ServiceNode.displayName = 'ServiceNode';

// 3. Application Node (Column 3)
export const ApplicationNode = memo(({ data }: { data: CryptoNodeData }) => {
  return (
    <div className={`px-4 py-3.5 rounded-2xl border transition-all duration-200 min-w-[205px] select-none backdrop-blur-md ${
      data.isHighlighted 
        ? 'ring-2 ring-purple-600 border-purple-600 bg-white shadow-xl scale-105' 
        : data.isDimmed 
        ? 'opacity-40 border-slate-400 bg-slate-200/70'
        : 'border-slate-300 bg-white/95 hover:border-purple-500 shadow-md'
    }`}>
      <Handle type="target" position={Position.Left} className="!bg-purple-600 !w-3 !h-3 !border-2 !border-white" />
      <Handle type="source" position={Position.Right} className="!bg-purple-600 !w-3 !h-3 !border-2 !border-white" />
      
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-200 text-purple-950">
          3. Impacted User App
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-purple-200 text-purple-950 border border-purple-400 shrink-0">
          <Globe className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-black text-black truncate">
            {data.label}
          </div>
          <div className="text-[11px] text-purple-950 font-black truncate">
            {data.sublabel}
          </div>
        </div>
      </div>
    </div>
  );
});

ApplicationNode.displayName = 'ApplicationNode';

// 4. Sensitive Data Node (Column 4)
export const DataAssetNode = memo(({ data }: { data: CryptoNodeData }) => {
  return (
    <div className={`px-4 py-3.5 rounded-2xl border transition-all duration-200 min-w-[215px] select-none backdrop-blur-md ${
      data.isHighlighted 
        ? 'ring-2 ring-rose-600 border-rose-600 bg-white shadow-xl scale-105' 
        : data.isDimmed 
        ? 'opacity-40 border-slate-400 bg-slate-200/70'
        : 'border-slate-300 bg-white/95 hover:border-rose-500 shadow-md'
    }`}>
      <Handle type="target" position={Position.Left} className="!bg-rose-600 !w-3 !h-3 !border-2 !border-white" />
      
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-200 text-rose-950">
          4. Stolen Data Asset
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-rose-200 text-rose-950 border border-rose-400 shrink-0">
          <Database className="w-4 h-4 stroke-[2.5]" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs font-black text-black truncate">
            {data.label}
          </div>
          <div className="text-[11px] text-rose-950 font-black truncate">
            {data.sublabel}
          </div>
        </div>
      </div>
    </div>
  );
});

DataAssetNode.displayName = 'DataAssetNode';
