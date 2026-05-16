import React, { useEffect, useState } from 'react';

import MapView from '../../shared/components/UIComponents/Map';
import NavLinks from '../../shared/components/nevigation/NavLinks';
import { useDebounce } from '../../shared/components/hooks/useDebounce';
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
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 300);
  const [events, setEvents] = useState([]);

  // Server already filters by radius via the 2dsphere index; here we only
  // annotate each event with its distance (for display) and apply the
  // text-search filter.
  useEffect(() => {
    if (!isValidMapCenter(props.position) || !Array.isArray(props.events)) {
      setEvents([]);
      return;
    }

    const needle = debouncedFilter.toLowerCase();
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
  }, [props.events, props.position, debouncedFilter]);

  return (
    <>
      <div className="filter-container">
        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            id="address"
            type="text"
            value={filter}
            placeholder="Search for a team or league"
            onChange={(event) => setFilter(event.target.value)}
            autoComplete="off"
          />
        </div>
        <div style={{ margin: '2rem 20px 0 0' }}>
          <NavLinks />
        </div>
      </div>
      <div className="map-container">
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
      </div>
    </>
  );
};

export default NearbyEvents;
