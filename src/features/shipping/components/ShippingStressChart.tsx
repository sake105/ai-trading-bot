
import type { Event } from '../../../types/domain';
import { Card } from '../../../shared/components/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  events: Event[];
}

export function ShippingStressChart({ events }: Props) {
  const shippingEvents = events.filter((ev) => ev.type === 'SHIPPING');

  const routeCounts = shippingEvents.reduce<Record<string, number>>(
    (acc, ev) => {
      for (const route of ev.routes) {
        acc[route] = (acc[route] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );

  const data = Object.entries(routeCounts).map(([route, count]) => ({
    route,
    count,
  }));

  return (
    <Card title="Routen-Stress-Indizes (Proxy)">
      {data.length === 0 ? (
        <div>Keine Shipping-Events.</div>
      ) : (
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer minWidth={0} minHeight={0}>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="route"
                tick={{ fontSize: 11 }}
                width={90}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#ffb020" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
