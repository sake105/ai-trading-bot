
import { Card } from '../../../shared/components/Card';
import type { PortfolioPosition } from '../../../types/domain';
import { formatPercent } from '../../../shared/utils/formatters';

interface Props {
  positions: PortfolioPosition[];
}

export function ExposureSummary({ positions }: Props) {
  const sectorWeights = positions.reduce<Record<string, number>>((acc, pos) => {
    const key = pos.instrument.sector ?? 'Other';
    acc[key] = (acc[key] ?? 0) + pos.weight;
    return acc;
  }, {});

  return (
    <Card title="Exposure by Sector">
      {Object.keys(sectorWeights).length === 0 && <div>Keine Positionen.</div>}
      {Object.entries(sectorWeights).map(([sector, w]) => (
        <div key={sector} className="row">
          <span>{sector}</span>
          <span>{formatPercent(w)}</span>
        </div>
      ))}
    </Card>
  );
}
