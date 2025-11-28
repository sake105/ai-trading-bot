
import React, { useEffect, useRef } from 'react';

interface Props {
  ticker: string;
}

export const CandleChart: React.FC<Props> = ({ ticker }) => {
  const container = useRef<HTMLDivElement>(null);

  const getTradingViewSymbol = (symbol: string): string => {
    // Simple Mapping Logic (kann erweitert werden wie im alten Code)
    if (symbol.includes('.DE')) return `XETRA:${symbol.split('.')[0]}`;
    if (symbol.includes('.L')) return `LSE:${symbol.split('.')[0]}`;
    return `NASDAQ:${symbol}`;
  };

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": getTradingViewSymbol(ticker),
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });
    container.current.appendChild(script);
  }, [ticker]);

  return (
    <div className="h-[400px] w-full bg-[#050712] rounded border border-[#262b3b] overflow-hidden">
      <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
      </div>
    </div>
  );
};
