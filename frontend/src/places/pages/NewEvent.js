import React, { useState, useEffect, useMemo, useReducer, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { FaLongArrowAltLeft } from "react-icons/fa";

import { createEvent } from '../../api/events';

import Loading from '../../shared/components/UIComponents/Loading/Loading';
import Modal from '../../shared/components/UIComponents/Modal/Modal';
import MatchList from '../components/MatchList';
import useMediaQuery from '../../shared/components/hooks/use-media-hook';
import { useDebounce } from '../../shared/components/hooks/useDebounce';
import { useUserLocation } from '../../shared/components/hooks/useUserLocation';
import { useFixtures } from '../../queries/fixtures';
import AuthContext from '../../shared/components/contexts/AuthContext';
import { PiLineVerticalBold } from "react-icons/pi";

import './NewEvent.css';


const NewEvent = () => {
    const currDate = new Date().toJSON().slice(0, 10);

    const [pickedEvent, setPickedEvent] = useState();
    const [showEventDetails, setShowEventDetails] = useState(false);

    const [eventFilter, setEventFilter] = useState('');
    const debouncedEventFilter = useDebounce(eventFilter, 300);

    const [modalEventFilter, setModalEventFilter] = useState('');
    const debouncedModalEventFilter = useDebounce(modalEventFilter, 300);

    const { position } = useUserLocation();
    const { data: fixturesData, isLoading: isLoadingFixtures } = useFixtures(currDate);
    const eventList = useMemo(() => fixturesData?.fixtures ?? [], [fixturesData]);

    const currEvents = useMemo(() => {
        const needle = debouncedEventFilter.toLowerCase();
        return eventList.filter(x =>
            x.homeTeamName.toLowerCase().includes(needle) ||
            x.awayTeamName.toLowerCase().includes(needle)
        );
    }, [debouncedEventFilter, eventList]);

    const modalFilteredEvents = useMemo(() => {
        if (!pickedEvent) return [];
        const needle = debouncedModalEventFilter.toLowerCase();
        return eventList.filter(event =>
            event.homeTeamName.toLowerCase().includes(needle) ||
            event.awayTeamName.toLowerCase().includes(needle)
        );
    }, [debouncedModalEventFilter, eventList, pickedEvent]);

    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery("(max-width: 1400px)");

    const createEventMutation = useMutation({
        mutationFn: (formData) => createEvent(formData, auth.token),
        onSuccess: () => navigate('/'),
    });

    const isLoading = isLoadingFixtures || createEventMutation.isPending;

    useEffect(() => {
        if (isSmallScreen && showEventDetails) {
            setShowEventDetails(false);
        }
    }, [isSmallScreen, showEventDetails]);

    useEffect(() => {
        setShowEventDetails(true);
    }, [pickedEvent]);

    const HandleOnSubmit = (event) => {
        if (!auth.isLoggedIn) {
            navigate('/auth/login');
            return;
        }
        const formData = new FormData();
        formData.append('coordinates', JSON.stringify(position));
        formData.append('title', `${event.homeTeamName} vs ${event.awayTeamName}`);
        formData.append('description', event.league);
        formData.append('startTime', event.startTime);
        createEventMutation.mutate(formData);
    };

    const handlePickEvent = (type) => {
        setPickedEvent(type);
        setShowEventDetails(true);
        setModalEventFilter('');
    };

    return (
        <React.Fragment>
            {isLoading && <Loading />}

            {pickedEvent && (
                <Modal
                    header={`All ${pickedEvent} matches`}
                    show={showEventDetails}
                    handleClose={() => setShowEventDetails(false)}
                >
                    <div className="all-events-container">
                        <div className="search-bar">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                value={modalEventFilter}
                                placeholder="Search for a match"
                                onChange={(e) => setModalEventFilter(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <MatchList
                            events={modalFilteredEvents}
                            type={pickedEvent}
                            onSubmit={HandleOnSubmit}
                        />
                    </div>
                </Modal>
            )}

            <div className="new-event-container">
                <div className="back-btn">
                    <a href="/"><FaLongArrowAltLeft /></a>
                </div>

                {!isLoading && eventList && (
                    <div className="matches-container">
                        <div className="search-bar search-bar-mini">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input
                                type="text"
                                value={eventFilter}
                                placeholder="Search for a match"
                                onChange={(e) => setEventFilter(e.target.value)}
                                autoComplete="off"
                            />
                        </div>
                        <div className="matches-container-left">
                            <div className="matches-container-left-top">
                                <h2 className="live-data-title">LIVE MATCHES</h2>
                                <button onClick={() => handlePickEvent('live')}>See all results</button>
                            </div>
                            <MatchList
                                events={currEvents}
                                type="live"
                                limit={3}
                                onSubmit={HandleOnSubmit}
                            />
                        </div>
                        <div className="matches-container-right">
                            <div className="header">
                                <div className="title">
                                    <h2>NEXT MATCHES</h2>
                                    <span><PiLineVerticalBold /></span>
                                    <button onClick={() => handlePickEvent('next')}>See all results</button>
                                </div>
                            </div>
                            <MatchList
                                events={currEvents}
                                type="next"
                                limit={8}
                                onSubmit={HandleOnSubmit}
                            />
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default NewEvent;