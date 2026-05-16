import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  Map,
  AdvancedMarker,
  MapControl,
  ControlPosition,
  useMap,
} from '@vis.gl/react-google-maps';

import {
  DEFAULT_MAP_CENTER,
  isValidMapCenter,
} from '../../../config/mapDefaults';
import AuthContext from '../contexts/AuthContext';
import EventItem from '../../../places/components/EventItem';
import PlusButton from './PlusButton';
import Marker from './Marker';

import './Map.css';

const MAP_ID = 'd911c4be45d3392c';

const hasUser = (list, userId) =>
  (list || []).some(
    (p) => (typeof p === 'object' ? p.id || p._id : p) === userId
  );

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

const MapView = ({
  center,
  zoom = 12,
  locations = [],
  className,
  style,
  onJoinRequest,
  onCancelParticipation,
  onDelete,
  onCancelRequest,
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const auth = useContext(AuthContext);

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
      onClick={() => setSelectedEvent(null)}
    >
      <RecenterOnFirstUpdate position={center} fallback={DEFAULT_MAP_CENTER} />

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
            onClick={() => setSelectedEvent(event)}
          >
            <Marker distance={distance} event={event} />
          </AdvancedMarker>
        );
      })}

      <MapControl position={ControlPosition.RIGHT_BOTTOM}>
        <div id="add-event-button">
          <PlusButton />
        </div>
      </MapControl>

      {selectedEvent && (
        <MapControl position={ControlPosition.LEFT_TOP}>
          <div id="legend">
            <EventItem
              id={selectedEvent.id || selectedEvent._id}
              self={selectedEvent}
              title={selectedEvent.title}
              description={selectedEvent.description}
              address={selectedEvent.address}
              coordinates={selectedEvent.coordinates}
              host={selectedEvent.host}
              numOfParticipants={selectedEvent.numOfParticipants}
              startTime={new Date(selectedEvent.startTime).toLocaleString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                }
              )}
              isParticipated={hasUser(selectedEvent.participants, auth.userId)}
              isRequested={hasUser(selectedEvent.pending, auth.userId)}
              showFull
              onJoinRequest={onJoinRequest}
              onCancelParticipation={onCancelParticipation}
              onDelete={onDelete}
              onCancelRequest={onCancelRequest}
            />
          </div>
        </MapControl>
      )}
    </Map>
  );
};

export default MapView;
