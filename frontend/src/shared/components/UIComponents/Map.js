import React, { useRef, useEffect, useContext } from 'react';
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

import AuthContext from '../contexts/AuthContext';
import EventItem from '../../../places/components/EventItem';
import PlusButton from './PlusButton';
import Marker from './Marker';

import './Map.css';

const mapStyles = [
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    }
]

const MapView = (props) => {
    const mapRef = useRef();
    const legendRef = useRef();
    const addEventBtnRef = useRef();
    const { center, zoom } = props;
    const auth = useContext(AuthContext);

    useEffect(() => {
        if (!legendRef.current) return;

        async function initMap() {
            ReactDOM.unmountComponentAtNode(legendRef.current);
            console.log(props.locations);
            const { Map } = await window.google.maps.importLibrary("maps");
            // const { Marker } = await window.google.maps.importLibrary("marker");
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

            const map = new Map(document.getElementById("map"), {
                center: center,
                zoom: zoom,
                mapId: 'd911c4be45d3392c',
                options: { styles: mapStyles },
                streetViewControl: false,
                clickableIcons: false,
                mapTypeControl: false,
                cameraControl: false,
                fullscreenControl: false
            });

            mapRef.current = map;

            if (legendRef.current) {
                map.controls[window.google.maps.ControlPosition.LEFT_TOP].push(legendRef.current);
            }
            map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(addEventBtnRef.current);

            map.addListener("click", () => {
                if (legendRef.current) {
                    ReactDOM.unmountComponentAtNode(legendRef.current);
                }
            });

            const markerHtml = ReactDOMServer.renderToString(<Marker isCenter={true} />);

            const content = document.createElement("div");
            content.innerHTML = markerHtml;

            const marker = new AdvancedMarkerElement({
                position: center,
                map: mapRef.current,
                content
            });



            if (props.locations) {
                props.locations.forEach((event) => {
                    const markerHtml = ReactDOMServer.renderToString(<Marker distance={Math.round((event.distance + Number.EPSILON) * 100) / 100} event={event} />);

                    // יצירת אלמנט div והכנסת ה-HTML המומר
                    const content = document.createElement("div");
                    content.innerHTML = markerHtml;

                    const marker = new AdvancedMarkerElement({
                        id: event._id,
                        title: event.title,
                        position: event.coordinates,
                        map: mapRef.current,
                        content
                    });

                    marker.addListener("click", () => {
                        if (!legendRef.current) return;

                        ReactDOM.unmountComponentAtNode(legendRef.current);

                        ReactDOM.render(
                            <AuthContext.Provider value={auth}>
                                <EventItem
                                    id={event._id}
                                    self={event}
                                    title={event.title}
                                    description={event.description}
                                    address={event.address}
                                    coordinates={event.coordinates}
                                    host={event.host}
                                    numOfParticipants={event.numOfParticipants}
                                    startTime={new Date(event.startTime).toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric"
                                    })}
                                    isParticipated={event.participants.includes(auth.userId)}
                                    isRequested={event.pending.includes(auth.userId)}
                                    showFull={true}
                                    onJoinRequest={props.onJoinRequest}
                                    onCancelParticipation={props.onCancelParticipation}
                                    onDelete={props.onDelete}
                                    onCancelRequest={props.onCancelRequest}
                                />
                            </AuthContext.Provider>,
                            legendRef.current
                        );
                    });
                });
            }
        }

        initMap();

        return () => {
            if (mapRef.current) {
                mapRef.current = null;
            }
        };
    }, [props.locations, center, zoom, legendRef.current]);

    return (
        <React.Fragment>
            <div id="map" className={`map ${props.className}`} style={props.style}></div>
            <div id="add-event-button" ref={addEventBtnRef}>
                <PlusButton />
            </div>
            <div id="legend" ref={legendRef} />
        </React.Fragment>
    );
};
export default MapView;