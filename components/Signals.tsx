
import React, { useState } from 'react';
import { AssetSignal, MarketRegime, NewsItem } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, Newspaper, Users, ChevronDown, ChevronUp, Activity, TrendingUp, BarChart2, Zap, LayoutGrid, List, LineChart, BookOpen, Brain } from 'lucide-react';
import CandleChart from './CandleChart';
import MarketHeatmap from './MarketHeatmap';

interface SignalsProps {
  signals: AssetSignal[];
  news?: NewsItem[]; // Passed down for specific filtering
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
    s.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRegimeBadge = (regime?: MarketRegime) => {
      if (regime === MarketRegime.RISK_ON) return <span className="text-[10px] bg-emerald-900/40 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">RISK ON</span>;
      if (regime === MarketRegime.RISK_OFF) return <span className="text-[10px] bg-rose-900/40 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/20">RISK OFF</span>;
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
            {/* Search */}
            <input 
                type="text" 
                placeholder="Search ticker..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:border-indigo-500 outline-none"
            />

            {/* View Toggle */}
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
      
      {/* HEATMAP VIEW */}
      {viewMode === 'HEATMAP' && (
          <div className="p-4">
              <MarketHeatmap signals={filteredSignals} />
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
              const isExpanded = expandedTicker === signal.ticker;
              return (
                <React.Fragment key={signal.ticker}>
                  <tr 
                    onClick={() => toggleDetails(signal.ticker)}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-800/30' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${signal.sector === 'Index' ? 'bg-indigo-900 text-indigo-200' : 'bg-slate-800 text-slate-300'}`}>
                          {signal.ticker.substring(0, 3)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{signal.ticker}</div>
                          <div className="text-xs text-slate-500">{signal.sector}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-mono">${signal.price.toFixed(2)}</span>
                        <span className={`text-[10px] ${signal.changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {signal.changePercent > 0 ? '+' : ''}{signal.changePercent.toFixed(2)}%
                        </span>
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
                            RSI: {signal.rsi.toFixed(0)}
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
                        ${signal.signal === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          signal.signal === 'SELL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                        {signal.signal === 'BUY' && <ArrowUpRight className="w-3 h-3" />}
                        {signal.signal === 'SELL' && <ArrowDownRight className="w-3 h-3" />}
                        {signal.signal === 'HOLD' && <Minus className="w-3 h-3" />}
                        {signal.signal}
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
                            
                            {/* 1. CHART TAB */}
                            {activeTab === 'CHART' && (
                                <CandleChart signal={signal} />
                            )}

                            {/* 2. TECHNICALS TAB */}
                            {activeTab === 'TECHNICALS' && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* TREND */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                                            <TrendingUp className="w-4 h-4 text-indigo-400" /> Trend
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-400">EMA (20)</span><span className="font-mono">${signal.ema20.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">SMA (50)</span><span className={`font-mono ${signal.price > signal.sma50 ? 'text-emerald-400' : 'text-rose-400'}`}>${signal.sma50.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">SMA (200)</span><span className="font-mono">${signal.sma200.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Ichimoku</span><span className="text-[10px] bg-slate-800 px-2 rounded">{signal.ichimokuStatus}</span></div>
                                        </div>
                                    </div>
                                    {/* MOMENTUM */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                                            <Activity className="w-4 h-4 text-purple-400" /> Momentum
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-400">RSI</span><span className="font-mono">{signal.rsi.toFixed(1)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">MACD</span><span className={`font-mono ${signal.macd > signal.macdSignal ? 'text-emerald-400' : 'text-rose-400'}`}>{signal.macd.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Stoch</span><span className="font-mono">{signal.stochK.toFixed(0)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">CCI</span><span className="font-mono">{signal.cci.toFixed(0)}</span></div>
                                        </div>
                                    </div>
                                    {/* VOLATILITY */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                                            <Zap className="w-4 h-4 text-amber-400" /> Volatility
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-400">ATR</span><span className="font-mono">${signal.atr.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">B-Bands</span><span className="font-mono text-xs">{signal.bollingerLower.toFixed(0)} - {signal.bollingerUpper.toFixed(0)}</span></div>
                                        </div>
                                    </div>
                                    {/* VOLUME */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-800 pb-2">
                                            <BarChart2 className="w-4 h-4 text-blue-400" /> Volume
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between"><span className="text-slate-400">Today</span><span className="font-mono">{(signal.volume/1000000).toFixed(2)}M</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">Avg (30d)</span><span className="font-mono">{(signal.volumeAvg/1000000).toFixed(2)}M</span></div>
                                            <div className="flex justify-between"><span className="text-slate-400">OBV</span><span className="font-mono">{(signal.obv/1000000).toFixed(1)}M</span></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 3. ANALYSIS TAB */}
                            {activeTab === 'ANALYSIS' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-4">Score Attribution</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-24 text-xs text-slate-400">Trend (40%)</span>
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500" style={{width: `${signal.trendScore}%`}}></div>
                                                </div>
                                                <span className="text-xs font-mono">{signal.trendScore}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-24 text-xs text-slate-400">Sentiment (30%)</span>
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500" style={{width: `${(signal.newsSentimentImpact + 10) * 5}%`}}></div>
                                                </div>
                                                <span className="text-xs font-mono">{(signal.newsSentimentImpact + 10) * 5}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="w-24 text-xs text-slate-400">Insider (10%)</span>
                                                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500" style={{width: `${Math.max(0, signal.insiderActivity * 10 + 50)}%`}}></div>
                                                </div>
                                                <span className="text-xs font-mono">{signal.insiderActivity}</span>
                                            </div>
                                        </div>
                                        <div className="mt-6 p-4 bg-slate-950 rounded border border-slate-800">
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                <strong className="text-indigo-400">Summary:</strong> {signal.compositeScore > 60 ? 'Bullish' : 'Bearish'} divergence detected. 
                                                Trend is {signal.trendScore > 50 ? 'strengthening' : 'weakening'} while news sentiment remains {signal.newsSentimentImpact > 0 ? 'positive' : 'negative'}.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center items-center">
                                        <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${
                                            signal.compositeScore >= 80 ? 'border-emerald-500 text-emerald-400' :
                                            signal.compositeScore >= 50 ? 'border-amber-500 text-amber-400' :
                                            'border-rose-500 text-rose-400'
                                        }`}>
                                            <span className="text-4xl font-bold">{signal.compositeScore}</span>
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Total Score</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 4. NEWS TAB */}
                            {activeTab === 'NEWS' && (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                    {news.filter(n => n.relatedTicker === signal.ticker || n.summary.includes(signal.ticker)).length > 0 ? (
                                        news.filter(n => n.relatedTicker === signal.ticker || n.summary.includes(signal.ticker)).map(item => (
                                            <div key={item.id} className="p-3 bg-slate-950 border border-slate-800 rounded hover:border-indigo-500/50 transition-colors">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-[10px] text-indigo-400 font-bold">{item.source}</span>
                                                    <span className="text-[10px] text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</span>
                                                </div>
                                                <h5 className="text-sm font-medium text-slate-200">{item.title}</h5>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-600 text-xs">
                                            No specific news items found for {signal.ticker} in the current feed.
                                        </div>
                                    )}
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
