import React, { useState, useContext, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import AuthContext from '../../shared/components/contexts/AuthContext';
import NearbyEvents from '../components/NearbyEvents';
import Sidebar from '../../shared/components/nevigation/Sidebar';
import { useAllEvents, useUserEvents, eventKeys } from '../../queries/events';
import { useUserLocation } from '../../shared/components/hooks/useUserLocation';

import './Home.css';

const NEARBY_RADIUS_KM = 250;

const EMPTY_USER_EVENTS = {
  hostedEvents: [],
  participatedEvents: [],
  requestedEvents: [],
};

const Home = () => {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { position } = useUserLocation();

  // Build the geo filter once per position change. The query key includes
  // this object, so equivalent { lat, lng, radiusKm } objects share a cache
  // entry and changing radius/position triggers a refetch.
  const near = useMemo(
    () => ({
      lat: position.lat,
      lng: position.lng,
      radiusKm: NEARBY_RADIUS_KM,
    }),
    [position.lat, position.lng]
  );

  const { data: allEventsData } = useAllEvents(auth.token, near);
  const { data: userEventsData } = useUserEvents(auth.userId, auth.token);

  const renderedEvents = useMemo(() => {
    switch (selectedCategory) {
      case 'hosted':
        return userEventsData?.hostedEvents ?? [];
      case 'participated':
        return userEventsData?.participatedEvents ?? [];
      case 'requested':
        return userEventsData?.requestedEvents ?? [];
      default:
        return allEventsData?.events ?? [];
    }
  }, [selectedCategory, allEventsData, userEventsData]);

  const handleEventDelete = (eventId) => {
    queryClient.setQueryData(eventKeys.all(near), (old) =>
      old
        ? { ...old, events: (old.events || []).filter((e) => e.id !== eventId) }
        : old
    );
    if (auth.userId) {
      queryClient.setQueryData(eventKeys.user(auth.userId), (old) => {
        const base = old ?? EMPTY_USER_EVENTS;
        return {
          hostedEvents: base.hostedEvents.filter((e) => e.id !== eventId),
          participatedEvents: base.participatedEvents.filter(
            (e) => e.id !== eventId
          ),
          requestedEvents: base.requestedEvents.filter(
            (e) => e.id !== eventId && e._id !== eventId
          ),
        };
      });
    }
  };

  const handleJoinRequestUpdate = (event) => {
    if (!auth.userId) return;
    queryClient.setQueryData(eventKeys.user(auth.userId), (old) => {
      const base = old ?? EMPTY_USER_EVENTS;
      return {
        ...base,
        requestedEvents: [...base.requestedEvents, event],
      };
    });
  };

  const handleCancelJoinRequest = (eventId) => {
    if (!auth.userId) return;
    queryClient.setQueryData(eventKeys.user(auth.userId), (old) => {
      const base = old ?? EMPTY_USER_EVENTS;
      return {
        ...base,
        requestedEvents: base.requestedEvents.filter(
          (e) => e._id !== eventId && e.id !== eventId
        ),
      };
    });
  };

  const handleCancelParticipation = () => {};

  return (
    <div className="home-container">
      <div className="sidebar-container">
        <Sidebar onCatgoryChange={setSelectedCategory} />
      </div>
      <div className="home-container-right">
        <div className="nearby-places-container">
          <NearbyEvents
            events={renderedEvents}
            position={position}
            onJoinRequest={handleJoinRequestUpdate}
            onCancelParticipation={handleCancelParticipation}
            onDelete={handleEventDelete}
            onCancelRequest={handleCancelJoinRequest}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
