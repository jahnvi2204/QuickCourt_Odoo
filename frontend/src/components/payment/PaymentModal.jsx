import React from 'react';
import PaymentForm from './PaymentForm.jsx';

export default function PaymentModal({ open, onClose, bookingId }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Complete Payment</h3>
          <button onClick={onClose} className="text-sm">✕</button>
        </div>
        <PaymentForm bookingId={bookingId} />
      </div>
    </div>
  );
}


