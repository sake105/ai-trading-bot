import React, { useState, useEffect } from 'react';
import { INITIAL_CONFIG, INITIAL_STATUS, MOCK_TICKERS } from './constants';
import { AssembledConfig, SystemStatus, AssetSignal, BacktestMetric, MarketRegime, NewsItem, InsiderTrade, ShippingRoute } from './types';
import Dashboard from './components/Dashboard';
import Signals from './components/Signals';
import Backtest from './components/Backtest';
import Settings from './components/Settings';
import Intelligence from './components/Intelligence';
import { LayoutDashboard, LineChart, Radio, Sliders, BrainCircuit, AlertTriangle, Newspaper } from 'lucide-react';
import { analyzeMarketContext } from './services/geminiService';

// Mock Data Generator
const generateMockData = (config: AssembledConfig) => {
  
  // 1. Generate Intelligence First (News drives the market)
  const newsItems: NewsItem[] = [
    { 
      id: '1', 
      source: 'Telegram', 
      relatedTicker: 'NVDA',
      author: 'Andreas Grassl', 
      title: 'Momentum shift detected in Semis. Watch NVDA levels 800.', 
      summary: 'Order flow indicates strong institutional buying pressure above 800. Volume confirmation pending.', 
      sentiment: 'POSITIVE', 
      impactScore: 7,
      timestamp: new Date().toISOString() 
    },
    { 
      id: '2', 
      source: 'Reuters', 
      relatedTicker: 'SPY',
      title: 'Fed Chair Powell hints at rate pause as inflation cools', 
      summary: 'Exclusive: Central bank officials see clear path to 2% inflation target, sparking rally across major indices.', 
      sentiment: 'POSITIVE', 
      impactScore: 9,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() 
    },
    { 
      id: '3', 
      source: 'Insider', 
      relatedTicker: 'MSFT',
      author: 'Cong. Pelosi', 
      title: 'New disclosure: Purchase of call options in Tech Sector', 
      summary: 'Filing reveals significant purchase of IT call options dated for next quarter.', 
      sentiment: 'POSITIVE', 
      impactScore: 6,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() 
    },
    { 
      id: '4', 
      source: 'Bloomberg',
      relatedTicker: 'ZIM',
      title: 'Red Sea transit disruptions increase shipping costs by 15%', 
      summary: 'Container rates surge as vessels reroute around Africa. Energy and Industrial sectors impacted. Positive for Shipping stocks, negative for Retail.', 
      sentiment: 'POSITIVE', // Positive for ZIM stock
      impactScore: 8,
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString() 
    },
    {
      id: '5',
      source: 'WSJ',
      relatedTicker: 'AAPL',
      title: 'Supply chain delays reported in Asian assembly plants',
      summary: 'New report suggests iPhone shipments may be delayed by 2 weeks due to component shortages.',
      sentiment: 'NEGATIVE',
      impactScore: 8,
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString()
    }
  ];

  // 2. Calculate Sentiment Map per Ticker
  const sentimentMap: Record<string, number> = {};
  newsItems.forEach(item => {
    if (item.relatedTicker) {
      const direction = item.sentiment === 'POSITIVE' ? 1 : -1;
      // High credibility sources (Reuters/Bloomberg) have higher weight
      sentimentMap[item.relatedTicker] = (sentimentMap[item.relatedTicker] || 0) + (direction * item.impactScore);
    }
  });

  // 3. Generate Signals influenced by Sentiment Map
  const signals: AssetSignal[] = MOCK_TICKERS.map(t => {
    // Base technical score (randomized)
    let trendScore = Math.floor(Math.random() * 60) + 20; // Base 20-80
    
    // Apply News Impact
    const newsImpact = sentimentMap[t.ticker] || 0;
    trendScore = Math.min(100, Math.max(0, trendScore + (newsImpact * 2.5))); // News shifts trend score

    // ML Confidence is boosted by strong news confirmation
    let mlConf = Math.random() * 0.5 + 0.3; // Base 0.3 - 0.8
    if (Math.abs(newsImpact) > 5) {
      mlConf += 0.15; // Higher confidence if news aligns
    }
    mlConf = Math.min(0.99, mlConf);

    // Determine Signal
    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (trendScore > 75 && mlConf > 0.65) signal = 'BUY';
    else if (trendScore < 30) signal = 'SELL';

    return {
      ticker: t.ticker,
      name: t.name,
      sector: t.sector,
      price: Math.random() * 400 + 50,
      trendScore: Math.floor(trendScore),
      mlConfidence: mlConf,
      volatility: config.volTarget * (0.8 + Math.random() * 0.4),
      signal,
      atr: 2.5,
      // New Indicators
      volume: Math.floor(Math.random() * 10000000) + 500000,
      volumeAvg: Math.floor(Math.random() * 8000000) + 500000,
      rsi: Math.floor(Math.random() * 70) + 15 + (newsImpact * 2), // News affects RSI
      macd: (Math.random() - 0.5) * 5 + (newsImpact * 0.2), // News affects Momentum
      insiderActivity: Math.floor(Math.random() * 20) - 10,
      newsSentimentImpact: newsImpact, // Store the impact for visualization
      logisticsRisk: Math.floor(Math.random() * 100),
    };
  });

  // Generate Backtest Data
  const backtest: BacktestMetric[] = [];
  let equity = 100000;
  let benchmark = 100000;
  const days = 365;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dailyVol = config.volTarget / 16;
    const marketReturn = (Math.random() - 0.48) * 0.015;
    const strategyReturn = marketReturn * config.kellyScale + (Math.random() - 0.5) * 0.005;
    
    equity = equity * (1 + strategyReturn);
    benchmark = benchmark * (1 + marketReturn);
    
    backtest.push({
      date: date.toISOString(),
      equity,
      benchmark,
      drawdown: (equity - 100000) / 100000 < 0 ? (equity - 100000) / 100000 : 0,
      regime: Math.random() > 0.8 ? MarketRegime.RISK_OFF : MarketRegime.RISK_ON
    });
  }

  // Generate Insider Trades
  const insiderTrades: InsiderTrade[] = [
    { id: 't1', ticker: 'NVDA', person: 'Mark Zuckerberg', role: 'CEO (Meta)', type: 'BUY', amount: 15000000, date: '2025-10-12' },
    { id: 't2', ticker: 'XOM', person: 'Senator Tuberville', role: 'U.S. Senate', type: 'BUY', amount: 250000, date: '2025-10-10' },
    { id: 't3', ticker: 'TSLA', person: 'Elon Musk', role: 'CEO', type: 'SELL', amount: 45000000, date: '2025-10-08' }
  ];

  // Generate Shipping Routes
  const shippingRoutes: ShippingRoute[] = [
    { id: 'r1', name: 'Shanghai -> Rotterdam', status: 'Blocked', costIndex: 145, trend: 'UP' },
    { id: 'r2', name: 'Panama Canal', status: 'Congested', costIndex: 120, trend: 'UP' },
    { id: 'r3', name: 'Trans-Pacific (LA/LB)', status: 'Normal', costIndex: 98, trend: 'FLAT' }
  ];

  return { signals, backtest, newsItems, insiderTrades, shippingRoutes };
};

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'signals' | 'intelligence' | 'backtest' | 'settings'>('dashboard');
  const [config, setConfig] = useState<AssembledConfig>(INITIAL_CONFIG);
  const [status, setStatus] = useState<SystemStatus>(INITIAL_STATUS);
  const [signals, setSignals] = useState<AssetSignal[]>([]);
  const [backtestData, setBacktestData] = useState<BacktestMetric[]>([]);
  
  // Intelligence Data State
  const [news, setNews] = useState<NewsItem[]>([]);
  const [insiders, setInsiders] = useState<InsiderTrade[]>([]);
  const [shipping, setShipping] = useState<ShippingRoute[]>([]);
  
  // AI Analyst State
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initial Load
  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSimulation = () => {
    const data = generateMockData(config);
    setSignals(data.signals);
    setBacktestData(data.backtest);
    setNews(data.newsItems);
    setInsiders(data.insiderTrades);
    setShipping(data.shippingRoutes);
    
    // Update status slightly to show "live" feeling
    setStatus(prev => ({
      ...prev,
      lastUpdated: new Date().toISOString(),
      vix: 15 + Math.random() * 10,
      dailyPnl: (Math.random() - 0.4) * 5000
    }));
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    // Pass new data sources to AI
    const analysis = await analyzeMarketContext(config.apiKey || '', status, signals, news, shipping);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10 transition-all">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
           <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="font-bold text-slate-900 text-xl">A</span>
           </div>
           <span className="font-bold text-lg hidden lg:block tracking-tight">ASSEMBLED AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="hidden lg:block">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('signals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'signals' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Radio className="w-5 h-5" />
            <span className="hidden lg:block">Market & Signals</span>
          </button>
          <button 
            onClick={() => setActiveTab('intelligence')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'intelligence' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Newspaper className="w-5 h-5" />
            <span className="hidden lg:block">Intelligence</span>
          </button>
          <button 
            onClick={() => setActiveTab('backtest')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'backtest' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LineChart className="w-5 h-5" />
            <span className="hidden lg:block">Performance</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Sliders className="w-5 h-5" />
            <span className="hidden lg:block">Configuration</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-3">
             <p className="text-xs text-slate-500 uppercase mb-1">System Status</p>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono text-emerald-400">ONLINE</span>
             </div>
             <p className="text-[10px] text-slate-600 mt-1">{status.lastUpdated.split('T')[1].split('.')[0]} UTC</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
           <div>
             <h1 className="text-2xl font-bold text-white capitalize">{activeTab}</h1>
             <p className="text-slate-500 text-sm">Project v32 Technical Blueprint</p>
           </div>
           
           {/* Gemini AI Analyst Quick Action */}
           {activeTab === 'dashboard' && (
             <button 
                onClick={handleAiAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-500/20"
             >
                <BrainCircuit className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                {isAnalyzing ? 'Analyzing...' : 'Ask AI Analyst'}
             </button>
           )}
        </header>

        {/* AI Analyst Result Area */}
        {aiAnalysis && activeTab === 'dashboard' && (
          <div className="mb-8 bg-slate-900 border border-indigo-500/30 rounded-xl p-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
             <h3 className="text-indigo-400 font-semibold mb-2 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> Gemini 2.5 Analysis
             </h3>
             <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
             <button onClick={() => setAiAnalysis("")} className="absolute top-4 right-4 text-slate-600 hover:text-slate-400">
                ×
             </button>
           </div>
        )}
        
        {!config.apiKey && activeTab === 'dashboard' && !aiAnalysis && (
           <div className="mb-8 bg-amber-900/20 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                 <h4 className="text-amber-500 font-medium text-sm">AI Features Limited</h4>
                 <p className="text-amber-200/60 text-xs mt-1">Add your Gemini API key in the Configuration tab to enable the AI Analyst features.</p>
              </div>
           </div>
        )}

        <div className="fade-in">
          {activeTab === 'dashboard' && <Dashboard status={status} />}
          {activeTab === 'signals' && <Signals signals={signals} />}
          {activeTab === 'intelligence' && <Intelligence news={news} insiderTrades={insiders} shippingRoutes={shipping} />}
          {activeTab === 'backtest' && <Backtest data={backtestData} />}
          {activeTab === 'settings' && (
            <Settings 
                config={config} 
                setConfig={setConfig} 
                runSimulation={runSimulation}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;