import React, { useState, useRef, useEffect } from 'react';
import { useCrypto } from '../../context/CryptoContext';
import { 
  Bot, 
  X, 
  Send, 
  ShieldAlert, 
  GitFork, 
  Layers, 
  Key,
  Network
} from 'lucide-react';
import { RiskBadge } from '../common/Badge';

export const AICopilotPanel: React.FC = () => {
  const { 
    isCopilotOpen, 
    setIsCopilotOpen, 
    copilotMessages, 
    sendMessageToCopilot, 
    triggerCannedPrompt,
    selectedAsset,
    assets,
    setSelectedAssetId,
    navigateToAssetInGraph
  } = useCrypto();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCopilotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, isCopilotOpen]);

  if (!isCopilotOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessageToCopilot(inputVal);
    setInputVal('');
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[#D3D3D3]/95 backdrop-blur-2xl border-l border-slate-300 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 bg-white/60 border-b border-slate-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 border border-purple-300 flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold text-slate-950">
                AI Cryptographic Assistant
              </h2>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Grounded on actual code data
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 glass-pill hover:bg-white transition-colors cursor-pointer"
          title="Close Copilot"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Key Context Banner */}
      <div className="px-4 py-3 bg-white/40 border-b border-slate-300 shrink-0">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-700 flex items-center gap-1.5 font-bold">
            <Key className="w-3.5 h-3.5 text-sky-700" />
            Inspecting Key:
          </span>
          <RiskBadge level={selectedAsset.riskLevel} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <select
            value={selectedAsset.id}
            onChange={(e) => setSelectedAssetId(e.target.value)}
            className="glass-card rounded-xl px-3 py-1.5 text-xs text-slate-950 font-extrabold w-full outline-none cursor-pointer"
          >
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.algorithm})
              </option>
            ))}
          </select>

          <button
            onClick={() => navigateToAssetInGraph(selectedAsset.id)}
            className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 border border-sky-300 text-sky-800 shrink-0 text-xs cursor-pointer shadow-sm"
            title="Focus in Graph"
          >
            <Network className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canned Prompts Bar */}
      <div className="p-3 bg-white/30 border-b border-slate-300 space-y-1.5 shrink-0">
        <span className="text-[11px] uppercase tracking-wider text-slate-600 font-extrabold block">
          Click for instant answers:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => triggerCannedPrompt('WHY_RISKY')}
            className="px-3 py-1.5 rounded-xl bg-rose-100/90 hover:bg-rose-200 border border-rose-300 text-rose-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>Why is this risky?</span>
          </button>

          <button
            onClick={() => triggerCannedPrompt('WHAT_MIGRATE')}
            className="px-3 py-1.5 rounded-xl bg-emerald-100/90 hover:bg-emerald-200 border border-emerald-300 text-emerald-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5 text-emerald-700" />
            <span>What should I migrate first?</span>
          </button>

          <button
            onClick={() => triggerCannedPrompt('EXPLAIN_CBOM')}
            className="px-3 py-1.5 rounded-xl bg-blue-100/90 hover:bg-blue-200 border border-blue-300 text-blue-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>Explain this key.</span>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs select-text">
        {copilotMessages.map((msg) => {
          const isUser = msg.sender === 'USER';

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 border border-purple-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-4 leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-sky-600 text-white font-bold'
                    : 'glass-panel text-slate-900 border-slate-300 font-medium'
                }`}
              >
                <div className="space-y-1.5 whitespace-pre-wrap font-sans text-xs">
                  {msg.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={lIdx} className="font-extrabold text-sm text-sky-950 pt-1">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('- **')) {
                      return <li key={lIdx} className="list-disc ml-4 text-slate-900 font-semibold">{line.replace('- ', '')}</li>;
                    }
                    return <p key={lIdx}>{line}</p>;
                  })}
                </div>

                <div className={`mt-2 text-[10px] text-right ${isUser ? 'text-sky-100' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3 bg-white/70 border-t border-slate-300 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Ask about ${selectedAsset.name} or code fix...`}
            className="w-full glass-input rounded-2xl pl-4 pr-12 py-3 text-xs text-slate-950 font-medium placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 p-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700 transition-colors cursor-pointer shadow-sm"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </aside>
  );
};
