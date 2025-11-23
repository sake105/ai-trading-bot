
import React, { useState } from 'react';
import { Signal, Instrument } from '../types/domain';
import { ArrowUpRight, ArrowDownRight, Minus, Newspaper, ChevronDown, ChevronUp, Activity, TrendingUp, BarChart2, Zap, LayoutGrid, List, LineChart, Brain } from 'lucide-react';
import CandleChart from './CandleChart';
import MarketHeatmap from './MarketHeatmap';

interface SignalsProps {
  signals: Signal[];
  news?: any[]; // Keep loose
}

type Tab = 'CHART' | 'TECHNICALS' | 'ANALYSIS' | 'NEWS';

const Signals: React.FC<SignalsProps> = ({ signals, news = [] }) => {
  const [expandedTicker, setExpandedTicker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('CHART');
  const [viewMode, setViewMode] = useState<'TABLE' | 'HEATMAP'>('TABLE');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleDetails = (ticker: string) => {
    if (expandedTicker === ticker) setExpandedTicker(null);
    else {
        setExpandedTicker(ticker);
        setActiveTab('CHART'); // Reset to chart on open
    }
  };

  const filteredSignals = signals.filter(s => 
    s.instrument.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.instrument.sector || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRegimeBadge = (regime?: string) => {
      if (regime === 'RISK_ON') return <span className="text-[10px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">RISK ON</span>;
      if (regime === 'RISK_OFF') return <span className="text-[10px] bg-rose-900/40 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">RISK OFF</span>;
      return <span className="text-[10px] bg-amber-900/40 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">NEUTRAL</span>;
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
             Market Watch
             <span className="text-xs font-normal text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{signals.length} Assets</span>
           </h2>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <input 
                type="text" 
                placeholder="Search ticker..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
            />

            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button 
                    onClick={() => setViewMode('TABLE')}
                    className={`p-1.5 rounded ${viewMode === 'TABLE' ? 'bg-slate-800 text-indigo-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <List className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setViewMode('HEATMAP')}
                    className={`p-1.5 rounded ${viewMode === 'HEATMAP' ? 'bg-slate-800 text-indigo-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
      
      {/* HEATMAP VIEW (Requires Type Adapter) */}
      {viewMode === 'HEATMAP' && (
          <div className="p-4">
              <MarketHeatmap signals={filteredSignals as any} /> 
          </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'TABLE' && (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">Ticker</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Regime</th>
              <th className="px-6 py-4">Trend / RSI</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4">Signal</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredSignals.map((signal) => {
              const isExpanded = expandedTicker === signal.instrument.id;
              return (
                <React.Fragment key={signal.instrument.id}>
                  <tr 
                    onClick={() => toggleDetails(signal.instrument.id)}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-800/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${signal.instrument.sector === 'Index' ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-800 text-slate-300'}`}>
                          {signal.instrument.id.substring(0, 3)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{signal.instrument.id}</div>
                          <div className="text-xs text-slate-500">{signal.instrument.sector}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-mono">${(signal.entryPrice ?? 0).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        {getRegimeBadge(signal.regime)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${signal.trendScore > 70 ? 'bg-emerald-500' : signal.trendScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                              style={{ width: `${signal.trendScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-mono text-slate-400">T:{signal.trendScore}</span>
                        </div>
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${signal.rsi > 70 ? 'bg-rose-500/20 text-rose-400' : signal.rsi < 30 ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'}`}>
                            RSI: {(signal.rsi ?? 0).toFixed(0)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold ${
                             signal.compositeScore >= 80 ? 'border-emerald-500 text-emerald-400' :
                             signal.compositeScore >= 50 ? 'border-amber-500 text-amber-400' :
                             'border-rose-500 text-rose-400'
                          }`}>
                             {signal.compositeScore}
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${signal.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          signal.direction === 'SHORT' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {signal.direction === 'LONG' && <ArrowUpRight className="w-3 h-3" />}
                        {signal.direction === 'SHORT' && <ArrowDownRight className="w-3 h-3" />}
                        {signal.direction === 'HOLD' && <Minus className="w-3 h-3" />}
                        {signal.direction}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       {isExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                    </td>
                  </tr>
                  
                  {/* DEEP DIVE EXPANSION */}
                  {isExpanded && (
                    <tr className="bg-slate-950 border-b border-slate-800">
                      <td colSpan={8} className="p-0">
                        <div className="flex border-b border-slate-800">
                            <button onClick={() => setActiveTab('CHART')} className={`px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'CHART' ? 'border-indigo-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                                <LineChart className="w-4 h-4" /> Chart
                            </button>
                            <button onClick={() => setActiveTab('TECHNICALS')} className={`px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'TECHNICALS' ? 'border-indigo-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                                <Activity className="w-4 h-4" /> Technicals
                            </button>
                            <button onClick={() => setActiveTab('ANALYSIS')} className={`px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'ANALYSIS' ? 'border-indigo-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                                <Brain className="w-4 h-4" /> Analysis
                            </button>
                            <button onClick={() => setActiveTab('NEWS')} className={`px-6 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'NEWS' ? 'border-indigo-500 text-white bg-slate-900' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                                <Newspaper className="w-4 h-4" /> News
                            </button>
                        </div>

                        <div className="p-6 bg-slate-900/50 min-h-[300px]">
                            
                            {activeTab === 'CHART' && (
                                <CandleChart signal={signal as any} /> // Adapter
                            )}

                            {/* Simple Technicals Display for now */}
                            {activeTab === 'TECHNICALS' && (
                                <div className="grid grid-cols-4 gap-4">
                                    <div>Trend Score: {signal.trendScore}</div>
                                    <div>RSI: {signal.rsi}</div>
                                    <div>Vol: {(signal.volume/1000).toFixed(0)}k</div>
                                </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default Signals;
