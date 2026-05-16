import { env } from '../config/env';

let loadPromise;

export function loadGoogleMaps() {
  if (window.google?.maps?.importLibrary) {
    return Promise.resolve(window.google.maps);
  }

  if (!env.googleApiKey) {
    return Promise.reject(
      new Error('VITE_GOOGLE_API_KEY is not set — add it to frontend/.env.local')
    );
  }

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-kick-radar-maps]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google.maps));
        existing.addEventListener('error', () =>
          reject(new Error('Failed to load Google Maps'))
        );
        return;
      }

      const script = document.createElement('script');
      script.dataset.kickRadarMaps = 'true';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.googleApiKey}&loading=async`;
      script.async = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject(new Error('Failed to load Google Maps'));
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}
