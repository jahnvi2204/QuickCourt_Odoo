import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ value = 0, onChange, size = 18, readOnly = false, max = 5, className = '' }) {
  const [hover, setHover] = useState(0);
  const stars = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);
  const active = hover || value;

  return (
    <div className={`flex items-center gap-1 ${className}`} onMouseLeave={() => setHover(0)}>
      {stars.map((i) => (
        <button
          key={i}
          type="button"
          className={readOnly ? 'pointer-events-none' : ''}
          onMouseEnter={() => !readOnly && setHover(i)}
          onClick={() => !readOnly && onChange?.(i)}
          aria-label={`Rate ${i}`}
        >
          <Star
            width={size}
            height={size}
            className={i <= active ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}


