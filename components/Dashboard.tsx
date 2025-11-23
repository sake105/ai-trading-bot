import React, { useState } from 'react';
import { Activity, ShieldAlert, DollarSign, BarChart3, Zap, ArrowUp, ArrowDown, BrainCircuit, Send } from 'lucide-react';
import { SystemStatus, MarketRegime, AssetSignal, EconomicEvent, NewsItem, RiskMetrics } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import CorrelationMatrix from './CorrelationMatrix';
import EconomicCalendar from './EconomicCalendar';
import RiskGauge from './RiskGauge';
import { askStrategyAgent } from '../services/geminiService';

interface DashboardProps {
  status: SystemStatus;
  signals: AssetSignal[];
  macroEvents: EconomicEvent[];
  news: NewsItem[];
  riskMetrics: RiskMetrics;
}

const Dashboard: React.FC<DashboardProps> = ({ status, signals, macroEvents, news, riskMetrics }) => {
  const [strategyQuery, setStrategyQuery] = useState('');
  const [strategyResponse, setStrategyResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const getRegimeColor = (regime: MarketRegime) => {
    switch (regime) {
      case MarketRegime.RISK_ON: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case MarketRegime.RISK_OFF: return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
  };

  const mockExposureData = [
    { name: 'Equity (Long)', value: 65 },
    { name: 'Hedges (Put)', value: 5 },
    { name: 'Cash', value: 30 },
  ];

  const indices = [
    { name: 'S&P 500', value: '4,785.20', change: '+1.2%', up: true },
    { name: 'NASDAQ', value: '16,420.10', change: '+1.8%', up: true },
    { name: 'DOW JONES', value: '38,150.40', change: '-0.2%', up: false },
    { name: 'RUT 2000', value: '1,980.50', change: '+0.5%', up: true },
  ];

  const handleStrategyQuery = async () => {
    if (!strategyQuery) return;
    setIsThinking(true);
    const response = await askStrategyAgent(strategyQuery, status, signals, news, macroEvents);
    setStrategyResponse(response);
    setIsThinking(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Strategy Command Center (Gemini 3 Pro) */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-xl border border-indigo-500/30 shadow-lg">
         <h3 className="text-white font-bold flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            Deep Strategy Agent (Gemini 3 Pro)
         </h3>
         <div className="flex gap-2">
            <input 
                type="text" 
                value={strategyQuery}
                onChange={(e) => setStrategyQuery(e.target.value)}
                placeholder="Ask complex strategic questions (e.g., 'How should I position for the upcoming CPI print considering Tech correlations?')"
                className="flex-1 bg-slate-950/50 border border-indigo-500/30 rounded-lg px-4 py-2 text-sm text-white placeholder:text-indigo-200/50 focus:ring-indigo-500 focus:border-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleStrategyQuery()}
            />
            <button 
                onClick={handleStrategyQuery}
                disabled={isThinking}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
            >
                {isThinking ? <BrainCircuit className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {isThinking ? 'Thinking...' : 'Strategize'}
            </button>
         </div>
         {strategyResponse && (
             <div className="mt-4 p-4 bg-slate-950/50 rounded-lg border border-indigo-500/20 text-sm text-indigo-100 leading-relaxed whitespace-pre-line animate-in fade-in slide-in-from-top-2">
                 {strategyResponse}
             </div>
         )}
      </div>

      {/* Indices Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {indices.map((idx) => (
          <div key={idx.name} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex flex-col">
             <span className="text-xs text-slate-500 font-bold tracking-wider">{idx.name}</span>
             <div className="flex items-end justify-between mt-1">
                <span className="text-lg font-mono text-white">{idx.value}</span>
                <span className={`text-xs font-bold flex items-center ${idx.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {idx.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                   {idx.change}
                </span>
             </div>
          </div>
        ))}
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${getRegimeColor(status.regime)} transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">Market Regime</p>
              <h3 className="text-2xl font-bold mt-1">{status.regime.replace('_', ' ')}</h3>
            </div>
            <Activity className="h-8 w-8 opacity-50" />
          </div>
          <div className="mt-4 text-xs flex gap-2">
            <span className="bg-slate-900/50 px-2 py-1 rounded">VIX: {status.vix}</span>
            <span className="bg-slate-900/50 px-2 py-1 rounded">Sent: {status.sentimentScore}</span>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-medium uppercase tracking-wider">Daily PnL</p>
            <DollarSign className="h-5 w-5" />
          </div>
          <h3 className={`text-2xl font-bold mt-1 ${status.dailyPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {status.dailyPnl >= 0 ? '+' : ''}{status.dailyPnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </h3>
          <p className="text-xs text-slate-500 mt-2">Realized + Unrealized</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-medium uppercase tracking-wider">Active Positions</p>
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold mt-1 text-white">{status.activePositions}</h3>
          <p className="text-xs text-slate-500 mt-2">Across 4 Sectors</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400">
            <p className="text-xs font-medium uppercase tracking-wider">VolTarget Usage</p>
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-2xl font-bold mt-1 text-blue-400">9.2% <span className="text-sm text-slate-500">/ 12%</span></h3>
          <p className="text-xs text-slate-500 mt-2">Risk Budget Utilization</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-indigo-400" />
            Portfolio Exposure Breakdown
          </h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart layout="vertical" data={mockExposureData}>
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                  cursor={{ fill: '#334155', opacity: 0.2 }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {mockExposureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#34d399' : index === 1 ? '#f43f5e' : '#64748b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RISK GAUGE */}
        <div className="lg:col-span-1 h-[350px]">
           <RiskGauge metrics={riskMetrics} />
        </div>
      </div>

      {/* Charts Row 2 (Advanced Tools) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2">
            <CorrelationMatrix signals={signals} />
         </div>
         <div className="lg:col-span-1">
            <EconomicCalendar events={macroEvents} />
         </div>
      </div>
    </div>
  );
};

export default Dashboard;