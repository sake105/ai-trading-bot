
import type { Event } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';
import { formatDateTime } from '../../../shared/utils/dates';

interface Props {
  events: Event[];
}

export function EventsTimeline({ events }: Props) {
  return (
    <Card title="Events Timeline">
      {events.length === 0 && <div>Keine Events.</div>}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {events.map((ev) => (
          <li key={ev.id} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 12, color: '#9ba4c4' }}>
              {formatDateTime(ev.timestampSource)} · {ev.type} · {ev.source}
            </div>
            <div>
              {ev.metadata?.rawHeadline ?? ev.metadata?.url ?? '(kein Titel)'}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
