import React, { useRef, useEffect } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';

import {
  DEFAULT_MAP_CENTER,
  isValidMapCenter,
} from '../../../../config/mapDefaults';
import Marker from '../Marker/Marker';

import './Map.css';

const MAP_ID = 'd911c4be45d3392c';

// Recenter the map once when geolocation moves the position off the default.
// Without this, the map opens at DEFAULT_MAP_CENTER and never follows the
// user's resolved location.
const RecenterOnFirstUpdate = ({ position, fallback }) => {
  const map = useMap();
  const recenteredRef = useRef(false);

  useEffect(() => {
    if (!map || recenteredRef.current || !position) return;
    if (position.lat === fallback.lat && position.lng === fallback.lng) return;
    map.setCenter(position);
    recenteredRef.current = true;
  }, [map, position, fallback]);

  return null;
};

const PanToEvent = ({ focusTo, locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !focusTo?.id) return;
    const event = locations.find((e) => (e.id || e._id) === focusTo.id);
    if (event?.coordinates) {
      map.panTo(event.coordinates);
    }
  }, [map, focusTo, locations]);

  return null;
};

const MapView = ({
  center,
  zoom = 12,
  locations = [],
  className,
  style,
  onSelectEvent,
  focusTo,
  selectedEventId,
}) => {
  if (!isValidMapCenter(center)) return null;

  return (
    <Map
      defaultCenter={center}
      defaultZoom={zoom}
      mapId={MAP_ID}
      streetViewControl={false}
      clickableIcons={false}
      mapTypeControl={false}
      cameraControl={false}
      fullscreenControl={false}
      className={`map ${className || ''}`}
      style={style}
    >
      <RecenterOnFirstUpdate position={center} fallback={DEFAULT_MAP_CENTER} />
      <PanToEvent focusTo={focusTo} locations={locations} />

      <AdvancedMarker position={center}>
        <Marker isCenter />
      </AdvancedMarker>

      {locations.map((event) => {
        if (!event?.coordinates) return null;
        const key = event.id || event._id;
        const distance =
          event.distance != null
            ? Math.round((event.distance + Number.EPSILON) * 100) / 100
            : undefined;

        return (
          <AdvancedMarker
            key={key}
            position={event.coordinates}
            title={event.title}
            onClick={() => onSelectEvent && onSelectEvent(key)}
          >
            <Marker distance={distance} event={event} selected={key === selectedEventId} />
          </AdvancedMarker>
        );
      })}
    </Map>
  );
};

export default MapView;
