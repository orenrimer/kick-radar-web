import { useEffect, useState, useCallback } from 'react';

import { DEFAULT_MAP_CENTER } from '../../../config/mapDefaults';

const haversineKm = (a, b) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

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

  const distanceTo = useCallback(
    (coords) => (coords ? haversineKm(position, coords) : Infinity),
    [position]
  );

  return { position, status, distanceTo };
}
