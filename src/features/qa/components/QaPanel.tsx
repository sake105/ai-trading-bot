
import type { QaStatus } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';

interface Props {
  qa: QaStatus;
}

export function QaPanel({ qa }: Props) {
  const statusColor =
    qa.canTradeToday && qa.dataOk && qa.leakageRisk === 'OK' && qa.modelDrift === 'OK'
      ? 'green'
      : qa.leakageRisk === 'BLOCK' || qa.modelDrift === 'BLOCK'
      ? 'red'
      : 'yellow';

  return (
    <Card title="QA Status">
      <div>Data OK: {qa.dataOk ? 'Ja' : 'Nein'}</div>
      <div>Leakage: {qa.leakageRisk}</div>
      <div>Model Drift: {qa.modelDrift}</div>
      <div>Current MaxDD: {qa.currentMaxDrawdown.toFixed(2)}</div>
      <div>Last Backtest Sharpe: {qa.lastBacktestSharpe.toFixed(2)}</div>
      <div>Last Backtest MaxDD: {qa.lastBacktestMaxDrawdown.toFixed(2)}</div>
      <div style={{ marginTop: 8 }}>
        Trade heute möglich?{' '}
        <Badge
          color={statusColor as any}
          label={qa.canTradeToday ? 'JA' : 'NEIN'}
        />
      </div>
    </Card>
  );
}
