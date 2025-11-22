import { AssembledConfig, MarketRegime, SystemStatus } from './types';

export const INITIAL_CONFIG: AssembledConfig = {
  volTarget: 0.12, // 12% Annualized Volatility
  maxDrawdownLimit: 0.20, // 20% Hard Cap
  kellyScale: 0.3, // Conservative fractional Kelly
  atrStopMultiplier: 2.5,
  useHRP: true
};

export const INITIAL_STATUS: SystemStatus = {
  lastUpdated: new Date().toISOString(),
  vix: 18.45,
  sentimentScore: 0.65,
  gprIndex: 85,
  regime: MarketRegime.NEUTRAL,
  activePositions: 12,
  cashPosition: 45000, // 45% cash in neutral
  dailyPnl: 1250.50
};

export const MOCK_TICKERS = [
  // Indices
  { ticker: 'SPY', name: 'S&P 500 ETF', sector: 'Index' },
  { ticker: 'QQQ', name: 'Nasdaq 100 ETF', sector: 'Index' },
  { ticker: 'IWM', name: 'Russell 2000 ETF', sector: 'Index' },
  // Equities
  { ticker: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft', sector: 'Technology' },
  { ticker: 'AAPL', name: 'Apple Inc', sector: 'Technology' },
  { ticker: 'JPM', name: 'JPMorgan', sector: 'Financial' },
  { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
  { ticker: 'LLY', name: 'Eli Lilly', sector: 'Healthcare' },
  { ticker: 'GLD', name: 'Gold Trust', sector: 'Commodity' },
  { ticker: 'IEF', name: '7-10 Year Treasury', sector: 'Fixed Income' },
  // Logistics proxy
  { ticker: 'ZIM', name: 'ZIM Shipping', sector: 'Industrial' },
  { ticker: 'FDX', name: 'FedEx Corp', sector: 'Industrial' },
];