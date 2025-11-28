
export type InstrumentId = string;

export interface Instrument {
  id: InstrumentId;
  name: string;
  assetClass: 'EQUITY' | 'ETF' | 'FUTURE';
  currency: string;
  sector?: string;
}

export interface Signal {
  id: string;
  instrument: Instrument;
  timestamp: string;
  direction: 'LONG' | 'SHORT' | 'HOLD';
  conviction: number; // 0..1
  entryPrice: number;
  stopLoss: number;
  takeProfit?: number;
  strategyId: string;
  horizonDays: number;
  // Additional UI properties
  trendScore?: number;
  rsi?: number;
  volume?: number;
  compositeScore?: number;
  regime?: 'RISK_ON' | 'RISK_OFF' | 'NEUTRAL';
}

export interface OrderPreview {
  id: string;
  signalId: string;
  instrument: Instrument;
  side: 'BUY' | 'SELL';
  quantity: number;
  type: 'MARKET' | 'LIMIT';
  limitPrice?: number;
  validity: 'DAY' | 'GTC';
  estimatedCost: number;
  estimatedFees: number;
  comment?: string;
}

export interface PortfolioPosition {
  instrument: Instrument;
  quantity: number;
  avgPrice: number;
  marketPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  weight: number;
}

export interface EquityPoint {
  timestamp: string;
  value: number;
}

export interface PnlPoint {
  timestamp: string;
  value: number;
}

export interface PortfolioSnapshot {
  timestamp: string;
  equity: number;
  cash: number;
  positions: PortfolioPosition[];
  realizedPnl1D: number;
  realizedPnlYtd: number;
  equityHistory?: EquityPoint[];
  pnlHistory1M?: PnlPoint[];
}

export interface RiskMetrics {
  timestamp: string;
  volatilityAnn: number;
  maxDrawdown: number;
  var95: number;
  cvar95: number;
  grossExposure: number;
  netExposure: number;
  turnover1D: number;
  beta: number;
  sharpeRatio: number;
}

export interface QaStatus {
  dataOk: boolean;
  leakageRisk: 'OK' | 'WARNING' | 'BLOCK';
  modelDrift: 'OK' | 'WARNING' | 'BLOCK';
  currentMaxDrawdown: number;
  lastBacktestSharpe: number;
  lastBacktestMaxDrawdown: number;
  canTradeToday: boolean;
}

export type EventType =
  | 'COMPANY_NEWS'
  | 'MACRO'
  | 'POLITICAL'
  | 'LEGISLATION'
  | 'SHIPPING'
  | 'CONGRESS_TRADE';

export interface Event {
  id: string;
  type: EventType;
  timestampSource: string;
  timestampEffective: string;
  source: string;
  tickers: InstrumentId[];
  sectors: string[];
  countries: string[];
  routes: string[];
  politicians: string[];
  sentiment?: {
    polarity: number; // -1..1
    confidence: number; // 0..1
  };
  metadata?: {
    rawHeadline?: string;
    url?: string;
  };
}
