import React, { useEffect, useState, useRef } from "react";

import { useHttpClient } from '../../shared/components/hooks/http-hook';
import MapView from "../../shared/components/UIComponents/Map";
import Dropdown from "../../shared/components/UIComponents/Dropdown";
import RangeSlider from "../../shared/components/UIComponents/Slider";
import CustomButton from "../../shared/components/UIComponents/CustomButton";

import "./NearbyEvents.css"
import PlusButton from "../../shared/components/UIComponents/PlusButton";
import NavLinks from "../../shared/components/nevigation/NavLinks";
import Marker from "../../shared/components/UIComponents/Marker";
import MenuDropdown from "../../shared/components/UIComponents/MenuDropdown";

function calculateDistance(coords1, coords2) {
    const R = 6371;

    const dLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const dLon = (coords2.lng - coords1.lng) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coords1.lat * Math.PI / 180) * Math.cos(coords2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}



const l = {
    "4": "Euro Championship (World)",
    "21": "Confederations Cup (World)",
    "61": "Ligue 1 (France)",
    "144": "Division d'Honneur"
}

const t = {
    "77": "Angers",
    "78": "Bordeaux",
    "79": "Lille",
    "80": "Lyon",
    "81": "Marseille",
    "82": "Montpellier",
    "83": "Nantes",
    "84": "Nice",
    "85": "Paris Saint Germain",
    "89": "Dijon",
    "91": "Monaco",
    "92": "Nimes",
    "93": "Reims",
    "94": "Rennes",
    "95": "Strasbourg",
    "96": "Toulouse",
    "97": "Lorient",
    "106": "Stade Brestois 29",
    "112": "Metz",
    "116": "Lens",
    "1063": "Saint Etienne"
}



const NearbyEvents = (props) => {
    const [filter, setFilter] = useState('');
    const [events, setEvents] = useState(props.events);
    const [range, setRange] = useState(10);
    const [zoom, setZoom] = useState(11);
    const [position, setPosition] = useState({ lat: null, lng: null });
    const MAX_RANGE = 250;


    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }


    }, []);


    const filterEvents = () => {
        // const filterdEvents = props.events.filter(x =>
        //     calculateDistance(position, x.coordinates) <= range
        //     && x.description.toLowerCase().includes(pickedLeague[1].split("(")[0].toLowerCase())
        //     && x.title.toLowerCase().includes(pickedTeam[1].toLowerCase())

        // );
        props.events.forEach(e => {
            const dist = calculateDistance(position, e.coordinates);
            e.distance = dist;
        });
        const filterdEvents = props.events.filter(x =>
            x.distance <= MAX_RANGE
            && (x.title.toLowerCase().includes(filter.toLowerCase()) || x.description.toLowerCase().includes(filter.toLowerCase()))
        );

        console.log(filterdEvents)
        setEvents(filterdEvents);
    }

    // const calculateZoomLevel = () => {
    //     const minZoom = 10;
    //     const maxZoom = 15;
    //     const maxRange = 50;

    //     let zoomLevel = maxZoom - ((range / maxRange) * (maxZoom - minZoom));
    //     setZoom(Math.max(minZoom, Math.min(maxZoom, zoomLevel)));
    // };



    // useEffect(() => {
    //     calculateZoomLevel();
    // }, [range])

    useEffect(() => {
        filterEvents();
    }, [props.events, position, filter]);


    // const handleRemoveLeagueFilter = () => {
    //     setPickedLeague(["", ""]);
    // }

    // const handleRemoveTeamFilter = () => {
    //     setPickedTeam(["", ""]);
    // }

    return (
        <React.Fragment>
            <div className="filter-container">
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        id="address"
                        type="text"
                        value={filter}
                        placeholder='Search for a team or league'
                        onChange={(event) => {
                            event.persist()
                            setFilter(event.target.value)
                        }}
                        set autoComplete="off"
                    />
                </div>
                <div style={{ margin: "2rem 20px 0 0" }}>
                    <NavLinks />
                </div>
            </div>
            <div className="map-container">
                <MapView center={position}
                    style={{ height: "100%" }}
                    zoom={15}
                    locations={events}
                    onJoinRequest={props.onJoinRequest}
                    onCancelParticipation={props.onCancelParticipation}
                    onDelete={props.onDelete}
                    onCancelRequest={props.onCancelRequest}
                >
                </MapView>
            </div>
        </React.Fragment >
    )
}

export default NearbyEvents;