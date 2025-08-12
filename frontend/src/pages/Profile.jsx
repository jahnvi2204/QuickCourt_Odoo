import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import useAuth from '../hooks/useAuth';
import Card from '../components/common/Card';

export default function Profile() {
  const { request } = useApi();
  const { token, user, setUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName || '', phone: user.phone || '', avatar: user.avatar || '' });
  }, [user]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let avatarUrl = form.avatar;
      if (avatarFile) {
        const fd = new FormData();
        fd.append('image', avatarFile);
        const res = await fetch('/api/upload/image', { method: 'POST', body: fd });
        const json = await res.json();
        avatarUrl = json.url || avatarUrl;
      }
      const data = await request('/api/users/me', { method: 'PUT', token, body: { ...form, avatar: avatarUrl } });
      setUser(data.user);
      alert('Profile updated');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">My Profile</h1>
      <Card>
        <div className="flex items-center gap-4">
          <img src={form.avatar || 'https://via.placeholder.com/80'} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          <div>
            <div className="text-sm text-gray-600">Change avatar</div>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
          </div>
        </div>
      </Card>
      <form onSubmit={onSave} className="space-y-4">
        <input className="w-full border p-2 rounded" placeholder="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="w-full border p-2 rounded" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}


