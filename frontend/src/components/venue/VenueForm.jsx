import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button.jsx';

export default function VenueForm({ initial = {}, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    city: initial.address?.city || '',
    sportTypes: initial.sportTypes?.join(', ') || '',
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      address: { city: form.city },
      sportTypes: form.sportTypes.split(',').map((s) => s.trim()).filter(Boolean),
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <Input placeholder="Venue name" value={form.name} onChange={update('name')} />
      <textarea className="w-full border rounded p-2" rows={3} placeholder="Description" value={form.description} onChange={update('description')} />
      <Input placeholder="City" value={form.city} onChange={update('city')} />
      <Input placeholder="Sports (comma separated)" value={form.sportTypes} onChange={update('sportTypes')} />
      <div className="flex justify-end">
        <Button disabled={submitting}>{submitting ? 'Saving…' : 'Save venue'}</Button>
      </div>
    </form>
  );
}


