import React from 'react';
import ReviewCard from './ReviewCard.jsx';

export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) return <div className="text-sm text-gray-500">No reviews yet.</div>;
  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <ReviewCard key={r._id || r.id} review={r} />
      ))}
    </div>
  );
}


