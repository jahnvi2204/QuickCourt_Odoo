import { useEffect, useState } from 'react';

export default function useGeolocation(options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setError(new Error('Geolocation not supported'));
      return undefined;
    }

    const onSuccess = (pos) => setPosition({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
    });
    const onError = (err) => setError(err);
    const watcher = navigator.geolocation.watchPosition(onSuccess, onError, options);
    return () => navigator.geolocation.clearWatch(watcher);
  }, [options]);

  return { position, error };
}


