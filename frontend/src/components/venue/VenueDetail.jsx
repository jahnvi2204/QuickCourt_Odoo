import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';
import Card from '../common/Card';
import Button from '../common/Button.jsx';
import BookingForm from '../booking/BookingForm.jsx';
import ReviewForm from '../reviews/ReviewForm.jsx';
import ReviewList from '../reviews/ReviewList.jsx';

export default function VenueDetail() {
  const { id } = useParams();
  const { request } = useApi();
  const { token } = useAuth();
  const [facility, setFacility] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await request(`/api/facilities/${id}`);
        setFacility(data);
        // Optionally fetch reviews if you have endpoint
        // const r = await request(`/api/reviews?facility=${id}`);
        // setReviews(r.reviews);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, request]);

  const createBooking = async ({ date, startTime, endTime, duration }) => {
    setBookingLoading(true);
    try {
      const courtId = facility?.courts?.[0]?._id; // simple default
      const res = await request('/api/bookings', { method: 'POST', token, body: { facilityId: id, courtId, date, startTime, endTime, duration } });
      alert(`Booked ${res._id}`);
    } catch (e) {
      alert(e.message || 'Failed to book');
    } finally {
      setBookingLoading(false);
    }
  };

  const submitReview = async ({ rating, comment, photos }) => {
    try {
      // If you have upload API, upload photos here then send review
      const newReview = { rating, comment, createdAt: new Date().toISOString(), userName: 'You' };
      setReviews((r) => [newReview, ...r]);
    } catch (e) {
      alert('Failed to post review');
    }
  };

  if (loading || !facility) return <div className="container mx-auto px-4 py-10">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h1 className="text-2xl font-semibold">{facility.name}</h1>
          <p className="text-gray-600 dark:text-gray-300">{facility.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(facility.photos || []).map((src, i) => (<img key={i} src={src} alt="venue" className="w-full h-48 object-cover rounded" />))}
          </div>
        </div>
        <div>
          <Card>
            <h3 className="font-medium mb-2">Book a slot</h3>
            <BookingForm onSubmit={createBooking} />
            <Button className="mt-3" disabled={bookingLoading}>{bookingLoading ? 'Booking…' : 'Quick book (10–11)'}</Button>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-medium">Reviews</h3>
          <ReviewList reviews={reviews} />
        </div>
        <div>
          <h3 className="font-medium mb-2">Write a review</h3>
          <ReviewForm onSubmit={submitReview} />
        </div>
      </div>
    </div>
  );
}


