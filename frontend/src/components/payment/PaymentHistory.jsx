import React, { useMemo, useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge';

const StatusBadge = ({ status }) => (
  <Badge className={
    status === 'succeeded' || status === 'paid' ? 'bg-green-100 text-green-700' :
    status === 'failed' ? 'bg-red-100 text-red-700' :
    status === 'refunded' ? 'bg-yellow-100 text-yellow-700' : ''
  }>
    {status}
  </Badge>
);

export default function PaymentHistory({ items = [], onRefund }) {
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((p) => (p.status || '').toLowerCase() === filter);
  }, [items, filter]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">Payment History</div>
        <div className="flex gap-2 items-center">
          <select className="border rounded px-2 py-1 text-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200/60 dark:border-white/10">
              <th className="py-2">Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
              <th className="py-2">Provider</th>
              <th className="py-2">PaymentIntent</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p._id || p.paymentIntentId} className="border-b border-gray-100 dark:border-white/5">
                <td className="py-2">{new Date(p.createdAt || Date.now()).toLocaleString()}</td>
                <td className="py-2 font-medium">${(p.amount || 0).toFixed?.(2) ?? p.amount}</td>
                <td className="py-2"><StatusBadge status={p.status || p.providerStatus} /></td>
                <td className="py-2">{p.provider || 'stripe'}</td>
                <td className="py-2 truncate max-w-[200px]" title={p.paymentIntentId}>{p.paymentIntentId}</td>
                <td className="py-2 text-right">
                  {(p.status === 'succeeded' || p.status === 'paid') && (
                    <Button variant="outline" onClick={() => onRefund?.(p)}>Request refund</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


