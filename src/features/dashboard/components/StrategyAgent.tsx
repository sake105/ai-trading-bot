
import React, { useState } from 'react';
import { BrainCircuit, Send } from 'lucide-react';
import { askStrategyAgent } from '../../../services/geminiService';
import { BackendApi } from '../../../api/backendApi';

export function StrategyAgent() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [thinking, setThinking] = useState(false);

  const handleQuery = async () => {
    if (!query) return;
    setThinking(true);
    
    try {
        // Fetch current context
        const [status, signals] = await Promise.all([
            BackendApi.getQaStatus(),
            BackendApi.getSignals()
        ]);
        
        // Convert to format expected by service (simplified)
        // In a real app, we'd use the proper domain types in the service too
        const res = await askStrategyAgent(query, status as any, signals as any, [], []);
        setResponse(res);
    } catch (e) {
        setResponse("Strategy Agent unavailable.");
    } finally {
        setThinking(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#171d2b] p-6 rounded-xl border border-[#262b3b] shadow-lg mb-6">
      <h3 className="text-white font-bold flex items-center gap-2 mb-3">
        <BrainCircuit className="w-5 h-5 text-[#7b5cff]" />
        Deep Strategy Agent (Gemini 3 Pro)
      </h3>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask complex strategic questions (e.g., 'How should I position for the upcoming CPI print considering Tech correlations?')"
          className="flex-1 bg-[#050712] border border-[#262b3b] rounded-lg px-4 py-2 text-sm text-white placeholder:text-[#9ba4c4] focus:border-[#7b5cff] outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
        />
        <button 
          onClick={handleQuery}
          disabled={thinking}
          className="bg-[#7b5cff] hover:bg-[#6a4ce0] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
        >
          {thinking ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {thinking ? 'Thinking...' : 'Strategize'}
        </button>
      </div>
      {response && (
        <div className="mt-4 p-4 bg-[#050712] rounded-lg border border-[#262b3b] text-sm text-[#f5f7ff] leading-relaxed whitespace-pre-line">
          {response}
        </div>
      )}
    </div>
  );
}
