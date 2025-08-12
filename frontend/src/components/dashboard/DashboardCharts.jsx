import React from 'react';

export function MiniArea({ data = [], color = '#7C3AED', height = 80 }) {
  if (!data.length) return <div className="text-xs text-gray-500">No data</div>;
  const width = 200; const pad = 10;
  const xs = data.map((d, i) => i); const ys = data.map((d) => d);
  const xMax = Math.max(1, ...xs); const yMax = Math.max(1, ...ys);
  const sx = (x) => pad + (x / (xMax || 1)) * (width - pad * 2);
  const sy = (y) => height - pad - (y / yMax) * (height - pad * 2);
  const path = data.map((y, i) => `${i === 0 ? 'M' : 'L'} ${sx(i)} ${sy(y)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}


