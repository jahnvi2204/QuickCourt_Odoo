import { useState, useCallback } from 'react';

const API_BASE_URL = (import.meta?.env?.VITE_API_URL) || '';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (path, { method = 'GET', body, headers = {}, token } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        credentials: 'include',
      });
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : await res.text();
      if (!res.ok) throw new Error(data?.message || 'Request failed');
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error, API_BASE_URL };
}


