
import { Card } from '../../../shared/components/Card';
import { formatCurrency } from '../../../shared/utils/formatters';
import type { PnlPoint } from '../../../types/domain';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface Props {
  history?: PnlPoint[];
  pnl1D: number;
  pnlYtd: number;
}

export function PnLChart({ history, pnl1D, pnlYtd }: Props) {
  const hasHistory = history && history.length > 1;

  return (
    <Card title="PnL">
      {hasHistory ? (
        <div style={{ width: '100%', height: 160 }}>
          <ResponsiveContainer minWidth={0} minHeight={0}>
            <LineChart data={history}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value: string) =>
                  new Date(value).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                  })
                }
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickFormatter={(v: number) => `${(v/1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(value: string) =>
                  new Date(value).toLocaleString('de-DE')
                }
              />
              <ReferenceLine y={0} stroke="#555" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7b5cff"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ marginBottom: 8 }}>Keine PnL-Historie verfügbar.</div>
      )}
      <div style={{ marginTop: 8, fontSize: 13 }}>
        <div>Heute: {formatCurrency(pnl1D)}</div>
        <div>YTD: {formatCurrency(pnlYtd)}</div>
      </div>
    </Card>
  );
}
