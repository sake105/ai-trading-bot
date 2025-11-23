import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { AssetSignal } from '../types';
import { SECTOR_COLORS } from '../constants';

interface MarketHeatmapProps {
  signals: AssetSignal[];
}

const MarketHeatmap: React.FC<MarketHeatmapProps> = ({ signals }) => {
  
  // Transform signals into Tree structure: Root -> Sector -> Ticker
  const treeData = React.useMemo(() => {
    const sectors: Record<string, any> = {};
    
    signals.forEach(s => {
      if (!sectors[s.sector]) {
        sectors[s.sector] = { name: s.sector, children: [] };
      }
      sectors[s.sector].children.push({
        name: s.ticker,
        size: s.volume, // Size by Volume
        change: s.changePercent, // Color by Change
        price: s.price
      });
    });

    return Object.values(sectors);
  }, [signals]);

  const CustomContent = (props: any) => {
    const { root, depth, x, y, width, height, index, name, change, price } = props;

    if (depth === 1) {
        // Leaf Node (Ticker)
        const isUp = change >= 0;
        // Calculate color intensity based on magnitude of change
        const intensity = Math.min(Math.abs(change) / 3, 1); // Cap at 3% move
        const color = isUp 
            ? `rgba(16, 185, 129, ${0.3 + intensity * 0.7})` // Emerald
            : `rgba(244, 63, 94, ${0.3 + intensity * 0.7})`; // Rose

        return (
            <g>
                <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                        fill: color,
                        stroke: '#0f172a',
                        strokeWidth: 2,
                    }}
                />
                {width > 40 && height > 30 && (
                    <>
                        <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="bold">
                            {name}
                        </text>
                        <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={10}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)}%
                        </text>
                    </>
                )}
            </g>
        );
    }
    // Default (Sector Level handled by library usually, but we customize leaves)
    return null;
  };

  return (
    <div className="h-[600px] bg-slate-900 rounded-xl border border-slate-800 overflow-hidden p-1">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <Treemap
                data={treeData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#1e293b"
                content={<CustomContent />}
            >
                <Tooltip 
                    content={({ payload }) => {
                        if (payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="bg-slate-900 border border-slate-700 p-2 rounded text-xs shadow-xl">
                                    <p className="font-bold text-white">{data.name}</p>
                                    <p className="text-slate-400">Price: ${data.price?.toFixed(2)}</p>
                                    <p className={data.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                        Change: {data.change?.toFixed(2)}%
                                    </p>
                                    <p className="text-slate-500">Vol: {(data.size / 1000000).toFixed(1)}M</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
            </Treemap>
        </ResponsiveContainer>
    </div>
  );
};

export default MarketHeatmap;