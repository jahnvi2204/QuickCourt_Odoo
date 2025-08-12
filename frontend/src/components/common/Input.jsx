import React from 'react';

export default function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-gray-300 bg-white/80 dark:bg-black/40 dark:border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-primary ${props.className || ''}`}
    />
  );
}


