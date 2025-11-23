
import React, { useEffect, useRef } from 'react';
import { AssetSignal } from '../types';

interface CandleChartProps {
  signal: AssetSignal;
}

const CandleChart: React.FC<CandleChartProps> = ({ signal }) => {
  const container = useRef<HTMLDivElement>(null);

  // Comprehensive Mapping from Internal Tickers (Finnhub/Yahoo style) to TradingView Symbols
  const getTradingViewSymbol = (ticker: string): string => {
    const map: Record<string, string> = {
      // German / DAX / XETRA
      'RHM.DE': 'XETRA:RHM',
      'TKA.DE': 'XETRA:TKA',
      'R3NK.DE': 'XETRA:R3NK',
      'HAG.DE': 'XETRA:HAG',
      'PAH3.DE': 'XETRA:PAH3',
      'VOW3.DE': 'XETRA:VOW3',
      'SRT.DE': 'XETRA:SRT',
      'SMHN.DE': 'XETRA:SMHN',
      'EUZ.DE': 'XETRA:EUZ',
      'IOS': 'XETRA:IOS', // Ionos Group

      // UK / LSE
      'RR.L': 'LSE:RR.',
      'BA.L': 'LSE:BA.',

      // Europe Other
      'AIR.PA': 'EURONEXT:AIR',
      'BAVA.CO': 'OMXCOP:BAVA', // Bavarian Nordic (Copenhagen)

      // US Tech (NASDAQ)
      'NVDA': 'NASDAQ:NVDA',
      'AMD': 'NASDAQ:AMD',
      'INTC': 'NASDAQ:INTC',
      'ASML': 'NASDAQ:ASML',
      'AVGO': 'NASDAQ:AVGO',
      'MU': 'NASDAQ:MU',
      'QCOM': 'NASDAQ:QCOM',
      'SMCI': 'NASDAQ:SMCI',
      'MSFT': 'NASDAQ:MSFT',
      'GOOGL': 'NASDAQ:GOOGL',
      'META': 'NASDAQ:META',
      'ADBE': 'NASDAQ:ADBE',
      'DBX': 'NASDAQ:DBX',
      'QMCO': 'NASDAQ:QMCO',
      'AXON': 'NASDAQ:AXON',
      'PLUG': 'NASDAQ:PLUG',
      'TSLA': 'NASDAQ:TSLA',
      'MSTR': 'NASDAQ:MSTR',
      'VRNA': 'NASDAQ:VRNA',

      // US NYSE / Others
      'TSM': 'NYSE:TSM',
      'ORCL': 'NYSE:ORCL',
      'PLTR': 'NYSE:PLTR',
      'ACN': 'NYSE:ACN',
      'DELL': 'NYSE:DELL',
      'U': 'NYSE:U',
      'QBTS': 'NYSE:QBTS',
      'LMT': 'NYSE:LMT',
      'NOC': 'NYSE:NOC',
      'BA': 'NYSE:BA',
      'PBR': 'NYSE:PBR',
      'ALB': 'NYSE:ALB',
      'SPGI': 'NYSE:SPGI',
      'UAA': 'NYSE:UAA',
      'XOM': 'NYSE:XOM',
      'XPEV': 'NYSE:XPEV',

      // Australia
      'DRO.AX': 'ASX:DRO',

      // Commodities / Indices
      'WTI': 'TVC:USOIL',
    };

    if (map[ticker]) return map[ticker];

    // Fallback Heuristics
    if (ticker.includes('.DE')) return `XETRA:${ticker.split('.')[0]}`;
    if (ticker.includes('.L')) return `LSE:${ticker.split('.')[0]}`;
    if (ticker.includes('.PA')) return `EURONEXT:${ticker.split('.')[0]}`;
    
    // Default assumption: NASDAQ if not found (common for tech)
    return `NASDAQ:${ticker}`;
  };

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget to prevent duplicates
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    const tvSymbol = getTradingViewSymbol(signal.ticker);

    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": tvSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "withdateranges": true,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "details": true,
      "hotlist": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    container.current.appendChild(script);

  }, [signal.ticker]); // Re-render when ticker changes

  return (
    <div className="h-[600px] w-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden relative">
      <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      </div>
    </div>
  );
};

export default CandleChart;
