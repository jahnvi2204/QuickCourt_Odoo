import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';

export default function Register() {
  const { request } = useApi();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [avatarFile, setAvatarFile] = useState(null);

  const submitRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let avatarUrl = '';
      if (avatarFile) {
        const fd = new FormData();
        fd.append('image', avatarFile);
        const res = await fetch('/api/upload/image', { method: 'POST', body: fd });
        const json = await res.json();
        avatarUrl = json.url || '';
      }
      const data = await request('/api/auth/register', { method: 'POST', body: { fullName, email, password, avatar: avatarUrl } });
      setUserId(data.userId);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const submitVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await request('/api/auth/verify-otp', { method: 'POST', body: { userId, otpCode: otp } });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Register</h1>
      {step === 1 ? (
        <form onSubmit={submitRegister} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input className="w-full border p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div>
            <label className="text-sm text-gray-600">Avatar (optional)</label>
            <input className="w-full border p-2 rounded" type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Submitting...' : 'Create Account'}</button>
        </form>
      ) : (
        <form onSubmit={submitVerify} className="space-y-4">
          <input className="w-full border p-2 rounded tracking-widest text-center" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
      )}
    </div>
  );
}


