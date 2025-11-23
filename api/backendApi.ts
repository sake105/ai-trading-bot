
import { 
  Signal, 
  OrderPreview, 
  PortfolioSnapshot, 
  RiskMetrics, 
  QaStatus, 
  Event, 
  Instrument 
} from '../types/domain';
import { RealtimeMarketService, generateInitialMarketState } from '../services/marketService';
import { INITIAL_WATCHLIST } from '../constants';
import { MathService } from '../services/mathService';

// Simulation of a Backend State
let pendingOrders: OrderPreview[] = [];
let approvedOrders: OrderPreview[] = []; // In a real app, these go to execution
let marketService = new RealtimeMarketService();

// Initialize some dummy pending orders for the SAFE Bridge demo
const initPendingOrders = () => {
  const tickers = ['NVDA', 'RHM.DE', 'PLUG'];
  pendingOrders = tickers.map((t, i) => ({
    id: `ord-${Date.now()}-${i}`,
    signalId: `sig-${Date.now()}-${i}`,
    instrument: {
      id: t,
      name: INITIAL_WATCHLIST.find(w => w.ticker === t)?.name || t,
      assetClass: 'EQUITY',
      currency: t.includes('.DE') ? 'EUR' : 'USD',
      sector: INITIAL_WATCHLIST.find(w => w.ticker === t)?.sector
    },
    side: i % 2 === 0 ? 'BUY' : 'SELL',
    quantity: 10 * (i + 1),
    type: 'LIMIT',
    limitPrice: 150.00, // Mock
    validity: 'DAY',
    estimatedCost: 1500 * (i+1),
    estimatedFees: 2.50,
    comment: i === 0 ? "Trend + Insider + Shipping" : "Technical Breakout",
    status: 'PENDING'
  }));
};
initPendingOrders();

export const BackendApi = {
  
  async getSignals(): Promise<Signal[]> {
    // In a real app, this calls /api/signals/today
    // Here we adapt our existing marketService logic
    const state = generateInitialMarketState(); // This gets us the latest signals based on our mocks
    return state.signals.map(s => ({
      id: `sig-${s.ticker}`,
      instrument: {
        id: s.ticker,
        name: s.name,
        assetClass: 'EQUITY',
        currency: s.ticker.includes('.DE') ? 'EUR' : 'USD',
        sector: s.sector
      },
      timestamp: new Date().toISOString(),
      direction: s.signal === 'BUY' ? 'LONG' : s.signal === 'SELL' ? 'SHORT' : 'HOLD',
      conviction: s.mlConfidence,
      entryPrice: s.price,
      stopLoss: s.price * 0.95,
      takeProfit: s.price * 1.1,
      strategyId: 'Trend_Follow_v32',
      horizonDays: 5,
      // UI Extras
      trendScore: s.trendScore,
      rsi: s.rsi,
      volume: s.volume,
      newsImpact: s.newsSentimentImpact,
      compositeScore: s.compositeScore,
      regime: 'NEUTRAL' // Simplified mapping
    }));
  },

  async getOrderPreviews(): Promise<OrderPreview[]> {
    // Returns orders waiting in the SAFE Bridge
    return new Promise(resolve => setTimeout(() => resolve([...pendingOrders]), 300));
  },

  async approveOrder(id: string): Promise<void> {
    const idx = pendingOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      const order = pendingOrders[idx];
      order.status = 'APPROVED';
      approvedOrders.push(order);
      pendingOrders = pendingOrders.filter(o => o.id !== id);
    }
    return Promise.resolve();
  },

  async rejectOrder(id: string): Promise<void> {
    const idx = pendingOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      pendingOrders = pendingOrders.filter(o => o.id !== id);
    }
    return Promise.resolve();
  },

  async getPortfolio(): Promise<PortfolioSnapshot> {
    const data = generateInitialMarketState();
    return {
        timestamp: new Date().toISOString(),
        equity: 105420.50,
        cash: 35000.00,
        activePositionCount: 4,
        realizedPnl1D: 450.20,
        realizedPnlYtd: 5420.50,
        positions: [
            {
                instrument: { id: 'NVDA', name: 'NVIDIA', assetClass: 'EQUITY', currency: 'USD' },
                quantity: 50,
                avgPrice: 120.00,
                marketPrice: 156.32,
                unrealizedPnl: (156.32 - 120) * 50,
                realizedPnl: 0,
                weight: 0.15
            },
            {
                instrument: { id: 'RHM.DE', name: 'Rheinmetall', assetClass: 'EQUITY', currency: 'EUR' },
                quantity: 10,
                avgPrice: 1450.00,
                marketPrice: 1500.50,
                unrealizedPnl: (1500.50 - 1450) * 10,
                realizedPnl: 0,
                weight: 0.12
            }
        ]
    };
  },

  async getRisk(): Promise<RiskMetrics> {
    return {
      timestamp: new Date().toISOString(),
      volatilityAnn: 0.14,
      maxDrawdown: 0.08,
      var95: 1450.00,
      cvar95: 2200.00,
      grossExposure: 0.65,
      netExposure: 0.65, // Long only for now
      turnover1D: 0.02,
      beta: 1.12,
      sharpeRatio: 1.85
    };
  },

  async getQaStatus(): Promise<QaStatus> {
    return {
      dataOk: true,
      leakageRisk: 'OK',
      modelDrift: 'OK', // Could switch to WARNING to demo
      currentMaxDrawdown: 0.05,
      lastBacktestSharpe: 1.9,
      lastBacktestMaxDrawdown: 0.15,
      canTradeToday: true
    };
  },

  async getEvents(params?: { type?: string }): Promise<Event[]> {
    // Mocking the Unified Event Schema
    const events: Event[] = [
        {
            id: 'evt-1',
            type: 'COMPANY_NEWS',
            timestampSource: new Date().toISOString(),
            timestampEffective: new Date().toISOString(),
            source: 'Reuters',
            tickers: ['NVDA'],
            sectors: ['Technology'],
            countries: ['US'],
            routes: [],
            politicians: [],
            title: 'NVIDIA announces new AI chip partnership',
            summary: 'Strategic partnership with Foxconn to build AI factories.',
            sentiment: { polarity: 0.8, confidence: 0.9 }
        },
        {
            id: 'evt-2',
            type: 'SHIPPING',
            timestampSource: new Date(Date.now() - 3600000).toISOString(),
            timestampEffective: new Date().toISOString(),
            source: 'MarineTraffic',
            tickers: [],
            sectors: ['Industrial'],
            countries: [],
            routes: ['Suez'],
            politicians: [],
            title: 'Suez Canal Congestion Alert',
            summary: 'Traffic backed up due to grounding vessel.',
            sentiment: { polarity: -0.6, confidence: 0.95 }
        },
        {
            id: 'evt-3',
            type: 'CONGRESS_TRADE',
            timestampSource: new Date(Date.now() - 86400000 * 2).toISOString(),
            timestampEffective: new Date().toISOString(),
            source: 'House Clerk',
            tickers: ['LMT'],
            sectors: ['Defense'],
            countries: ['US'],
            routes: [],
            politicians: ['Nancy Pelosi'],
            title: 'Rep. Pelosi bought LMT Call Options',
            summary: 'Disclosure of purchase valued between $500k-$1M.',
            sentiment: { polarity: 0.4, confidence: 0.8 }
        }
    ];

    if (params?.type) {
        return events.filter(e => e.type === params.type);
    }
    return events;
  }
};
