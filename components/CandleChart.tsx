
import React, { useEffect, useRef } from 'react';
import { AssetSignal } from '../types';

interface CandleChartProps {
  signal: AssetSignal;
}

const CandleChart: React.FC<CandleChartProps> = ({ signal }) => {
  const container = useRef<HTMLDivElement>(null);

  // Helper to map Finnhub Tickers to TradingView Symbols
  const getTradingViewSymbol = (ticker: string): string => {
    // German Market
    if (ticker.includes('.DE')) return `XETRA:${ticker.split('.')[0]}`;
    // London
    if (ticker.includes('.L')) return `LSE:${ticker.split('.')[0]}`;
    // Paris
    if (ticker.includes('.PA')) return `EURONEXT:${ticker.split('.')[0]}`;
    // Crypto
    if (ticker === 'BTC' || ticker === 'ETH') return `BINANCE:${ticker}USDT`;
    // Indices / Commodities
    if (ticker === 'WTI') return 'TVC:USOIL';
    
    // Default US (Try NASDAQ first, fallback handled by TV usually)
    return `NASDAQ:${ticker}`;
  };

  useEffect(() => {
    if (!container.current) return;

    // Clear previous widget
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
      "hotlist": true,
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
