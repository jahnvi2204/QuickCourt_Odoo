import React, { useEffect, useMemo, useState } from 'react';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button.jsx';

export default function Analytics() {
  const { request } = useApi();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (range - 1));
    return { startDate: start.toISOString().slice(0,10), endDate: end.toISOString().slice(0,10) };
  }, [range]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const res = await request(`/api/admin/analytics?${params.toString()}`, { token });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [startDate, endDate]);

  return (
    <div className="container mx-auto px-4 py-10 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <div className="flex gap-2">
          {[7,30,90].map((d) => (
            <Button key={d} variant={range===d ? 'primary' : 'outline'} onClick={() => setRange(d)}>{`Last ${d}d`}</Button>
          ))}
          <Button variant="outline" onClick={fetchData}>Refresh</Button>
        </div>
      </div>
      {!data || loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><div className="text-gray-500 text-sm">Users</div><div className="text-xl font-semibold">{data.summary.totalUsers}</div></Card>
            <Card><div className="text-gray-500 text-sm">Facilities</div><div className="text-xl font-semibold">{data.summary.totalFacilities}</div></Card>
            <Card><div className="text-gray-500 text-sm">Bookings</div><div className="text-xl font-semibold">{data.summary.totalBookings}</div></Card>
            <Card><div className="text-gray-500 text-sm">Revenue</div><div className="text-xl font-semibold">${data.summary.totalRevenue}</div></Card>
          </div>
        </>
      )}
    </div>
  );
}


