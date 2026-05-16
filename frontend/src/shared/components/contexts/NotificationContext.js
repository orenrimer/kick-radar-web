import React, { useContext, createContext, useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import AuthContext from '../contexts/AuthContext';
import { fetchHostRequests } from '../../../api/requests';
import { env } from '../../../config/env';
import { eventKeys } from '../../../queries/events';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = useCallback(async () => {
    if (!auth.userId) return;
    try {
      const resp = await fetchHostRequests(auth.userId);
      setNotifications(resp);
    } catch {
      /* ignore */
    }
  }, [auth.userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!auth.userId) return;

    const ws = new WebSocket(env.wsUrl);

    ws.onmessage = () => {
      fetchNotifications();
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      if (auth.userId) {
        queryClient.invalidateQueries({ queryKey: eventKeys.user(auth.userId) });
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [auth.userId, fetchNotifications, queryClient]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
