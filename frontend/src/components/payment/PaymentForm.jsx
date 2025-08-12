import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from '../common/Button.jsx';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK || '');

function InnerPaymentForm({ bookingId }) {
  const stripe = useStripe();
  const elements = useElements();
  const { request } = useApi();
  const { token } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const setupIntent = async () => {
      try {
        const res = await request('/api/payments/create-payment-intent', { method: 'POST', token, body: { bookingId } });
        setClientSecret(res.clientSecret);
      } catch (e) {
        setError(e.message || 'Failed to initialize payment');
      }
    };
    setupIntent();
  }, [request, token, bookingId]);

  const onPay = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!stripe || !elements || !clientSecret) return;
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });
      if (result.error) throw new Error(result.error.message);
      await request('/api/payments/confirm', { method: 'POST', token, body: { paymentIntentId: result.paymentIntent.id, bookingId } });
      alert('Payment successful');
    } catch (e) {
      setError(e.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onPay} className="space-y-3">
      <div className="p-3 rounded border border-gray-200/60 dark:border-white/10">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button disabled={!stripe || loading}>{loading ? 'Processing...' : 'Pay now'}</Button>
    </form>
  );
}

export default function PaymentForm({ bookingId }) {
  if (!stripePromise) return <div>Stripe not configured</div>;
  return (
    <Elements stripe={stripePromise}>
      <InnerPaymentForm bookingId={bookingId} />
    </Elements>
  );
}


