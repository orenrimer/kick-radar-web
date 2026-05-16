import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../../shared/components/contexts/AuthContext';
import NearbyEvents from '../components/NearbyEvents';
import Sidebar from '../../shared/components/nevigation/Sidebar';
import { useAllEvents, useUserEvents } from '../../queries/events';

import './Home.css';

const Home = () => {
  const auth = useContext(AuthContext);
  const [renderedEvents, setRenderedEvents] = useState([]);

  const { data: allEventsData } = useAllEvents(auth.token);
  const { data: userEventsData } = useUserEvents(auth.userId, auth.token);

  const allEvents = allEventsData?.events;
  const hostedEvents = userEventsData?.hostedEvents;
  const participatedEvents = userEventsData?.participatedEvents;
  const requestedEvents = userEventsData?.requestedEvents;

  useEffect(() => {
    if (allEvents) {
      setRenderedEvents(allEvents);
    }
  }, [allEvents]);

  const handleCategoryChange = (category) => {
    let eventsToDisplay = [];

    if (category === 'hosted' && hostedEvents) {
      eventsToDisplay = hostedEvents;
    } else if (category === 'participated' && participatedEvents) {
      eventsToDisplay = participatedEvents;
    } else if (category === 'requested' && requestedEvents) {
      eventsToDisplay = requestedEvents;
    } else {
      eventsToDisplay = allEvents ?? [];
    }

    setRenderedEvents(eventsToDisplay);
  };

  const handleEventDelete = (eventId) => {
    setRenderedEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const handleJoinRequestUpdate = (event) => {
    setRenderedEvents((prev) => [...prev, event]);
  };

  const handleCancelJoinRequest = (eventId) => {
    setRenderedEvents((prev) => prev.filter((event) => event._id !== eventId));
  };

  const handleCancelParticipation = () => {};

  return (
    <div className="home-container">
      <div className="sidebar-container">
        <Sidebar onCatgoryChange={handleCategoryChange} />
      </div>
      <div className="home-container-right">
        <div className="nearby-places-container">
          <NearbyEvents
            events={renderedEvents}
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
