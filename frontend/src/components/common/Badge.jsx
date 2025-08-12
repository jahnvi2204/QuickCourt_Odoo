import React from 'react';

export default function Badge({ children, className = '' }) {
  return <span className={`text-xs px-2 py-1 rounded-full bg-primary/10 text-primary ${className}`}>{children}</span>;
}


