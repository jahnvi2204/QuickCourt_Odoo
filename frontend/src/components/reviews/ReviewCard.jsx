import React from 'react';
import Card from '../common/Card';
import RatingStars from './RatingStars.jsx';

export default function ReviewCard({ review }) {
  const userName = review?.user?.fullName || review?.userName || 'Anonymous';
  const date = review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : '';
  const photos = Array.isArray(review?.photos) ? review.photos : [];
  const response = review?.response;

  return (
    <Card className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{userName}</div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>
        <RatingStars value={review?.rating || 0} readOnly />
      </div>

      {review?.comment && (
        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{review.comment}</div>
      )}

      {photos.length > 0 && (
        <div className="flex gap-2 mt-1 flex-wrap">
          {photos.map((src, i) => (
            <img key={i} src={src} alt="review" className="w-20 h-20 object-cover rounded" />
          ))}
        </div>
      )}

      {response?.text && (
        <div className="mt-3 p-3 rounded bg-gray-50 dark:bg-white/5 text-sm">
          <div className="font-medium mb-1">Owner response</div>
          <div className="text-gray-700 dark:text-gray-300">{response.text}</div>
          {response.respondedAt && (
            <div className="text-xs text-gray-500 mt-1">{new Date(response.respondedAt).toLocaleString()}</div>
          )}
        </div>
      )}
    </Card>
  );
}


