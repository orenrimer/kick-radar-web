import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import AuthContext from '../../shared/components/contexts/AuthContext';
import EventItem from '../components/EventItem';
import Loading from '../../shared/components/UIComponents/Loading/Loading';
import Card from '../../shared/components/UIComponents/Card/Card';
import { useEvent, eventKeys } from '../../queries/events';

import './Place.css';

const Place = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const placeId = useParams().placeId;

    const { data, isLoading, error } = useEvent(placeId, auth.token);
    const loadedEvent = data?.event;

    const refreshThisEvent = () =>
        queryClient.invalidateQueries({ queryKey: eventKeys.byId(placeId) });

    const handleCancelParticipation = () => refreshThisEvent();
    const placeDeletedHandler = () => navigate('/');

    return (
        <React.Fragment>
            {error && <Card className="center error"><h2>{error.message}</h2></Card>}
            {isLoading && (
                <div className="center">
                    <Loading />
                </div>
            )}
            {!isLoading && loadedEvent && (
                <EventItem
                    id={loadedEvent._id}
                    self={loadedEvent}
                    title={loadedEvent.title}
                    description={loadedEvent.description}
                    address={loadedEvent.address}
                    coordinates={loadedEvent.coordinates}
                    host={loadedEvent.host}
                    numOfParticipants={loadedEvent.numOfParticipants}
                    startTime={new Date(loadedEvent.startTime).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                    })}
                    showFull
                    isParticipated={loadedEvent.participants.includes(auth.userId)}
                    isRequested={loadedEvent.pending.includes(auth.userId)}
                    onJoinRequest={refreshThisEvent}
                    onCancelParticipation={handleCancelParticipation}
                    onDelete={placeDeletedHandler}
                    onCancelRequest={refreshThisEvent}
                />
            )}
        </React.Fragment>
    );
};

export default Place;
