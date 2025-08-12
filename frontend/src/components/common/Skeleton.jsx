import React from 'react';

export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-white/10 ${className}`} />;
}


