import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import { useHttpClient } from "../hooks/http-hook";
import { PiSignInBold } from "react-icons/pi";
import User from "../../../user/pages/User";
import AuthContext from "../contexts/AuthContext";

import "./Sidebar.css"


const Sidebar = (props) => {
    // const content = <aside className="side-drawer">{props.children}</aside>

    // return ReactDom.createPortal(content, document.getElementById('sidebar-hook'))
    const [activeCategory, setActiveCategory] = useState('all');
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest } = useHttpClient();


    // useEffect(() => {
    //     const fetchUserEvents = async () => {
    //         try {
    //             const responseData = await sendRequest(
    //                 `${process.env.REACT_APP_BACKEND_URL}/events/user/${auth.userId}`
    //             );

    //             console.log(responseData);
    //             setHostedEvents(responseData.hostedEvents);
    //             setParticipatedEvents(responseData.participatedEvents);
    //             setRequestedEvents(responseData.requestedEvents);
    //         } catch (err) { }

    //     };
    //     fetchUserEvents();
    // }, [sendRequest, auth.userId]);

    // useEffect(() => {
    //     let eventsToDisplay = [];
    //     if (activeCategory === 'hosted') {
    //         eventsToDisplay = hostedEvents;
    //     } else if (activeCategory === 'participated') {
    //         eventsToDisplay = participatedEvents;
    //     } else if (activeCategory === 'requested') {
    //         eventsToDisplay = requestedEvents;
    //     } else {
    //         eventsToDisplay = [...(hostedEvents || []), ...(participatedEvents || []), ...(requestedEvents || [])];
    //     }

    //     setRanderedEvents(eventsToDisplay);
    //     props.onCatgoryChange(eventsToDisplay); // Pass directly instead of using the outdated state
    // }, [activeCategory, hostedEvents, participatedEvents, requestedEvents]);


    useEffect(() => {
        props.onCatgoryChange(activeCategory);
    }, [activeCategory]);

    return (
        <React.Fragment>
            <div className="sidebar-top">
                <div className="sidebar-logo-large">
                    <img src={`${process.env.REACT_APP_STATIC_URL}/kick-radar-logo-blue.png`} alt='FOOTY FINDER' />
                </div>
                <div className="sidebar-menu">
                    <div className="sidebar-events">
                        <div className={`sidebar-events-catgory ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
                            <i class="fa-solid fa-list"></i><span>All Events</span>
                        </div>
                        {auth.isLoggedIn && <div className={`sidebar-events-catgory ${activeCategory === 'hosted' ? 'active' : ''}`} onClick={() => setActiveCategory('hosted')}>
                            <i class="fa-regular fa-star"></i>
                            <span>My Events</span>
                        </div>}
                        {auth.isLoggedIn && <div className={`sidebar-events-catgory ${activeCategory === 'participated' ? 'active' : ''}`} onClick={() => setActiveCategory('participated')}>
                            <i class="fa-regular fa-calendar-check"></i>
                            <span>Attending Events</span>
                        </div>}
                        {auth.isLoggedIn && <div className={`sidebar-events-catgory ${activeCategory === 'requested' ? 'active' : ''}`} onClick={() => setActiveCategory('requested')}>
                            <i class="fa-solid fa-clock-rotate-left"></i> <span>Pending Events</span>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="sidebar-bottom">
                <div className="sidebar-user-info">
                    <User />
                </div>
            </div>
        </React.Fragment>

    )
}

export default Sidebar;