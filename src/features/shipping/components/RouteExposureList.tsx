
import type { PortfolioSnapshot } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';

interface Props {
  portfolio: PortfolioSnapshot | null;
}

export function RouteExposureList({ portfolio }: Props) {
  return (
    <Card title="Portfolio-Exposure zu stressigen Routen">
      {portfolio ? (
        <div>
          Später: Mapping Instrument → Route → Exposure (aus Backend-Facts).
        </div>
      ) : (
        <div>Noch keine Portfolio-Daten geladen.</div>
      )}
    </Card>
  );
}
