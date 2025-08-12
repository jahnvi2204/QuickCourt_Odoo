import React, { useState } from 'react';
import RatingStars from './RatingStars.jsx';
import Button from '../common/Button.jsx';

export default function ReviewForm({ onSubmit, submitting }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setPhotos(files);
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ rating, comment, photos });
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <div>
        <div className="text-sm text-gray-600 mb-1">Your rating</div>
        <RatingStars value={rating} onChange={setRating} />
      </div>
      <div>
        <textarea className="w-full border rounded p-2" rows={4} placeholder="Share your experience" value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div>
        <input type="file" accept="image/*" multiple onChange={handleFiles} />
      </div>
      <div className="flex justify-end">
        <Button disabled={submitting}>{submitting ? 'Submitting...' : 'Post review'}</Button>
      </div>
    </form>
  );
}


