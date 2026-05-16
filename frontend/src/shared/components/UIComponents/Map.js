import React, { useRef, useEffect, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import ReactDOMServer from 'react-dom/server';
import { loadGoogleMaps } from '../../../utils/loadGoogleMaps';
import { isValidMapCenter } from '../../../config/mapDefaults';

import AuthContext from '../contexts/AuthContext';
import EventItem from '../../../places/components/EventItem';
import PlusButton from './PlusButton';
import Marker from './Marker';

import './Map.css';

const MapView = (props) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const legendRef = useRef(null);
  const addEventBtnRef = useRef(null);
  const legendRootRef = useRef(null);
  const markersRef = useRef([]);
  const resizeObserverRef = useRef(null);

  const { center, zoom = 12 } = props;
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (!isValidMapCenter(center) || !mapContainerRef.current) {
      return undefined;
    }

    let cancelled = false;

    async function initMap() {
      try {
        await loadGoogleMaps();
        if (cancelled || !mapContainerRef.current) return;

        const { Map } = await window.google.maps.importLibrary('maps');
        const { AdvancedMarkerElement } =
          await window.google.maps.importLibrary('marker');

        if (cancelled) return;

        if (legendRootRef.current) {
          legendRootRef.current.unmount();
          legendRootRef.current = null;
        }

        markersRef.current.forEach((m) => {
          m.map = null;
        });
        markersRef.current = [];

        const map = new Map(mapContainerRef.current, {
          center,
          zoom,
          mapId: 'd911c4be45d3392c',
          streetViewControl: false,
          clickableIcons: false,
          mapTypeControl: false,
          cameraControl: false,
          fullscreenControl: false,
        });

        mapRef.current = map;

        // Container can briefly be 0x0 during route transitions; observe it so
        // Google Maps re-measures once layout settles, instead of needing a
        // window resize to trigger it.
        resizeObserverRef.current = new ResizeObserver(() => {
          if (mapRef.current && window.google?.maps?.event) {
            window.google.maps.event.trigger(mapRef.current, 'resize');
            mapRef.current.setCenter(center);
          }
        });
        resizeObserverRef.current.observe(mapContainerRef.current);

        if (legendRef.current) {
          map.controls[window.google.maps.ControlPosition.LEFT_TOP].push(
            legendRef.current
          );
        }
        if (addEventBtnRef.current) {
          map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(
            addEventBtnRef.current
          );
        }

        map.addListener('click', () => {
          if (legendRootRef.current) {
            legendRootRef.current.unmount();
            legendRootRef.current = null;
          }
        });

        const userMarkerHtml = ReactDOMServer.renderToString(
          <Marker isCenter={true} />
        );
        const userContent = document.createElement('div');
        userContent.innerHTML = userMarkerHtml;

        markersRef.current.push(
          new AdvancedMarkerElement({
            position: center,
            map,
            content: userContent,
          })
        );

        (props.locations || []).forEach((event) => {
          if (!event?.coordinates) return;

          const markerHtml = ReactDOMServer.renderToString(
            <Marker
              distance={
                event.distance != null
                  ? Math.round((event.distance + Number.EPSILON) * 100) / 100
                  : undefined
              }
              event={event}
            />
          );
          const content = document.createElement('div');
          content.innerHTML = markerHtml;

          const marker = new AdvancedMarkerElement({
            position: event.coordinates,
            map,
            title: event.title,
            content,
          });

          marker.addListener('click', () => {
            if (!legendRef.current) return;

            if (!legendRootRef.current) {
              legendRootRef.current = createRoot(legendRef.current);
            }

            const eventId = event.id || event._id;
            const participantIds = (event.participants || []).map((p) =>
              typeof p === 'object' ? p.id || p._id : p
            );
            const pendingIds = (event.pending || []).map((p) =>
              typeof p === 'object' ? p.id || p._id : p
            );

            legendRootRef.current.render(
              <AuthContext.Provider value={auth}>
                <EventItem
                  id={eventId}
                  self={event}
                  title={event.title}
                  description={event.description}
                  address={event.address}
                  coordinates={event.coordinates}
                  host={event.host}
                  numOfParticipants={event.numOfParticipants}
                  startTime={new Date(event.startTime).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                  isParticipated={participantIds.includes(auth.userId)}
                  isRequested={pendingIds.includes(auth.userId)}
                  showFull={true}
                  onJoinRequest={props.onJoinRequest}
                  onCancelParticipation={props.onCancelParticipation}
                  onDelete={props.onDelete}
                  onCancelRequest={props.onCancelRequest}
                />
              </AuthContext.Provider>
            );
          });

          markersRef.current.push(marker);
        });
      } catch (err) {
        console.error('[MapView]', err.message || err);
      }
    }

    initMap();

    return () => {
      cancelled = true;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      markersRef.current.forEach((m) => {
        m.map = null;
      });
      markersRef.current = [];
      mapRef.current = null;
    };
  }, [
    center?.lat,
    center?.lng,
    zoom,
    props.locations,
    auth.userId,
    props.onJoinRequest,
    props.onCancelParticipation,
    props.onDelete,
    props.onCancelRequest,
  ]);

  return (
    <>
      <div
        ref={mapContainerRef}
        className={`map ${props.className || ''}`}
        style={props.style}
      />
      <div id="add-event-button" ref={addEventBtnRef}>
        <PlusButton />
      </div>
      <div id="legend" ref={legendRef} />
    </>
  );
};

export default MapView;
