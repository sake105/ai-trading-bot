export enum MarketRegime {
  RISK_ON = 'RISK_ON',
  RISK_OFF = 'RISK_OFF',
  NEUTRAL = 'NEUTRAL'
}

export interface AssembledConfig {
  volTarget: number; // e.g., 0.10 for 10%
  maxDrawdownLimit: number; // e.g., 0.20
  kellyScale: number; // e.g., 0.5 for half-kelly
  atrStopMultiplier: number;
  useHRP: boolean;
  apiKey?: string;
}

export interface AssetSignal {
  ticker: string;
  name: string;
  price: number;
  trendScore: number; // 0-100 Trend Quality Score
  mlConfidence: number; // 0-1 Probability
  volatility: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  sector: string;
  atr: number;
  // Expanded Indicators
  volume: number;
  volumeAvg: number;
  rsi: number;
  macd: number;
  insiderActivity: number; // -10 to +10 (Negative = Sell, Positive = Buy)
  newsSentimentImpact: number; // -10 to +10 (Impact of news on this specific asset)
  logisticsRisk: number; // 0-100 (Supply chain impact)
}

export interface PortfolioPosition {
  ticker: string;
  shares: number;
  weight: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface BacktestMetric {
  date: string;
  equity: number;
  benchmark: number;
  drawdown: number;
  regime: MarketRegime;
}

export interface NewsItem {
  id: string;
  source: 'CNBC' | 'Telegram' | 'Reuters' | 'Bloomberg' | 'WSJ' | 'Insider' | 'Logistics';
  relatedTicker?: string; // Links news directly to an asset
  author?: string; // e.g., "Andreas Grassl", "Nancy Pelosi"
  title: string;
  summary: string;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impactScore: number; // 1-10 magnitude based on source credibility
  timestamp: string;
}

export interface InsiderTrade {
  id: string;
  ticker: string;
  person: string;
  role: string; // Senator, CEO, Hedge Fund
  type: 'BUY' | 'SELL';
  amount: number;
  date: string;
}

export interface ShippingRoute {
  id: string;
  name: string; // e.g., "Shanghai -> Rotterdam"
  status: 'Normal' | 'Congested' | 'Blocked';
  costIndex: number; // 100 = Baseline
  trend: 'UP' | 'DOWN' | 'FLAT';
}

export interface SystemStatus {
  lastUpdated: string;
  vix: number;
  sentimentScore: number; // 0-1
  gprIndex: number; // Geopolitical Risk
  regime: MarketRegime;
  activePositions: number;
  cashPosition: number;
  dailyPnl: number;
}