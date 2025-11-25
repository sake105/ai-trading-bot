
import type { Event } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';
import { Table } from '../../../shared/components/Table';
import { formatDateTime } from '../../../shared/utils/dates';

interface Props {
  events: Event[];
}

export function CongressTradesTable({ events }: Props) {
  const trades = events.filter((ev) => ev.type === 'CONGRESS_TRADE');

  return (
    <Card title="Letzte Congress Trades">
      {!trades.length && <div>Keine Congress-Trades.</div>}
      {!!trades.length && (
        <Table>
          <thead>
            <tr>
              <th>Zeit</th>
              <th>Politiker</th>
              <th>Ticker</th>
              <th>Sektor</th>
              <th>Quelle</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((ev) => (
              <tr key={ev.id}>
                <td>{formatDateTime(ev.timestampEffective)}</td>
                <td>{ev.politicians.join(', ')}</td>
                <td>{ev.tickers.join(', ')}</td>
                <td>{ev.sectors.join(', ')}</td>
                <td>{ev.source}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
