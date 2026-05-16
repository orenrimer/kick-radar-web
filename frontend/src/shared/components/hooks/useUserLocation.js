import { useEffect, useState } from 'react';

import { DEFAULT_MAP_CENTER } from '../../../config/mapDefaults';

// Returns the user's current geolocation, falling back to DEFAULT_MAP_CENTER
// while loading, when permission is denied, or when geolocation is unavailable.
// `status` lets callers distinguish "we have the user's real position" from
// "we're showing the default".
//   status: 'pending' | 'granted' | 'denied' | 'unsupported'
export function useUserLocation({ timeout = 10000, maximumAge = 300000 } = {}) {
  const [position, setPosition] = useState(DEFAULT_MAP_CENTER);
  const [status, setStatus] = useState(() =>
    'geolocation' in navigator ? 'pending' : 'unsupported'
  );

  useEffect(() => {
    if (!('geolocation' in navigator)) return;

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (geo) => {
        if (cancelled) return;
        setPosition({ lat: geo.coords.latitude, lng: geo.coords.longitude });
        setStatus('granted');
      },
      () => {
        if (cancelled) return;
        setStatus('denied');
      },
      { enableHighAccuracy: false, timeout, maximumAge }
    );

    return () => {
      cancelled = true;
    };
  }, [timeout, maximumAge]);

  return { position, status };
}
