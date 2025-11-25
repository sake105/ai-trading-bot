
import type {
  Signal,
  OrderPreview,
  PortfolioSnapshot,
  RiskMetrics,
  QaStatus,
  Event,
} from '../types/domain';
import { httpGet, httpPost } from './httpClient';
import { USE_MOCKS } from '../config/env';

// We import the previous services to maintain the "Real" data logic we built
import { generateInitialMarketState, RealtimeMarketService } from '../services/marketService';
import { MathService } from '../services/mathService';

// BRIDGE: Adapt the existing MarketService to the new API Interface
// This ensures we don't lose the "Real" prices from Finnhub
const marketService = new RealtimeMarketService();
let cachedState = generateInitialMarketState();
let pendingOrders: OrderPreview[] = [];

// Initialize Orders from State
const initOrders = () => {
    pendingOrders = cachedState.signals.slice(0, 3).map((s, i) => ({
        id: `ord-${i}`,
        signalId: `sig-${s.ticker}`,
        instrument: {
            id: s.ticker,
            name: s.name,
            assetClass: 'EQUITY',
            currency: 'USD', // Simplified
            sector: s.sector
        },
        side: s.signal === 'BUY' ? 'BUY' : 'SELL',
        quantity: 10,
        type: 'LIMIT',
        limitPrice: s.price,
        validity: 'DAY',
        estimatedCost: s.price * 10,
        estimatedFees: 2,
        comment: 'System Generated'
    }));
};
initOrders();

const MockApi = {
  async getSignals(): Promise<Signal[]> {
    // Adapt AssetSignal to new Signal domain type
    return cachedState.signals.map(s => ({
        id: `sig-${s.ticker}`,
        instrument: {
            id: s.ticker,
            name: s.name,
            assetClass: 'EQUITY',
            currency: 'USD',
            sector: s.sector
        },
        timestamp: new Date().toISOString(),
        direction: s.signal === 'BUY' ? 'LONG' : s.signal === 'SELL' ? 'SHORT' : 'HOLD',
        conviction: s.mlConfidence,
        entryPrice: s.price,
        stopLoss: s.price * 0.95,
        takeProfit: s.price * 1.05,
        strategyId: 'Trend_V1',
        horizonDays: 5,
        trendScore: s.trendScore,
        rsi: s.rsi,
        volume: s.volume,
        compositeScore: s.compositeScore,
        regime: 'NEUTRAL'
    }));
  },

  async getOrderPreviews(): Promise<OrderPreview[]> {
    return [...pendingOrders];
  },

  async approveOrder(id: string): Promise<void> {
    pendingOrders = pendingOrders.filter(o => o.id !== id);
    // In real app, send to execution engine
  },

  async rejectOrder(id: string): Promise<void> {
    pendingOrders = pendingOrders.filter(o => o.id !== id);
  },

  async getPortfolio(): Promise<PortfolioSnapshot> {
    // Adapt the mock portfolio
    const positions = cachedState.signals.slice(0, 5).map(s => ({
        instrument: { id: s.ticker, name: s.name, assetClass: 'EQUITY', currency: 'USD', sector: s.sector },
        quantity: 100,
        avgPrice: s.price * 0.9,
        marketPrice: s.price,
        unrealizedPnl: (s.price - (s.price*0.9)) * 100,
        realizedPnl: 0,
        weight: 0.1
    }));

    // Create fake history for charts
    const history = Array.from({length: 30}).map((_, i) => ({
        timestamp: new Date(Date.now() - (29-i)*86400000).toISOString(),
        value: 100000 + (i * 1000) + (Math.random() * 2000)
    }));
    
    const pnlHistory = history.map(h => ({
        timestamp: h.timestamp,
        value: (Math.random() * 1000) - 200
    }));

    return {
        timestamp: new Date().toISOString(),
        equity: 120000,
        cash: 20000,
        positions: positions as any,
        realizedPnl1D: 150,
        realizedPnlYtd: 5000,
        equityHistory: history,
        pnlHistory1M: pnlHistory
    };
  },

  async getRisk(): Promise<RiskMetrics> {
    return {
        timestamp: new Date().toISOString(),
        volatilityAnn: 0.15,
        maxDrawdown: -0.12,
        var95: -2500,
        cvar95: -4000,
        grossExposure: 0.8,
        netExposure: 0.6,
        turnover1D: 0.05
    };
  },

  async getQaStatus(): Promise<QaStatus> {
    return {
        dataOk: true,
        leakageRisk: 'OK',
        modelDrift: 'OK',
        currentMaxDrawdown: 0.08,
        lastBacktestSharpe: 1.5,
        lastBacktestMaxDrawdown: 0.2,
        canTradeToday: true
    };
  },

  async getEvents(params?: { type?: string }): Promise<Event[]> {
      const allEvents = [
          ...cachedState.newsItems.map((n, i) => ({
              id: `news-${i}`,
              type: 'COMPANY_NEWS',
              timestampSource: n.timestamp,
              timestampEffective: n.timestamp,
              source: n.source,
              tickers: n.relatedTicker ? [n.relatedTicker] : [],
              sectors: [],
              countries: [],
              routes: [],
              politicians: [],
              sentiment: { polarity: 0.5, confidence: 0.8 },
              metadata: { rawHeadline: n.title, url: n.url }
          })),
          {
              id: 'cong-1',
              type: 'CONGRESS_TRADE',
              timestampSource: new Date().toISOString(),
              timestampEffective: new Date().toISOString(),
              source: 'Senate',
              tickers: ['NVDA'],
              sectors: ['Technology'],
              countries: ['US'],
              routes: [],
              politicians: ['Nancy Pelosi'],
              metadata: { rawHeadline: 'Pelosi buys NVDA Calls' }
          },
           {
              id: 'ship-1',
              type: 'SHIPPING',
              timestampSource: new Date().toISOString(),
              timestampEffective: new Date().toISOString(),
              source: 'AIS',
              tickers: [],
              sectors: ['Shipping'],
              countries: [],
              routes: ['Suez', 'Red Sea'],
              politicians: [],
              metadata: { rawHeadline: 'Congestion in Red Sea increasing' }
          }
      ];

      if (params?.type) {
          return allEvents.filter(e => e.type === params.type) as Event[];
      }
      return allEvents as Event[];
  }
};

// If USE_MOCKS is true (which it is in env), use the internal logic. 
// Otherwise try to hit localhost:8000
export const BackendApi = USE_MOCKS ? MockApi : {
    getSignals: () => httpGet<Signal[]>('/signals/today'),
    getOrderPreviews: () => httpGet<OrderPreview[]>('/orders/previews'),
    approveOrder: (id: string) => httpPost<void>(`/orders/${id}/approve`),
    rejectOrder: (id: string) => httpPost<void>(`/orders/${id}/reject`),
    getPortfolio: () => httpGet<PortfolioSnapshot>('/portfolio/current'),
    getRisk: () => httpGet<RiskMetrics>('/risk/summary'),
    getQaStatus: () => httpGet<QaStatus>('/qa/status'),
    getEvents: (params: any) => {
        const query = params?.type ? `?type=${encodeURIComponent(params.type)}` : '';
        return httpGet<Event[]>(`/events${query}`);
    }
};
