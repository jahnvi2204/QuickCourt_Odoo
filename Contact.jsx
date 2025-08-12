import React, { useMemo, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input';
import useApi from '../hooks/useApi';

export default function Contact() {
  const { request } = useApi();
  const [form, setForm] = useState({ name: '', email: '', subject: '', category: 'support', message: '', attachment: null });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target?.files ? e.target.files[0] : e.target.value }));

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email || ''), [form.email]);
  const nameValid = useMemo(() => (form.name || '').trim().length >= 2, [form.name]);
  const messageValid = useMemo(() => (form.message || '').trim().length >= 10, [form.message]);
  const canSubmit = nameValid && emailValid && messageValid && !loading;

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) { setError('Please fill all required fields.'); return; }
    setLoading(true); setError('');
    try {
      // Try backend endpoint if available
      const body = { name: form.name, email: form.email, subject: form.subject, category: form.category, message: form.message };
      try {
        await request('/api/support/contact', { method: 'POST', body });
        setSent(true);
      } catch {
        // Fallback to mailto
        const mailto = `mailto:support@quickcourt.test?subject=${encodeURIComponent(form.subject || 'Contact')}&body=${encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`)}`;
        window.location.href = mailto;
        setSent(true);
      }
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <Card>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Your name" value={form.name} onChange={update('name')} />
            <Input type="email" placeholder="Your email" value={form.email} onChange={update('email')} />
          </div>
          <Input placeholder="Subject (optional)" value={form.subject} onChange={update('subject')} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="border rounded px-3 py-2" value={form.category} onChange={update('category')}>
              <option value="support">Support</option>
              <option value="feedback">Feedback</option>
              <option value="partnership">Partnership</option>
            </select>
            <input type="file" className="border rounded px-3 py-2" onChange={update('attachment')} />
            <div className="text-xs text-gray-500 self-center">Max 5MB</div>
          </div>
          <textarea className="w-full border rounded p-2" rows={5} placeholder="Message" value={form.message} onChange={update('message')} />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>{(form.message || '').length} / 1000</div>
            {!nameValid && <span className="text-red-600">Name too short</span>}
            {!emailValid && <span className="text-red-600">Invalid email</span>}
            {!messageValid && <span className="text-red-600">Message too short</span>}
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <Button type="submit" disabled={!canSubmit}>{loading ? 'Sending…' : 'Send message'}</Button>
        </form>
        {sent && <div className="text-sm text-green-600 mt-2">Thanks! We'll get back to you soon.</div>}
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-medium mb-1">Office</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">123 Sports Ave, Metropolis</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Email: support@quickcourt.test</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Phone: +1 555 123 4567</div>
        </Card>
        <Card>
          <h3 className="font-medium mb-2">Map</h3>
          <div className="rounded overflow-hidden">
            <iframe title="map" src="https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
          </div>
        </Card>
      </div>
    </div>
  );
}


