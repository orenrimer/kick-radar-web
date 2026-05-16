const backendUrl =
  import.meta.env.VITE_BACKEND_URL || '/api';

const wsFromBackend = () => {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  if (backendUrl.startsWith('http')) {
    return backendUrl.replace(/^http/, 'ws').replace(/\/api\/?$/, '');
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.hostname}:5000`;
};

export const env = {
  backendUrl,
  staticUrl:
    import.meta.env.VITE_STATIC_URL ||
    'https://kick-radar-uploads.s3.us-east-1.amazonaws.com',
  googleApiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  /** OAuth 2.0 Web client ID (not the Maps API key) */
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  wsUrl: wsFromBackend(),
};
