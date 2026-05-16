import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

import AuthContext from "../../shared/components/contexts/AuthContext";
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import Avatar from "../../shared/components/UIComponents/Avatar"
import EventItem from "../../places/components/EventItem";
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";

import "./User.css"


const User = (props) => {
    const [userData, setUserData] = useState();
    const [hostedEvents, setHostedEvents] = useState();
    const [participatedEvents, setParticipatedEvents] = useState();
    const [requestedEvents, setRequestedEvents] = useState();
    const [activeCategory, setActiveCategory] = useState('hosted');
    const { isLoading, error, sendRequest } = useHttpClient();

    const navigate = useNavigate();
    const auth = useContext(AuthContext);


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



    // const placeLikedHandler = (placeId, up) => {
    //     setHostedEvent((prevPlaces) => {
    //         let newPlaces = [...prevPlaces]
    //         prevPlaces.forEach(element => {
    //             if (element.id === placeId) {
    //                 if (up) {
    //                     element.likedBy.push(auth.userId);
    //                     return;
    //                 }
    //                 else {
    //                     element.likedBy = [...element.likedBy.filter((userId) => userId !== auth.userId)]
    //                     return;
    //                 }
    //             }
    //         })
    //         return newPlaces;
    //     })

    //     setParticipatedEvents((prevPlaces) =>
    //         prevPlaces.filter(element => element.id !== placeId)
    //     )
    // }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const responseData = await sendRequest(
                    `/users/${auth.userId}`
                );
                setUserData(responseData.user)
            } catch (err) { }
        };

        const fetchUserEvents = async () => {
            try {
                const responseData = await sendRequest(
                    `/events/user/${auth.userId}`
                );

                setHostedEvents(responseData.hostedEvents);
                setParticipatedEvents(responseData.participatedEvents);
                setRequestedEvents(responseData.requestedEvents);
            } catch (err) { }

        };
        fetchUserData();
        fetchUserEvents();
    }, [sendRequest, auth.userId]);


    const uploadUserImage = (file) => {
        const updateUser = async () => {
            try {
                const formData = new FormData();
                formData.append('image', file);
                const responseData = await sendRequest(
                    `/users/${auth.userId}`,
                    'PATCH',
                    formData,
                    { "Authorization": `Bearer ${auth.token}` }
                );
                setUserData(responseData.user)
            } catch (err) { }
        };
        updateUser();
    }

    const renderEventsList = () => {
        let eventsToDisplay = [];
        if (activeCategory === 'hosted') {
            eventsToDisplay = hostedEvents;
        } else if (activeCategory === 'participated') {
            eventsToDisplay = participatedEvents;
        } else if (activeCategory === 'requested') {
            eventsToDisplay = requestedEvents;
        }

        return eventsToDisplay.map((event) => (
            <div key={event._id} className="user-events-item">
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
                    isParticipated={participatedEvents.map((e) => e._id).includes(event._id)}
                    isRequested={requestedEvents.map((e) => e._id).includes(event._id)}
                    showFull={true}
                    onJoinRequest={handleJoinRequestUpdate}
                    onCancelParticipation={handleCancelParticipation}
                    onDelete={handleEventDelete}
                    onCancelRequest={handleCancelJoinRequest}
                    style={{ height: "100%", padding: 0 }}
                />
            </div>
        ));
    };


    return (
        <React.Fragment>
            {/* {error && <Card className="center error"><h2>{error}</ h2></Card>}
            {isLoading && (
                <div className="center">
                    <Loading />
                </div>
            )} */}

            <div className="user-info" >
                {auth.isLoggedIn && userData &&
                    <div className="user-info__image">
                        <Avatar image={resolveImageUrl(userData.image)} alt="Profile" />
                        {/* <div className="user-info__change-image-btn">
                       
                        <ImageUpload style={{ 'fontSize': '17px', 'padding': "0.7rem" }} onInput={uploadUserImage}>
                            <i className="fa-solid fa-camera"></i>
                        </ImageUpload>
                      
                    </div> */}
                    </div>}
                {!auth.isLoggedIn && <a href="/auth/login"><PiSignInBold /></a>}
                <div className="user-info__content">
                    {auth.isLoggedIn && userData && <h5 style={{ fontSize: "14px", fontWeight: "700" }}>{userData.name}</h5 >}
                    {auth.isLoggedIn && userData && <h5>{userData.email}</h5>}
                </div>
                {auth.isLoggedIn && userData &&
                    <button onClick={() => { navigate('/'); auth.logout(); }} >
                        <PiSignOutBold style={{ fontSize: "20px" }} />
                    </button>}
            </div>
            {/* {!isLoading && !error && userData &&
                
            } */}
            {/* <Card className="user-container" style={{ padding: 0 }}>
                {{!isLoading && !error && userData && hostedEvents && participatedEvents && requestedEvents &&
                    <div className="events-info-body">
                        <div className="user-events-highlights">
                            <h4>Highlights</h4>
                            <div className={`user-events-highlights-catgory ${activeCategory === 'hosted' ? 'active' : ''}`} onClick={() => setActiveCategory('hosted')}>
                                <span>My Events</span>
                                <i className="fa-solid fa-angle-down"></i>
                            </div>
                            <div className={`user-events-highlights-catgory ${activeCategory === 'participated' ? 'active' : ''}`} onClick={() => setActiveCategory('participated')}>
                                <span>Attending Events</span>
                                <i className="fa-solid fa-angle-down"></i>
                            </div>
                            <div className={`user-events-highlights-catgory ${activeCategory === 'requested' ? 'active' : ''}`} onClick={() => setActiveCategory('requested')}>
                                <span>Pending Events</span>
                                <i className="fa-solid fa-angle-down"></i>
                            </div>
                        </div>
                        <div className="user-events-list">
                            {renderEventsList()}
                        </div>
                    </div>
                } }
            </Card> */}
        </React.Fragment>
    );
};

export default User;