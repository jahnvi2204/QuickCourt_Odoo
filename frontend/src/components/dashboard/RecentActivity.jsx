import React from 'react';
import Card from '../common/Card';

export default function RecentActivity({ items = [] }) {
  if (!items.length) return <Card>No recent activity.</Card>;
  return (
    <Card>
      <h3 className="font-medium mb-2">Recent Activity</h3>
      <ul className="text-sm space-y-2">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span>{i.title || i.message}</span>
            <span className="text-gray-500">{new Date(i.createdAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}


