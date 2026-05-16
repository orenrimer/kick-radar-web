import { useEffect, useRef, useState, useContext, createElement } from 'react';
import { env } from '../../../config/env';
import { loginWithGoogle } from '../../../api/users';
import AuthContext from '../contexts/AuthContext';

const GoogleSignInButton = ({ onSuccess, onError }) => {
  const buttonRef = useRef(null);
  const [loadError, setLoadError] = useState(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!env.googleClientId) {
      setLoadError('Google Sign-In is not configured (VITE_GOOGLE_CLIENT_ID).');
      return;
    }

    const handleCredential = async (response) => {
      try {
        const data = await loginWithGoogle(response.credential);
        auth.login(data.userId, data.token);
        onSuccess?.();
      } catch (err) {
        onError?.(err.message || 'Google sign-in failed.');
      }
    };

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: env.googleClientId,
        callback: handleCredential,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        width: buttonRef.current.offsetWidth || 320,
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return undefined;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => setLoadError('Failed to load Google Sign-In.');
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [auth, onSuccess, onError]);

  if (loadError) {
    return <p className="auth-google-error">{loadError}</p>;
  }

  return createElement('div', {
    ref: buttonRef,
    className: 'google-signin-button',
  });
};

export default GoogleSignInButton;
