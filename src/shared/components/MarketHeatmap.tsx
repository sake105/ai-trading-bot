
import React from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import type { Signal } from '../../types/domain';

interface Props {
  signals: Signal[];
}

export const MarketHeatmap: React.FC<Props> = ({ signals }) => {
  const treeData = React.useMemo(() => {
    const sectors: Record<string, any> = {};
    signals.forEach(s => {
      const sec = s.instrument.sector || 'Other';
      if (!sectors[sec]) sectors[sec] = { name: sec, children: [] };
      sectors[sec].children.push({
        name: s.instrument.id,
        size: s.volume || 1000,
        change: (s.trendScore || 50) - 50, // Mock change via trendScore center
      });
    });
    return Object.values(sectors);
  }, [signals]);

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, change } = props;
    if (props.depth === 1) {
        const color = (change || 0) >= 0 ? '#10b981' : '#f43f5e';
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} style={{ fill: color, stroke: '#0f172a', strokeWidth: 2 }} />
                {width > 40 && (
                    <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize={12}>
                        {name}
                    </text>
                )}
            </g>
        );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <Treemap data={treeData} dataKey="size" aspectRatio={4/3} stroke="#fff" fill="#1e293b" content={<CustomContent />} />
        </ResponsiveContainer>
    </div>
  );
};
