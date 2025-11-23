
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // We will refactor Dashboard to match domain types
import Signals from './components/Signals';     // Market Watch
import { OrdersPage } from './features/orders/OrdersPage';
import { QaPage } from './features/qa/QaPage';
import { CongressPage } from './features/congress/CongressPage';
import { ShippingPage } from './features/shipping/ShippingPage';
import RiskGauge from './components/RiskGauge'; // Placeholder for full Risk Page
import Intelligence from './components/Intelligence'; // Placeholder for Events

// Temporary Mock Data Injection for Legacy Components (until fully refactored)
import { generateInitialMarketState } from './services/marketService';
import { INITIAL_STATUS } from './constants';

const mockData = generateInitialMarketState();

// Adapter to Domain Signals
const domainSignals = mockData.signals.map(s => ({
    id: s.ticker,
    instrument: {
        id: s.ticker,
        name: s.name,
        assetClass: 'EQUITY' as const,
        currency: 'USD',
        sector: s.sector
    },
    timestamp: new Date().toISOString(),
    direction: (s.signal === 'BUY' ? 'LONG' : s.signal === 'SELL' ? 'SHORT' : 'HOLD') as any,
    conviction: s.mlConfidence,
    entryPrice: s.price,
    stopLoss: s.price * 0.95,
    takeProfit: s.price * 1.1,
    strategyId: 'Trend_Follow_v32',
    horizonDays: 5,
    trendScore: s.trendScore,
    rsi: s.rsi,
    volume: s.volume,
    newsImpact: s.newsSentimentImpact,
    compositeScore: s.compositeScore,
    regime: 'NEUTRAL' as const
}));

// Domain Risk Metrics for Dashboard
const dashboardRiskMetrics = {
    timestamp: new Date().toISOString(),
    volatilityAnn: 0.14,
    maxDrawdown: 0.08,
    var95: 1450.00,
    cvar95: 2200.00,
    grossExposure: 0.65,
    netExposure: 0.65,
    turnover1D: 0.02,
    beta: 1.12,
    sharpeRatio: 1.85
};

// Legacy Risk Metrics for RiskGauge Page
const legacyRiskMetrics = {
    var95: 1450, 
    var99: 2200, 
    cvar95: 2800, 
    sharpeRatio: 1.8, 
    volatility: 14, 
    beta: 1.1
};

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <Dashboard 
            status={INITIAL_STATUS} 
            signals={domainSignals} 
            macroEvents={[]} 
            news={mockData.newsItems} 
            riskMetrics={dashboardRiskMetrics} 
        />
      } />
      
      <Route path="/orders" element={<OrdersPage />} />
      
      <Route path="/risk" element={
         <div className="space-y-6 animate-in fade-in">
            <h1 className="text-2xl font-bold text-white">Risk Management</h1>
            <div className="h-[400px]">
                <RiskGauge metrics={legacyRiskMetrics} />
            </div>
         </div>
      } />
      
      <Route path="/qa" element={<QaPage />} />
      
      <Route path="/events" element={<Intelligence news={mockData.newsItems} insiderTrades={[]} shippingRoutes={[]} />} />
      
      <Route path="/congress" element={<CongressPage />} />
      
      <Route path="/shipping" element={<ShippingPage />} />
    </Routes>
  );
}
