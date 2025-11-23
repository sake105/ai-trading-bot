
import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_CONFIG, INITIAL_STATUS, INITIAL_WATCHLIST } from './constants';
import { AssembledConfig, SystemStatus, AssetSignal, BacktestMetric, NewsItem, InsiderTrade, ShippingRoute, TradeExecution, EconomicEvent, RiskMetrics, PortfolioTarget, PipelineStage, PipelineLog, PipelineArtifact } from './types';
import Dashboard from './components/Dashboard';
import Signals from './components/Signals';
import Backtest from './components/Backtest';
import Settings from './components/Settings';
import Intelligence from './components/Intelligence';
import TradeHistory from './components/TradeHistory';
import DiscordBridge from './components/DiscordBridge';
import PortfolioOptimizer from './components/PortfolioOptimizer';
import PipelineMonitor from './components/PipelineMonitor'; 
import { LayoutDashboard, LineChart, Radio, Sliders, Newspaper, History, MessageSquare, Play, Pause, PieChart } from 'lucide-react';
import { generateInitialMarketState, generateDeepBacktestData, RealtimeMarketService } from './services/marketService';
import { checkAutomatedTriggers } from './services/automationService';
import { MathService } from './services/mathService';
import { PipelineService } from './services/pipelineService'; 

function App() {
  // Config State
  const [config, setConfig] = useState<AssembledConfig>({
    ...INITIAL_CONFIG,
    watchlist: INITIAL_WATCHLIST.map(t => t.ticker) // Initialize config with tickers
  });
  
  // UI State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'signals' | 'intelligence' | 'execution' | 'discord' | 'backtest' | 'settings' | 'optimizer'>('dashboard');
  const [isLive, setIsLive] = useState(false);
  
  // Pipeline State
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('IDLE');
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([]);
  const [pipelineArtifacts, setPipelineArtifacts] = useState<PipelineArtifact[]>([]);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);

  // Data State
  const [status, setStatus] = useState<SystemStatus>(INITIAL_STATUS);
  const [signals, setSignals] = useState<AssetSignal[]>([]);
  const [backtestData, setBacktestData] = useState<BacktestMetric[]>([]);
  const [trades, setTrades] = useState<TradeExecution[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [insiders, setInsiders] = useState<InsiderTrade[]>([]);
  const [shipping, setShipping] = useState<ShippingRoute[]>([]);
  const [macroEvents, setMacroEvents] = useState<EconomicEvent[]>([]);
  
  // Quant State
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({ var95: 0, var99: 0, cvar95: 0, sharpeRatio: 0, volatility: 0, beta: 0 });
  const [optTargets, setOptTargets] = useState<PortfolioTarget[]>([]);

  // Services Refs
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const marketServiceRef = useRef<RealtimeMarketService | null>(null);
  
  // Refs for Loop Closure
  const signalsRef = useRef(signals);
  const configRef = useRef(config);
  const tradesRef = useRef(trades);

  useEffect(() => { signalsRef.current = signals; }, [signals]);
  useEffect(() => { configRef.current = config; }, [config]);
  useEffect(() => { tradesRef.current = trades; }, [trades]);

  // Initialization
  useEffect(() => {
    const deepHistory = generateDeepBacktestData(10, config.initialCapital);
    setBacktestData(deepHistory);

    // Generate Initial State using the configured Watchlist (mapped to INITIAL_WATCHLIST data for sectors)
    // NOTE: generateInitialMarketState in marketService needs to be updated to accept a list or use constants. 
    // Since we updated MOCK_TICKERS to INITIAL_WATCHLIST in constants.ts and marketService imports it, 
    // marketService will inherently use the new big list.
    const initialData = generateInitialMarketState();
    
    const enhancedSignals = initialData.signals.map(s => ({
        ...s,
        compositeScore: MathService.calculateCompositeScore(s)
    }));

    setSignals(enhancedSignals);
    setNews(initialData.newsItems);
    setTrades(initialData.trades);
    
    setInsiders([
      { id: 't1', ticker: 'NVDA', person: 'Mark Zuckerberg', role: 'CEO (Meta)', type: 'BUY', amount: 15000000, date: '2025-10-12' },
      { id: 't2', ticker: 'XOM', person: 'Senator Tuberville', role: 'U.S. Senate', type: 'BUY', amount: 250000, date: '2025-10-10' },
    ]);
    setShipping([
        { id: 'r1', name: 'Shanghai -> Rotterdam', status: 'Blocked', costIndex: 145, trend: 'UP' },
        { id: 'r2', name: 'Panama Canal', status: 'Congested', costIndex: 120, trend: 'UP' },
        { id: 'r3', name: 'Trans-Pacific (LA/LB)', status: 'Normal', costIndex: 98, trend: 'FLAT' }
    ]);

    marketServiceRef.current = new RealtimeMarketService();
    marketServiceRef.current.fetchEconomicEvents().then(events => setMacroEvents(events));

    return () => {
      if (marketServiceRef.current) marketServiceRef.current.disconnect();
    };
  }, []);

  // Recalc backtest if capital changes
  useEffect(() => {
     const deepHistory = generateDeepBacktestData(10, config.initialCapital);
     setBacktestData(deepHistory);
     setStatus(prev => ({ ...prev, cashPosition: config.initialCapital * 0.45 }));
  }, [config.initialCapital]);

  // REAL-TIME CALCULATION LOOP
  useEffect(() => {
     if (signals.length > 0) {
        const holdings: Record<string, number> = {}; 
        trades.forEach(t => {
            if (t.status === 'OPEN') {
                holdings[t.ticker] = (holdings[t.ticker] || 0) + t.quantity;
            }
        });

        const currentPrices: Record<string, number> = {};
        let portfolioValue = 0;
        
        signals.forEach(s => {
            currentPrices[s.ticker] = s.price;
            const shares = holdings[s.ticker] || 0;
            portfolioValue += shares * s.price;
        });

        const totalEquity = Math.max(config.initialCapital, portfolioValue + 10000); 

        const activeWeights: Record<string, number> = {};
        Object.keys(holdings).forEach(ticker => {
            const val = holdings[ticker] * (currentPrices[ticker] || 0);
            activeWeights[ticker] = val / totalEquity;
        });

        const targets = MathService.optimizePortfolio(
            signals, 
            config, 
            currentPrices,
            holdings,
            totalEquity
        );
        setOptTargets(targets);

        const metrics = MathService.calculatePortfolioRisk(signals, totalEquity, activeWeights);
        setRiskMetrics(metrics);

        setStatus(prev => ({
            ...prev,
            activePositions: Object.keys(holdings).length
        }));
     }
  }, [signals, config, trades]);

  // LIVE MODE LOGIC
  useEffect(() => {
    if (isLive) {
      
      if (marketServiceRef.current) {
        marketServiceRef.current.connect((ticker, price, timestamp) => {
           setSignals(prevSignals => prevSignals.map(s => {
             if (s.ticker === ticker) {
               const oldPrice = s.price || price; 
               const change = ((price - oldPrice) / oldPrice) * 100;
               
               let newRsi = s.rsi;
               if (change > 0.05) newRsi += 2;
               else if (change < -0.05) newRsi -= 2;
               newRsi = Math.min(100, Math.max(0, newRsi));

               const updatedSignal = {
                 ...s,
                 price: price,
                 changePercent: s.price === 0 ? 0 : change,
                 rsi: newRsi,
                 volume: s.volume + Math.floor(Math.random() * 100)
               };
               updatedSignal.compositeScore = MathService.calculateCompositeScore(updatedSignal);
               return updatedSignal;
             }
             return s;
           }));
        });
        
        // Subscribe to current configured watchlist
        config.watchlist.forEach(ticker => marketServiceRef.current?.subscribe(ticker));
      }

      loopRef.current = setInterval(async () => {
        const currentSignals = signalsRef.current;
        const currentConfig = configRef.current;
        const currentTrades = tradesRef.current;

        if (marketServiceRef.current) {
           const liveNews = await marketServiceRef.current.fetchLatestNews();
           if (liveNews.length > 0) {
             setNews(prev => {
                const combined = [...liveNews, ...prev].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i).slice(0, 20);
                return combined;
             });

             // Auto Discovery Logic
             liveNews.forEach(item => {
                if (item.relatedTicker && item.relatedTicker.match(/^[A-Z]+$/)) {
                   // ... (Auto discovery logic remains similar, ensuring full AssetSignal shape)
                }
             });
           }
        }

        setStatus(prev => ({
          ...prev,
          lastUpdated: new Date().toISOString(),
          dailyPnl: prev.dailyPnl + (Math.random() - 0.5) * 10,
          isLive: true
        }));

        if (currentConfig.enableAutomation) {
            const newTrade = await checkAutomatedTriggers(currentSignals, currentConfig, currentTrades.length);
            if (newTrade) {
                setTrades(prev => [newTrade, ...prev]);
            }
        }

      }, 5000); 

    } else {
      if (loopRef.current) clearInterval(loopRef.current);
      marketServiceRef.current?.disconnect();
      setStatus(prev => ({ ...prev, isLive: false }));
    }

    return () => {
      if (loopRef.current) clearInterval(loopRef.current);
    };
  }, [isLive, config.watchlist]); // Re-run if watchlist changes

  const toggleLiveMode = () => {
      setIsLive(!isLive);
      if (!isLive) {
          setConfig(c => ({...c, enableAutomation: true}));
      }
  };

  const runBatchPipeline = async () => {
    setIsPipelineRunning(true);
    setPipelineLogs([]);
    setPipelineArtifacts([]); 
    setPipelineStage('IDLE');

    const addLog = (msg: string, type: PipelineLog['type'], stage: PipelineStage) => {
        setPipelineLogs(prev => [...prev, {
            id: Date.now().toString() + Math.random(),
            timestamp: new Date().toISOString(),
            message: msg,
            type: type,
            stage: stage
        }]);
    };

    const addArtifact = (file: PipelineArtifact) => {
        setPipelineArtifacts(prev => [...prev, file]);
    };

    await PipelineService.run(config, addLog, setPipelineStage, addArtifact);
    setIsPipelineRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10 transition-all">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
           <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-colors ${isLive ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}>
              <span className="font-bold text-slate-900 text-xl">A</span>
           </div>
           <span className="font-bold text-lg hidden lg:block tracking-tight">ASSEMBLED AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LayoutDashboard className="w-5 h-5" /> <span className="hidden lg:block">Dashboard</span>
          </button>
          <button onClick={() => setActiveTab('signals')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'signals' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Radio className="w-5 h-5" /> <span className="hidden lg:block">Market & Signals</span>
          </button>
          <button onClick={() => setActiveTab('optimizer')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'optimizer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <PieChart className="w-5 h-5" /> <span className="hidden lg:block">Portfolio Optimizer</span>
          </button>
          <button onClick={() => setActiveTab('intelligence')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'intelligence' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Newspaper className="w-5 h-5" /> <span className="hidden lg:block">Intelligence</span>
          </button>
          <button onClick={() => setActiveTab('execution')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'execution' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <History className="w-5 h-5" /> <span className="hidden lg:block">Execution</span>
          </button>
          <button onClick={() => setActiveTab('backtest')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'backtest' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <LineChart className="w-5 h-5" /> <span className="hidden lg:block">Performance</span>
          </button>
          <button onClick={() => setActiveTab('discord')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'discord' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <MessageSquare className="w-5 h-5" /> <span className="hidden lg:block">Discord Bridge</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            <Sliders className="w-5 h-5" /> <span className="hidden lg:block">Configuration</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-3">
             <p className="text-xs text-slate-500 uppercase mb-1">System Status</p>
             <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                <span className={`text-xs font-mono ${isLive ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isLive ? 'LIVE TRADING' : 'STANDBY'}
                </span>
             </div>
             <p className="text-[10px] text-slate-600 mt-1">{status.lastUpdated.split('T')[1].split('.')[0]} UTC</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-20 lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
           <div>
             <h1 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
                {activeTab}
                {isLive && <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 animate-pulse">LIVE FEED</span>}
             </h1>
             <p className="text-slate-500 text-sm">Project v32 Technical Blueprint</p>
           </div>
           
           <div className="flex items-center gap-3">
             <button 
                onClick={toggleLiveMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                    isLive 
                    ? 'bg-rose-600 hover:bg-rose-700 border-rose-400 text-white shadow-lg shadow-rose-500/20' 
                    : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 text-white shadow-lg shadow-emerald-500/20'
                }`}
             >
                {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isLive ? 'STOP SYSTEM' : 'GO LIVE'}
             </button>
           </div>
        </header>
        
        <div className="fade-in">
          {activeTab === 'dashboard' && <Dashboard status={status} signals={signals} macroEvents={macroEvents} news={news} riskMetrics={riskMetrics} />}
          {activeTab === 'signals' && <Signals signals={signals} news={news} />}
          {activeTab === 'optimizer' && <PortfolioOptimizer targets={optTargets} totalCapital={config.initialCapital} />}
          {activeTab === 'intelligence' && <Intelligence news={news} insiderTrades={insiders} shippingRoutes={shipping} />}
          
          {activeTab === 'execution' && (
            <div className="space-y-10">
                <PipelineMonitor 
                    stage={pipelineStage} 
                    logs={pipelineLogs} 
                    artifacts={pipelineArtifacts} 
                    isRunning={isPipelineRunning} 
                    onRun={runBatchPipeline} 
                />
                <TradeHistory trades={trades} />
            </div>
          )}
          
          {activeTab === 'discord' && <DiscordBridge config={config} setConfig={setConfig} />}
          {activeTab === 'backtest' && <Backtest data={backtestData} />}
          {activeTab === 'settings' && (
            <Settings 
                config={config} 
                setConfig={setConfig} 
                runSimulation={() => {
                    // Reset with current config list, essentially re-init
                    const data = generateInitialMarketState(); 
                    setSignals(data.signals);
                }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
