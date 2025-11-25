
import type { EquityPoint } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';
import { formatCurrency } from '../../../shared/utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface Props {
  equity: number;
  cash: number;
  history?: EquityPoint[];
}

export function EquityCurve({ equity, cash, history }: Props) {
  const hasHistory = history && history.length > 1;

  return (
    <Card title="Equity & Cash">
      {hasHistory ? (
        <div style={{ width: '100%', height: 160 }}>
          <ResponsiveContainer minWidth={0} minHeight={0}>
            <AreaChart data={history}>
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
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(value: string) =>
                  new Date(value).toLocaleString('de-DE')
                }
              />
              <ReferenceLine
                y={history![history!.length - 1].value}
                stroke="#555"
                strokeDasharray="2 2"
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3dd68c"
                fill="rgba(61,214,140,0.25)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ marginBottom: 8 }}>Keine Equity-Historie verfügbar.</div>
      )}
      <div style={{ marginTop: 8, fontSize: 13 }}>
        <div>Equity: {formatCurrency(equity)}</div>
        <div>Cash: {formatCurrency(cash)}</div>
      </div>
    </Card>
  );
}
