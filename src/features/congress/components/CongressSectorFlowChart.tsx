
import type { Event } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';

interface Props {
  events: Event[];
}

export function CongressSectorFlowChart({ events }: Props) {
  const trades = events.filter((ev) => ev.type === 'CONGRESS_TRADE');
  const sectorCounts = trades.reduce<Record<string, number>>((acc, ev) => {
    for (const sector of ev.sectors) {
      acc[sector] = (acc[sector] ?? 0) + 1;
    }
    return acc;
  }, {});

  return (
    <Card title="Sektoren mit hohem Politiker-Flow">
      {Object.keys(sectorCounts).length === 0 && <div>Keine Daten.</div>}
      {Object.entries(sectorCounts).map(([sector, count]) => (
        <div key={sector}>
          {sector}: {count} Trades
        </div>
      ))}
    </Card>
  );
}
