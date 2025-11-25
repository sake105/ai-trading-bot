
import type { RiskMetrics } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';
import { formatPercent } from '../../../shared/utils/formatters';

interface Props {
  risk: RiskMetrics;
}

export function RiskSummary({ risk }: Props) {
  return (
    <Card title="Risk Summary">
      <div>Volatility (ann.): {formatPercent(risk.volatilityAnn)}</div>
      <div>Max Drawdown: {formatPercent(risk.maxDrawdown)}</div>
      <div>VaR 95%: {formatPercent(risk.var95)}</div>
      <div>CVaR 95%: {formatPercent(risk.cvar95)}</div>
      <div>Gross Exposure: {formatPercent(risk.grossExposure)}</div>
      <div>Net Exposure: {formatPercent(risk.netExposure)}</div>
      <div>Turnover (1D): {formatPercent(risk.turnover1D)}</div>
    </Card>
  );
}
