import React from 'react';

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const variants = {
    primary: 'btn-primary',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'text-gray-700 dark:text-gray-300 hover:text-primary',
  };
  return (
    <button className={`${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}


