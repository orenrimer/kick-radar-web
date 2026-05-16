import React, { useEffect, useState } from 'react';

import MapView from '../../shared/components/UIComponents/Map/Map';
import { isValidMapCenter } from '../../config/mapDefaults';

import './NearbyEvents.css';

function calculateDistance(coords1, coords2) {
  const R = 6371;
  const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180;
  const dLon = ((coords2.lng - coords1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.lat * Math.PI) / 180) *
      Math.cos((coords2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const NearbyEvents = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!isValidMapCenter(props.position) || !Array.isArray(props.events)) {
      setEvents([]);
      return;
    }

    const needle = (props.debouncedFilter || '').toLowerCase();
    const withDistance = props.events
      .map((e) => {
        if (!e?.coordinates) return { ...e, distance: Infinity };
        return {
          ...e,
          distance: calculateDistance(props.position, e.coordinates),
        };
      })
      .filter(
        (x) =>
          x.title?.toLowerCase().includes(needle) ||
          x.description?.toLowerCase().includes(needle)
      );

    setEvents(withDistance);
  }, [props.events, props.position, props.debouncedFilter]);

  return (
    <MapView
      center={props.position}
      style={{ height: '100%', width: '100%' }}
      zoom={12}
      locations={events}
      onJoinRequest={props.onJoinRequest}
      onCancelParticipation={props.onCancelParticipation}
      onDelete={props.onDelete}
      onCancelRequest={props.onCancelRequest}
    />
  );
};

export default NearbyEvents;
