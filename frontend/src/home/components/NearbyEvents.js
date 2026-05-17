import React, { useEffect, useState } from 'react';

import MapView from '../../shared/components/UIComponents/Map/Map';
import { isValidMapCenter } from '../../config/mapDefaults';

import './NearbyEvents.css';

const NearbyEvents = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!isValidMapCenter(props.position) || !Array.isArray(props.events)) {
      setEvents([]);
      return;
    }

    const needle = (props.debouncedFilter || '').toLowerCase();
    const withDistance = props.events
      .map((e) => ({ ...e, distance: props.distanceTo(e.coordinates) }))
      .filter(
        (x) =>
          x.title?.toLowerCase().includes(needle) ||
          x.description?.toLowerCase().includes(needle)
      )
      .sort((a, b) => a.distance - b.distance);

    setEvents(withDistance);
  }, [props.events, props.position, props.debouncedFilter, props.distanceTo]);

  return (
    <MapView
      center={props.position}
      style={{ height: '100%', width: '100%' }}
      zoom={15}
      locations={events}
      focusTo={props.focusTo}
      selectedEventId={props.selectedEventId}
      onSelectEvent={props.onSelectEvent}
    />
  );
};

export default NearbyEvents;
