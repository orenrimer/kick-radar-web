import { useState, useCallback, useRef, useEffect } from 'react';
import { apiRequest, ApiError } from '../../../api/client';

const toPath = (urlOrPath) => {
  if (urlOrPath.startsWith('http')) {
    const pathname = new URL(urlOrPath).pathname;
    return pathname.replace(/^\/api/, '') || pathname;
  }
  if (urlOrPath.includes('/api/')) {
    return urlOrPath.slice(urlOrPath.indexOf('/api/') + 4);
  }
  return urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
};

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (urlOrPath, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const path = toPath(urlOrPath);
        const authHeader = headers.Authorization || headers.authorization;
        const token = authHeader?.replace(/^Bearer\s+/i, '');

        let requestBody = body;
        if (typeof body === 'string') {
          try {
            requestBody = JSON.parse(body);
          } catch {
            requestBody = body;
          }
        }

        const responseData = await apiRequest(path, {
          method,
          body: requestBody,
          token,
          signal: httpAbortCtrl.signal,
        });

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        setIsLoading(false);
        return responseData;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : err.message;
        setError(message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
