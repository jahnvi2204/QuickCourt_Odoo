import React, { useEffect, useMemo, useState } from 'react';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button.jsx';

export default function Bookings() {
  const { request } = useApi();
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (status) qs.set('status', status);
        const data = await request(`/api/bookings/my-bookings?${qs.toString()}`, { token });
        setItems(data.bookings || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [request, token, status]);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm text-gray-600">Filter</label>
        <select className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      {loading ? 'Loading...' : (
        <div className="grid gap-3">
          {items.map((b) => (
            <Card key={b._id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{b.facility?.name}</div>
                  <div className="text-sm text-gray-600">{new Date(b.date).toLocaleDateString()} • {b.startTime}-{b.endTime} • ${b.totalAmount}</div>
                  <div className="text-xs mt-1">Status: {b.status}</div>
                </div>
                {/* Actions like cancel could go here */}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


