import React, { useEffect, useMemo, useState } from 'react';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';
import Button from '../components/common/Button.jsx';
import Skeleton from '../components/common/Skeleton';

const presets = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];

export default function Dashboard() {
  const { request } = useApi();
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState(presets[30 ? 1 : 0]);

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    const days = range?.days || 30;
    start.setDate(end.getDate() - (days - 1));
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  }, [range]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const analytics = await request(`/api/admin/analytics?${params.toString()}`, { token });
      setData(analytics);
    } catch (e) {
      setError(e.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  if (loading && !data) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="flex gap-2 items-center">
          {presets.map((p) => (
            <Button
              key={p.label}
              variant={range.label === p.label ? 'primary' : 'outline'}
              onClick={() => setRange(p)}
            >
              {p.label}
            </Button>
          ))}
          <Button variant="outline" onClick={fetchAnalytics}>Refresh</Button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="Users" value={data?.summary?.totalUsers ?? 0} />
        <Stat title="Facilities" value={data?.summary?.totalFacilities ?? 0} />
        <Stat title="Bookings" value={data?.summary?.totalBookings ?? 0} />
        <Stat title="Revenue" value={`$${(data?.summary?.totalRevenue ?? 0).toLocaleString()}`} />
      </div>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-medium mb-2">User Growth</h3>
          <LineChart data={normalizeMonthly(data?.trends?.userGrowth)} color="#7C3AED" />
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Bookings (count) and Revenue</h3>
          <BarComboChart data={normalizeDaily(data?.trends?.bookingTrends)} barColor="#7C3AED" lineColor="#22C55E" />
        </Card>
      </div>

      {/* Top Facilities */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Top Facilities</h3>
          <Button variant="outline" onClick={() => exportCSV(data?.topFacilities || [])}>Export CSV</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200/60 dark:border-white/10">
                <th className="py-2">Facility</th>
                <th className="py-2">Bookings</th>
                <th className="py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topFacilities || []).map((r) => {
                const facility = Array.isArray(r.facility) ? r.facility[0] : r.facility;
                return (
                  <tr key={r._id} className="border-b border-gray-100 dark:border-white/5">
                    <td className="py-2">{facility?.name || r._id}</td>
                    <td className="py-2">{r.bookings?.toLocaleString?.() ?? r.bookings}</td>
                    <td className="py-2 font-medium">${(r.revenue || 0).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <Card>
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </Card>
  );
}

// Helpers to normalize data from API
function normalizeMonthly(rows = []) {
  // Convert {_id:{year,month}, count} to [{x: Date, y: count}]
  return rows.map((r) => ({
    x: new Date(r._id.year, (r._id.month || 1) - 1, 1),
    y: r.count || 0,
  }));
}

function normalizeDaily(rows = []) {
  // Convert {_id:{year,month,day}, count, revenue}
  return rows.map((r) => ({
    x: new Date(r._id.year, (r._id.month || 1) - 1, r._id.day || 1),
    count: r.count || 0,
    revenue: r.revenue || 0,
  }));
}

// Simple SVG line chart
function LineChart({ data = [], color = '#7C3AED', height = 200 }) {
  const width = 600;
  const padding = 30;
  if (!data.length) return <div className="text-sm text-gray-500">No data</div>;
  const xs = data.map((d) => d.x.getTime());
  const ys = data.map((d) => d.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMax = Math.max(1, ...ys);
  const scaleX = (t) => padding + ((t - xMin) / (xMax - xMin || 1)) * (width - padding * 2);
  const scaleY = (v) => height - padding - (v / yMax) * (height - padding * 2);
  const dAttr = data.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(pt.x.getTime())} ${scaleY(pt.y)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <path d={dAttr} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// Simple bar+line combo chart
function BarComboChart({ data = [], barColor = '#7C3AED', lineColor = '#22C55E', height = 220 }) {
  const width = 600;
  const padding = 30;
  if (!data.length) return <div className="text-sm text-gray-500">No data</div>;
  const xs = data.map((d) => d.x.getTime());
  const counts = data.map((d) => d.count);
  const revenues = data.map((d) => d.revenue);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const maxCount = Math.max(1, ...counts);
  const maxRevenue = Math.max(1, ...revenues);
  const scaleX = (t) => padding + ((t - xMin) / (xMax - xMin || 1)) * (width - padding * 2);
  const scaleYCount = (v) => height - padding - (v / maxCount) * (height - padding * 2);
  const scaleYRevenue = (v) => height - padding - (v / maxRevenue) * (height - padding * 2);
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.x.getTime())} ${scaleYRevenue(d.revenue)}`).join(' ');
  const barWidth = (width - padding * 2) / data.length / 2;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      {data.map((d, i) => (
        <rect key={i} x={scaleX(d.x.getTime()) - barWidth / 2} y={scaleYCount(d.count)} width={barWidth} height={height - padding - scaleYCount(d.count)} fill={barColor} opacity="0.8" />
      ))}
      <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" />
    </svg>
  );
}

function exportCSV(rows) {
  const header = ['facilityId', 'facilityName', 'bookings', 'revenue'];
  const lines = [header.join(',')];
  rows.forEach((r) => {
    const f = Array.isArray(r.facility) ? r.facility[0] : r.facility;
    lines.push([r._id, (f?.name || ''), r.bookings || 0, r.revenue || 0].join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'top-facilities.csv';
  a.click();
  URL.revokeObjectURL(url);
}


