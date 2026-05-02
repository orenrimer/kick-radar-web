import React, { useState, useEffect, useReducer, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../../shared/components/hooks/http-hook';
import { FaLongArrowAltLeft } from "react-icons/fa";

import Loading from '../../shared/components/UIComponents/Loading';
import Modal from '../../shared/components/UIComponents/Modal';
import useMediaQuery from '../../shared/components/hooks/use-media-hook';
import AuthContext from '../../shared/components/contexts/AuthContext';
import { PiLineVerticalBold } from "react-icons/pi";

import './NewEvent.css';


const events = [
    {
        "fixture": {
            "id": 1298738,
            "referee": null,
            "timezone": "UTC",
            "date": "2024-11-28T00:30:00+00:00",
            "timestamp": 1732753800,
            "periods": {
                "first": null,
                "second": null
            },
            "venue": {
                "id": null,
                "name": "Stade Jacques Pontrémy",
                "city": "Le-Moule"
            },
            "status": {
                "long": "Not Started",
                "short": "NS",
                "elapsed": null,
                "extra": null
            }
        },
        "league": {
            "id": 377,
            "name": "Division d'Honneur",
            "country": "Guadeloupe",
            "logo": "https://media.api-sports.io/football/leagues/377.png",
            "flag": "https://media.api-sports.io/flags/gp.svg",
            "season": 2024,
            "round": "Regular Season - 4"
        },
        "teams": {
            "home": {
                "id": 15551,
                "name": "CERFA",
                "logo": "https://media.api-sports.io/football/teams/15551.png",
                "winner": null
            },
            "away": {
                "id": 3203,
                "name": "Moulien",
                "logo": "https://media.api-sports.io/football/teams/3203.png",
                "winner": null
            }
        },
        "goals": {
            "home": null,
            "away": null
        },
        "score": {
            "halftime": {
                "home": null,
                "away": null
            },
            "fulltime": {
                "home": null,
                "away": null
            },
            "extratime": {
                "home": null,
                "away": null
            },
            "penalty": {
                "home": null,
                "away": null
            }
        }
    },
    {
        "fixture": {
            "id": 1298738,
            "referee": null,
            "timezone": "UTC",
            "date": "2024-11-28T00:30:00+00:00",
            "timestamp": 1732753800,
            "periods": {
                "first": null,
                "second": null
            },
            "venue": {
                "id": null,
                "name": "Stade Jacques Pontrémy",
                "city": "Le-Moule"
            },
            "status": {
                "long": "Not Started",
                "short": "NS",
                "elapsed": null,
                "extra": null
            }
        },
        "league": {
            "id": 377,
            "name": "Division d'Honneur",
            "country": "Guadeloupe",
            "logo": "https://media.api-sports.io/football/leagues/377.png",
            "flag": "https://media.api-sports.io/flags/gp.svg",
            "season": 2024,
            "round": "Regular Season - 4"
        },
        "teams": {
            "home": {
                "id": 15551,
                "name": "REAL MADRID",
                "logo": "https://media.api-sports.io/football/teams/15551.png",
                "winner": null
            },
            "away": {
                "id": 3203,
                "name": "Barcelona",
                "logo": "https://media.api-sports.io/football/teams/3203.png",
                "winner": null
            }
        },
        "goals": {
            "home": null,
            "away": null
        },
        "score": {
            "halftime": {
                "home": null,
                "away": null
            },
            "fulltime": {
                "home": null,
                "away": null
            },
            "extratime": {
                "home": null,
                "away": null
            },
            "penalty": {
                "home": null,
                "away": null
            }
        }
    }
]



const NewEvent = () => {
    const [eventList, setEventList] = useState([]);
    const [currEvents, setCurrEvents] = useState([]);

    const [pickedEvent, setPickedEvent] = useState();
    const [showEventDetails, setShowEventDetails] = useState(false);

    const [eventFilter, setEventFilter] = useState('');

    const [modalEventFilter, setModalEventFilter] = useState('');
    const [modalFilteredEvents, setModalFilteredEvents] = useState([]);

    const [position, setPosition] = useState({ lat: null, lng: null });

    const { isLoading, sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const isSmallScreen = useMediaQuery("(max-width: 1400px)");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const currDate = new Date().toJSON().slice(0, 10);
                const responseData = await sendRequest(
                    `https://v3.football.api-sports.io/fixtures?date=${currDate}&status=NS-1H-HT-2H-ET-P&timezone=Asia/Jerusalem`,
                    'GET',
                    null,
                    {
                        "x-rapidapi-key": "ca8f9b4de21ffa3173390ced3d934c40",
                        "x-rapidapi-host": "v3.football.api-sports.io"
                    }
                );

                const eventsDetailes = responseData.response.map((event) => ({
                    homeTeamName: event.teams.home.name,
                    awayTeamName: event.teams.away.name,
                    homeTeamLogo: event.teams.home.logo,
                    awayTeamLogo: event.teams.away.logo,
                    league: event.league.name,
                    startTime: event.fixture.date,
                    isLive: event.fixture.status.short !== "NS",
                    currMinute: event.fixture.status.elapsed,
                    score: event.goals
                }));

                setEventList(eventsDetailes);
                setCurrEvents(eventsDetailes);
            } catch (err) { }
        };

        fetchEvents();
    }, [sendRequest]);

    useEffect(() => {
        const filtered = eventList.filter(x =>
            x.homeTeamName.toLowerCase().includes(eventFilter.toLowerCase()) ||
            x.awayTeamName.toLowerCase().includes(eventFilter.toLowerCase())
        );
        setCurrEvents(filtered);
    }, [eventFilter, eventList]);

    useEffect(() => {
        if (!pickedEvent) return;

        const filtered = eventList.filter(event =>
            event.homeTeamName.toLowerCase().includes(modalEventFilter.toLowerCase()) ||
            event.awayTeamName.toLowerCase().includes(modalEventFilter.toLowerCase())
        );
        setModalFilteredEvents(filtered);
    }, [modalEventFilter, eventList, pickedEvent]);


    useEffect(() => {
        if (isSmallScreen && showEventDetails) {
            setShowEventDetails(false);
        }
    }, [isSmallScreen, showEventDetails]);

    useEffect(() => {
        setShowEventDetails(true);
    }, [pickedEvent]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }
    }, []);

    const HandleOnSubmit = async (event) => {
        if (!auth.isLoggedIn) {
            history.push('/auth');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('coordinates', JSON.stringify(position));
            formData.append('title', `${event.homeTeamName} vs ${event.awayTeamName}`);
            formData.append('description', event.league);
            formData.append('startTime', event.startTime);

            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/events/`,
                'POST',
                formData,
                {
                    "Authorization": `Bearer ${auth.token}`,
                }
            );
            history.push('/');
        } catch (err) { }
    };

    const handlePickEvent = (type) => {
        setPickedEvent(type);
        setShowEventDetails(true);
        setModalEventFilter('');
        setModalFilteredEvents(eventList);
    };

    const renderLiveEvents = (numOfElements, events = currEvents) => {
        return (
            <div className="matches-list-live">
                {events.filter(e => e.isLive).slice(0, numOfElements).map((match, index) => (
                    <div key={index} className="match-card-live">
                        <div className='match-card-live-top'>
                            <div className="live-badge">
                                <span className="live-dot"></span> LIVE
                            </div>
                            <div className="live-minute"><p>{match.currMinute}'</p></div>
                            <div className="match-action-live">
                                <button onClick={() => HandleOnSubmit(match)}>
                                    Create event
                                </button>
                            </div>
                        </div>
                        <div className="match-card-live-teams">
                            <div className="team">
                                <img className="flag" src={match.homeTeamLogo} alt="home" />
                                <span className="team">{match.homeTeamName}</span>
                            </div>
                            <div className="score" style={{ color: "#0D1B2A" }}>{match.score.home}</div>
                        </div>
                        <div className="match-card-live-teams">
                            <div className="team">
                                <img className="flag" src={match.awayTeamLogo} alt="away" />
                                <span className="team">{match.awayTeamName}</span>
                            </div>
                            <div className="score" style={{ color: "#EF233C" }}>{match.score.away}</div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderNextEvents = (numOfElements, events = currEvents) => {
        return (
            <div className="matches-list">
                {events.filter(e => !e.isLive).slice(0, numOfElements).map((match, index) => (
                    <div key={index} className="match-card">
                        <div className='match-card-mini-top'>
                            <div className="match-info-mini">
                                <span>{match.startTime.slice(0, 10)}</span>
                                <span>{match.startTime.slice(11, 16)}</span>
                            </div>
                            <div className="match-action-mini">
                                <button onClick={() => HandleOnSubmit(match)}>
                                    Create event
                                </button>
                            </div>
                        </div>
                        <div className="teams">
                            <div className="home">
                                <img className="flag" src={match.homeTeamLogo} alt="home" />
                                <span className="team">{match.homeTeamName}</span>
                            </div>
                            <div className="teams-seprator"><span>VS</span></div>
                            <div className="away">
                                <span className="team">{match.awayTeamName}</span>
                                <img className="flag" src={match.awayTeamLogo} alt="away" style={{ marginLeft: "1rem" }} />
                            </div>
                        </div>
                        <div className="match-info">
                            <span className='match-info-date'>{match.startTime.slice(0, 10)}</span>
                            <span className='match-info-day'>{new Date(match.startTime.slice(0, 10)).toLocaleDateString("en-US", { weekday: "long" })}</span>
                            <span className='match-info-time'>{match.startTime.slice(11, 16)}</span>
                        </div>
                        <div className="match-action">
                            <button onClick={() => HandleOnSubmit(match)}>
                                Create event
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
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
                        {pickedEvent === "live" && renderLiveEvents(undefined, modalFilteredEvents)}
                        {pickedEvent === "next" && renderNextEvents(undefined, modalFilteredEvents)}
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
                            {renderLiveEvents(3)}
                        </div>
                        <div className="matches-container-right">
                            <div className="header">
                                <div className="title">
                                    <h2>NEXT MATCHES</h2>
                                    <span><PiLineVerticalBold /></span>
                                    <button onClick={() => handlePickEvent('next')}>See all results</button>
                                </div>
                            </div>
                            {renderNextEvents(8)}
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default NewEvent;