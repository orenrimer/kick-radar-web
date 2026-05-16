/** Fallback when geolocation is denied or slow (Tel Aviv). */
export const DEFAULT_MAP_CENTER = { lat: 32.0853, lng: 34.7818 };

export const isValidMapCenter = (center) =>
  center &&
  typeof center.lat === 'number' &&
  typeof center.lng === 'number' &&
  !Number.isNaN(center.lat) &&
  !Number.isNaN(center.lng);
