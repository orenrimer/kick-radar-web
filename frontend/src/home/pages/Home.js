import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/components/hooks/http-hook";
import AuthContext from "../../shared/components/contexts/AuthContext";
import Card from "../../shared/components/UIComponents/Card";
import Loading from "../../shared/components/UIComponents/Loading";
import NearbyEvents from "../components/NearbyEvents";

import "./Home.css"
import Sidebar from "../../shared/components/nevigation/Sidebar";
import Taskbar from "../../shared/components/nevigation/Taskbar";
import NavLinks from "../../shared/components/nevigation/NavLinks";



const Home = () => {
    const { isLoading, error, sendRequest } = useHttpClient();
    const [allEvents, setAllEvents] = useState();
    const [participatedEvents, setParticipatedEvents] = useState();
    const [hostedEvents, setHostedEvents] = useState();
    const [requestedEvents, setRequestedEvents] = useState();
    const [renderedEvents, setRanderedEvents] = useState([]);
    const auth = useContext(AuthContext);


    useEffect(() => {
        const fetcheEvents = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/events`);
                setAllEvents(responseData.events);
            } catch (err) { }
        };

        const fetchUserEvents = async () => {
            if (!auth.userId) return;
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/events/user/${auth.userId}`
                );
                setHostedEvents(responseData.hostedEvents);
                setParticipatedEvents(responseData.participatedEvents);
                setRequestedEvents(responseData.requestedEvents);
            } catch (err) { }
        };

        fetcheEvents();
        fetchUserEvents();
    }, [sendRequest, auth.userId]);

    const handleCategoryChange = (category) => {
        let eventsToDisplay = [];

        if (category === 'hosted' && hostedEvents) {
            eventsToDisplay = hostedEvents;
        } else if (category === 'participated' && participatedEvents) {
            eventsToDisplay = participatedEvents;
        } else if (category === 'requested' && requestedEvents) {
            eventsToDisplay = requestedEvents;
        } else if (allEvents) {
            eventsToDisplay = allEvents;
        }

        console.log(eventsToDisplay);
        setRanderedEvents(eventsToDisplay || []); // לוודא שלא נכניס undefined
    };


    const handleEventDelete = (eventId) => {
        setHostedEvents(prevPlaces =>
            prevPlaces.filter(place => place.id !== eventId)
        );
    };


    const handleJoinRequestUpdate = (event) => {
        setRequestedEvents((prev) => [...prev, event]);
    };

    const handleCancelJoinRequest = (eventId) => {
        setRequestedEvents((prev) => {
            let newEvents = [...prev];
            return newEvents.filter((event) => event._id !== eventId)
        });
    };

    const handleCancelParticipation = (eventId) => {
        setParticipatedEvents((prev) => {
            let newEvents = [...prev];
            return newEvents.filter((event) => event._id !== eventId)
        });
    }

    return (
        <React.Fragment>
            {isLoading && (
                <div className="center">
                    <Loading />
                </div>
            )}

            {!isLoading && allEvents &&
                <div className="home-container">
                    <div className="sidebar-container" >
                        <Sidebar onCatgoryChange={handleCategoryChange} />
                    </div>
                    <div className="home-container-right">
                        {/* <div className="topbar">
                            <h2>Find Events</h2>
                            <NavLinks />
                        </div> */}
                        <div className="nearby-places-container" >
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

            }
        </React.Fragment>
    );

}

export default Home;