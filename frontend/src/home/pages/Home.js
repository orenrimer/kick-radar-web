import React, { useState, useContext, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import AuthContext from '../../shared/components/contexts/AuthContext';
import NearbyEvents from '../components/NearbyEvents';
import Sidebar from '../../shared/components/nevigation/Sidebar';
import NavLinks from '../../shared/components/nevigation/NavLinks';
import AuthField from '../../shared/components/UIComponents/AuthField/AuthField';
import { useAllEvents, useUserEvents, eventKeys } from '../../queries/events';
import { useUserLocation } from '../../shared/components/hooks/useUserLocation';
import { useDebounce } from '../../shared/components/hooks/useDebounce';

import './Home.css';

const NEARBY_RADIUS_KM = 250;

const EMPTY_USER_EVENTS = {
  hostedEvents: [],
  participatedEvents: [],
  requestedEvents: [],
};

const matchesUser = (p, userId) =>
  (typeof p === 'object' ? p.id || p._id : p) === userId;

const Home = () => {
  const auth = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 300);
  const { position } = useUserLocation();

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

  const updateEventInAllCache = (eventId, updater) => {
    queryClient.setQueryData(eventKeys.all(near), (old) => {
      if (!old) return old;
      return {
        ...old,
        events: (old.events || []).map((e) =>
          e.id === eventId ? updater(e) : e
        ),
      };
    });
  };

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
    const eventId = event.id || event._id;
    updateEventInAllCache(eventId, (e) => ({
      ...e,
      pending: [...(e.pending || []), auth.userId],
    }));
    queryClient.setQueryData(eventKeys.user(auth.userId), (old) => {
      const base = old ?? EMPTY_USER_EVENTS;
      return { ...base, requestedEvents: [...base.requestedEvents, event] };
    });
  };

  const handleCancelJoinRequest = (eventId) => {
    if (!auth.userId) return;
    updateEventInAllCache(eventId, (e) => ({
      ...e,
      pending: (e.pending || []).filter((p) => !matchesUser(p, auth.userId)),
    }));
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

  const handleCancelParticipation = (eventId) => {
    if (!auth.userId) return;
    updateEventInAllCache(eventId, (e) => ({
      ...e,
      participants: (e.participants || []).filter(
        (p) => !matchesUser(p, auth.userId)
      ),
      numOfParticipants: Math.max(0, (e.numOfParticipants || 1) - 1),
    }));
    queryClient.setQueryData(eventKeys.user(auth.userId), (old) => {
      const base = old ?? EMPTY_USER_EVENTS;
      return {
        ...base,
        participatedEvents: base.participatedEvents.filter(
          (e) => e._id !== eventId && e.id !== eventId
        ),
      };
    });
  };

  return (
    <div className="home-shell">
      <div className="home-body">
        <aside className="sidebar-panel">
          <Sidebar onCatgoryChange={setSelectedCategory} />
        </aside>
        <div className="map-column">
          <header className="topbar">
            <div className="topbar__title">
              <h2>Find games near you</h2>
              <p>Live matches and upcoming kick-offs around you</p>
            </div>
            <div className="topbar__search">
              <AuthField
                type="text"
                name="topbar-search"
                placeholder="Search for a team or league"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                leftIcon={<i className="fa-solid fa-magnifying-glass" />}
              />
            </div>
            <div className="topbar__actions">
              <NavLinks />
            </div>
          </header>
          <main className="map-frame">
            <NearbyEvents
              events={renderedEvents}
              position={position}
              debouncedFilter={debouncedFilter}
              onJoinRequest={handleJoinRequestUpdate}
              onCancelParticipation={handleCancelParticipation}
              onDelete={handleEventDelete}
              onCancelRequest={handleCancelJoinRequest}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;
