
import { AssembledConfig, MarketRegime, SystemStatus, ApiKeys } from './types';

export const INITIAL_CONFIG: AssembledConfig = {
  initialCapital: 100000, 
  volTarget: 0.12, 
  maxDrawdownLimit: 0.20, 
  kellyScale: 0.3, 
  atrStopMultiplier: 2.5,
  useHRP: true,
  enableAutomation: false,
  tradingIntervalSeconds: 1,
  autoHedge: true,
  skipPull: false,
  watchlist: [] // Will be populated on init
};

export const INITIAL_STATUS: SystemStatus = {
  lastUpdated: new Date().toISOString(),
  vix: 18.45,
  sentimentScore: 0.65,
  gprIndex: 85,
  regime: MarketRegime.NEUTRAL,
  activePositions: 0,
  cashPosition: 100000, 
  dailyPnl: 0,
  isLive: false
};

export const API_KEYS: ApiKeys = {
  finnhub: 'd43phc1r01qge0cutqu0d43phc1r01qge0cutqug',
  alphaVantage: 'DT8CZEL536BEDQKG'
};

// The Master Watchlist provided by the user
export const INITIAL_WATCHLIST = [
  // German / European Industry & Defense
  { ticker: 'RHM.DE', name: 'Rheinmetall AG', sector: 'Defense' },
  { ticker: 'TKA.DE', name: 'ThyssenKrupp AG', sector: 'Industrials' },
  { ticker: 'RR.L', name: 'Rolls-Royce Holdings', sector: 'Industrials' },
  { ticker: 'R3NK.DE', name: 'RENK Group AG', sector: 'Defense' },
  { ticker: 'HAG.DE', name: 'Hensoldt AG', sector: 'Defense' },
  { ticker: 'BA.L', name: 'BAE Systems', sector: 'Defense' },
  { ticker: 'AIR.PA', name: 'Airbus SE', sector: 'Industrials' },
  { ticker: 'PAH3.DE', name: 'Porsche Holding', sector: 'Automotive' },
  { ticker: 'VOW3.DE', name: 'Volkswagen (VZ)', sector: 'Automotive' },
  { ticker: 'SRT.DE', name: 'Sartorius (VZ)', sector: 'Healthcare' },
  { ticker: 'SMHN.DE', name: 'Suess MicroTec', sector: 'Technology' },
  { ticker: 'EUZ.DE', name: 'Eckert & Ziegler', sector: 'Healthcare' },
  { ticker: 'BAVA.CO', name: 'Bavarian Nordic', sector: 'Healthcare' },
  
  // US Tech Giants & Semiconductors
  { ticker: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { ticker: 'INTC', name: 'Intel Corp', sector: 'Technology' },
  { ticker: 'TSM', name: 'TSMC (ADR)', sector: 'Technology' },
  { ticker: 'ASML', name: 'ASML Holding', sector: 'Technology' },
  { ticker: 'AVGO', name: 'Broadcom Inc', sector: 'Technology' },
  { ticker: 'MU', name: 'Micron Technology', sector: 'Technology' },
  { ticker: 'QCOM', name: 'Qualcomm Inc', sector: 'Technology' },
  { ticker: 'SMCI', name: 'Super Micro Computer', sector: 'Technology' },
  
  // US Software & Cloud
  { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Technology' },
  { ticker: 'GOOGL', name: 'Alphabet (A)', sector: 'Technology' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Technology' },
  { ticker: 'ADBE', name: 'Adobe Inc', sector: 'Technology' },
  { ticker: 'ORCL', name: 'Oracle Corp', sector: 'Technology' },
  { ticker: 'PLTR', name: 'Palantir Technologies', sector: 'Technology' },
  { ticker: 'ACN', name: 'Accenture plc', sector: 'Technology' },
  { ticker: 'DELL', name: 'Dell Technologies', sector: 'Technology' },
  { ticker: 'DBX', name: 'Dropbox', sector: 'Technology' },
  { ticker: 'U', name: 'Unity Software', sector: 'Technology' },
  { ticker: 'QBTS', name: 'D-Wave Quantum', sector: 'Technology' },
  { ticker: 'QMCO', name: 'Quantum Corporation', sector: 'Technology' },
  
  // US Defense & Aerospace
  { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Defense' },
  { ticker: 'NOC', name: 'Northrop Grumman', sector: 'Defense' },
  { ticker: 'BA', name: 'Boeing Co', sector: 'Industrials' },
  { ticker: 'AXON', name: 'Axon Enterprise', sector: 'Defense' },
  { ticker: 'DRO.AX', name: 'DroneShield Ltd', sector: 'Defense' }, // AU listed, often OTC in US
  
  // Energy, Crypto & Others
  { ticker: 'PBR', name: 'Petroleo Brasileiro', sector: 'Energy' },
  { ticker: 'PLUG', name: 'Plug Power', sector: 'Energy' },
  { ticker: 'ALB', name: 'Albemarle Corp', sector: 'Basic Materials' },
  { ticker: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Cyclical' },
  { ticker: 'MSTR', name: 'MicroStrategy', sector: 'Finance' },
  { ticker: 'SPGI', name: 'S&P Global', sector: 'Finance' },
  { ticker: 'UAA', name: 'Under Armour', sector: 'Consumer Cyclical' },
  { ticker: 'VRNA', name: 'Verona Pharma', sector: 'Healthcare' },
  { ticker: 'IOS', name: 'Ionos Group', sector: 'Technology' }
];

export const SECTOR_COLORS: Record<string, string> = {
  'Technology': '#3b82f6', // Blue
  'Defense': '#f59e0b',    // Amber
  'Industrials': '#64748b', // Slate
  'Healthcare': '#ec4899', // Pink
  'Energy': '#ef4444',     // Red
  'Finance': '#10b981',    // Emerald
  'Consumer Cyclical': '#8b5cf6', // Violet
  'Automotive': '#06b6d4', // Cyan
  'Basic Materials': '#a8a29e', // Warm Gray
  'Index': '#ffffff'
};

export const ANDREAS_GRASSL_CHANNELS = [
  { name: 'Telegram (World Politics Daily)', url: 'https://t.me/worldpolitcsdaily', icon: 'send' },
  { name: 'TikTok (Main)', url: 'https://www.tiktok.com/@andreas_grassl?_t=8mcT0EY4emW&_r=1', icon: 'video' },
  { name: 'TikTok (Live Highlights)', url: 'https://www.tiktok.com/@worldpoliticsdaily_live?_t=8mcSx622Xpp&_r=1', icon: 'video' },
  { name: 'YouTube (World Politics Daily)', url: 'https://youtube.com/@worldpoliticsdaily?si=ehQnllAIVjxIZYLS', icon: 'youtube' },
  { name: 'YouTube (Grassl & Matei)', url: 'https://youtube.com/@grasslundmatei?si=tablqFaGXrVqpy4_', icon: 'youtube' },
  { name: 'Spotify (Grassl & Matei)', url: 'https://open.spotify.com/show/0YQOMR76SP5K0vOiiaYRqZ?si=laEPlFrFTSmrJEkcIvm2iw', icon: 'mic' },
  { name: 'X (Twitter)', url: 'https://x.com/grassl_andreas', icon: 'twitter' },
  { name: 'Instagram', url: 'https://www.instagram.com/worldpolitics_daily?igsh=YzdwbTh1cW5kaG55&utm_source=qr', icon: 'instagram' }
];
