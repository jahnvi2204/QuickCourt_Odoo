import React, { useState } from 'react';
import Button from '../common/Button.jsx';
import useApi from '../../hooks/useApi';
import useAuth from '../../hooks/useAuth';

export default function RefundModal({ open, onClose, payment }) {
  const { request } = useApi();
  const { token } = useAuth();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Assuming a refund endpoint exists; if not, keep as a placeholder
      await request('/api/payments/refund', { method: 'POST', token, body: { paymentIntentId: payment?.paymentIntentId, reason } });
      alert('Refund requested');
      onClose?.();
    } catch (e) {
      setError(e.message || 'Refund failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-black rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Request Refund</h3>
          <button onClick={onClose} className="text-sm">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div className="text-sm text-gray-600">Payment: {payment?.paymentIntentId}</div>
          <textarea className="w-full border rounded p-2" rows={4} placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}


