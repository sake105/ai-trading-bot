
import type { PortfolioSnapshot } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';
import { formatPercent } from '../../../shared/utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  portfolio: PortfolioSnapshot;
}

export function SectorExposureChart({ portfolio }: Props) {
  const sectorWeights = portfolio.positions.reduce<Record<string, number>>(
    (acc, pos) => {
      const key = pos.instrument.sector ?? 'Other';
      acc[key] = (acc[key] ?? 0) + pos.weight;
      return acc;
    },
    {},
  );

  const data = Object.entries(sectorWeights).map(([sector, weight]) => ({
    sector,
    weightPct: weight * 100,
  }));

  return (
    <Card title="Sector Exposures">
      {data.length === 0 ? (
        <div>Keine Positionen.</div>
      ) : (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer minWidth={0} minHeight={0}>
            <BarChart data={data} layout="vertical">
              <XAxis
                type="number"
                tickFormatter={(v: number) => `${v.toFixed(0)}%`}
              />
              <YAxis
                type="category"
                dataKey="sector"
                tick={{ fontSize: 11 }}
                width={90}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                formatter={(value: number) => formatPercent(value / 100)}
              />
              <Bar dataKey="weightPct" fill="#7b5cff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
