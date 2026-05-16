import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/components/hooks/http-hook';
import AuthContext from '../../shared/components/contexts/AuthContext';
import EventItem from '../components/EventItem';
import Loading from '../../shared/components/UIComponents/Loading';
import Card from '../../shared/components/UIComponents/Card';


import "./Place.css"

const Place = (props) => {
    const [loadedEvent, setLoadedEvent] = useState();
    const { isLoading, error, sendRequest } = useHttpClient();

    const auth = useContext(AuthContext);
    const placeId = useParams().placeId;
    const navigate = useNavigate();


    const handleCancelParticipation = (eventId) => {
        setLoadedEvent((prev) => {
            prev.participants = [...prev.participants.filter((userId) => userId !== auth.userId)]
        });
    }

    const placeDeletedHandler = () => {
        navigate('/');
    };

    const placeLikeHandler = (placeId, up) => {
        setLoadedEvent((prev) => {
            if (up) {
                prev.likedBy.push(auth.userId);
            } else {
                prev.likedBy = [...prev.likedBy.filter((userId) => userId !== auth.userId)]
            }

            return prev
        })
    };

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `/events/${placeId}`
                );
                setLoadedEvent(responseData.event);
            } catch (err) { }
        };
        fetchPlaces();
    }, [sendRequest, placeId]);



    return (
        <React.Fragment>
            {error && <Card className="center error"><h2>{error}</ h2></Card>}
            {isLoading && (
                <div className="center">
                    <Loading />
                </div>
            )}
            {!isLoading && loadedEvent &&
                <EventItem
                    id={loadedEvent._id}
                    self={loadedEvent}
                    title={loadedEvent.title}
                    description={loadedEvent.description}
                    address={loadedEvent.address}
                    coordinates={loadedEvent.coordinates}
                    host={loadedEvent.host}
                    numOfParticipants={loadedEvent.numOfParticipants}
                    startTime={new Date(loadedEvent.startTime).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    })}

                    showFull={true}
                    isParticipated={loadedEvent.participants.includes(auth.userId)}
                    isRequested={loadedEvent.pending.includes(auth.userId)}
                    onJoinRequest={() => { }}
                    onCancelParticipation={handleCancelParticipation}
                    onDelete={() => { }}
                    onCancelRequest={() => { }}
                />
            }
        </React.Fragment>
    );

}

export default Place;