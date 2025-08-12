import React from 'react';

export default function Header({ title, subtitle }) {
  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
    </div>
  );
}


