
import type { OrderPreview } from '../../../types/domain';
import { Button } from '../../../shared/components/Button';
import { Table } from '../../../shared/components/Table';
import { formatCurrency } from '../../../shared/utils/formatters';

interface Props {
  orders: OrderPreview[];
  processingId: string | null;
  onApprove(id: string): void;
  onReject(id: string): void;
}

export function OrdersTable({ orders, processingId, onApprove, onReject }: Props) {
  if (!orders.length) {
    return <div>Keine Orders für heute.</div>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Ticker</th>
          <th>Side</th>
          <th>Qty</th>
          <th>Preis</th>
          <th>Cost</th>
          <th>Kommentar</th>
          <th>Aktion</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => {
          const isProcessing = processingId === o.id;
          return (
            <tr key={o.id}>
              <td>{o.instrument.id}</td>
              <td>{o.side}</td>
              <td>{o.quantity}</td>
              <td>{o.limitPrice ?? 'MKT'}</td>
              <td>{formatCurrency(o.estimatedCost)}</td>
              <td>{o.comment}</td>
              <td>
                <Button onClick={() => onApprove(o.id)} disabled={isProcessing}>
                  Approve
                </Button>{' '}
                <Button
                  variant="secondary"
                  onClick={() => onReject(o.id)}
                  disabled={isProcessing}
                >
                  Reject
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
