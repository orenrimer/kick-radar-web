import React, { useState, useContext } from "react";
import { useHistory } from 'react-router-dom';

import { useHttpClient } from "../../shared/components/hooks/http-hook";
import AuthContext from "../../shared/components/contexts/AuthContext";
import CustomButton from "../../shared/components/UIComponents/CustomButton";
import Card from "../../shared/components/UIComponents/Card";
import Modal from "../../shared/components/UIComponents/Modal";
import LoginForm from "../../shared/components/forms/LoginForm";
import Loading from "../../shared/components/UIComponents/Loading";
import { FaArrowRight, FaRegBookmark } from "react-icons/fa";
import { IoTicket } from "react-icons/io5";

import "./EventItem.css"



const EventItem = (props) => {
    const auth = useContext(AuthContext);
    const history = useHistory();

    const [showLogin, setShowLogin] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [numOfParticipants, setnumOfParticipants] = useState(props.numOfParticipants);
    const [isParticipating, setIsParticipating] = useState(props.isParticipated);
    const [isRequested, setIsRequested] = useState(props.isRequested);

    const { sendRequest } = useHttpClient();

    const handleDeleteEvent = async () => {
        setShowConfirm(false);
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/events/${props.id}`,
                'DELETE',
                null,
                { Authorization: `Bearer ${auth.token}` }
            );
            props.onDelete(props.id);
        } catch (err) { }
    };


    const handleJoinRequest = async () => {
        if (!auth.isLoggedIn) {
            history.push('/auth');
            return;
        }

        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/requests/send`,
                'POST',
                JSON.stringify({
                    eventId: props.id,
                    requesterId: auth.userId,
                    hostId: props.host
                }),
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            );
            setIsRequested(true);
            props.onJoinRequest(props.self);
        } catch (err) { }
    };


    const handleCancelParticipation = async () => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`,
                'PATCH',
                JSON.stringify({
                    eventId: props.id,
                    requesterId: auth.userId,
                    hostId: props.host
                }),
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            );
            setIsParticipating(false);
            setnumOfParticipants(prev => prev - 1);
            props.onCancelParticipation(props.id);
        } catch (err) { }
    }


    const handleCancelRequest = async () => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/requests/${props.id}/${auth.userId}`,
                'DELETE',
                null,
                {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                }
            )
            setIsRequested(false);
            props.onCancelRequest(props.id);
        } catch (err) { }
    }

    // const handeLikePlace = async () => {
    //     if (isLoading) return;

    //     const newLikes = (isLiked) ? likes - 1 : likes + 1;
    //     try {
    //         const response = await sendRequest(
    //             `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`
    //         );

    //         let newPlaces;
    //         if (!isLiked) {
    //             response.user.likedPlaces.push(props.id);
    //             newPlaces = [...response.user.likedPlaces]
    //         } else {
    //             newPlaces = response.user.likedPlaces.filter((place) => place !== props.id);
    //         }

    //         const res2 = await sendRequest(
    //             `${process.env.REACT_APP_BACKEND_URL}/users/${auth.userId}`,
    //             'PATCH',
    //             JSON.stringify({
    //                 likedPlaces: newPlaces
    //             }),
    //             {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${auth.token}`
    //             }
    //         );


    //         let newLikeList;
    //         if (!isLiked) {
    //             props.likedBy.push(auth.userId);
    //             newLikeList = [...props.likedBy]
    //         } else {
    //             newLikeList = props.likedBy.filter((userId) => userId !== auth.userId);
    //         }

    //         const res3 = await sendRequest(
    //             `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
    //             'PATCH',

    //             JSON.stringify({
    //                 title: props.title,
    //                 description: props.description,
    //                 likes: newLikes,
    //                 likedBy: newLikeList
    //             }),
    //             {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${auth.token}`
    //             }
    //         );


    //         props.onLike(props.id, !isLiked);
    //         setLikes(newLikes)
    //         setIsLiked(prev => !prev)
    //     } catch (err) { }
    // };

    return (
        <React.Fragment>
            <Modal warning header="Delete Event"
                show={showConfirm}
                handleClose={() => setShowConfirm(false)}
                footer={
                    <div style={{ width: "100%", display: "flex", justifyContent: "end", marginBottom: "0.5rem" }}>
                        <CustomButton style={{ marginRight: "0.5rem" }} size="small" primary onClick={() => setShowConfirm(false)}>
                            CANCEL
                        </CustomButton>
                        <CustomButton size="small" danger onClick={handleDeleteEvent}>
                            CONFIRM
                        </CustomButton>
                    </div>
                }>
                <p>
                    Are you sure you want to proceed and delete this event?
                </p>
            </Modal>

            <div className="event-card">
                <div className="event-content">
                    <div className="event-header">
                        <h3>{props.title}</h3>
                        <span className="category">{props.description}</span>
                    </div>
                    <div className="event-details">
                        <p><i className="fa-solid fa-location-dot"></i> {props.address}</p>
                        <p><i className="fa-regular fa-calendar-days"></i>{props.startTime}</p>
                        <p><IoTicket style={{ fontSize: "18px", marginRight: "0.5rem" }} />{numOfParticipants}</p>
                    </div>
                    <div className="event-actions">
                        {auth.userId !== props.host && !isParticipating && !isRequested &&
                            <div className="event-item__action">
                                {auth.isLoggedIn ? <button onClick={handleJoinRequest}>
                                    Request to Join <FaArrowRight />
                                </button> : <a href="./auth">
                                    Request to Join <FaArrowRight /></a>}

                            </div >
                        }
                        {auth.userId !== props.host && isParticipating && <div className="event-item__action">
                            <button onClick={handleCancelParticipation}>
                                Leave event
                            </button>
                        </div >
                        }

                        {auth.userId !== props.host && isRequested && !isParticipating && <div className="event-item__action">
                            <button onClick={handleCancelRequest}>
                                Cancel request
                            </button>
                        </div >
                        }

                        {auth.userId === props.host && <div className="event-item__action">
                            <button onClick={() => { if (auth.isLoggedIn) setShowConfirm(true) }}>
                                Cancel Event
                            </button>
                        </div >
                        }
                        {/* <button className="bookmark-btn">
                            <FaRegBookmark />
                        </button> */}
                    </div>
                </div>
            </div>


            {/* 

            <Card style={props.style}>
                <li style={props.style} className={`place-item ${!props.showFull ? "mini" : ''}`} >
                    <div className="place-item__content">
                        <div className='place-item__content-top'>
                            <h4>{props.title}</h4>
                            <p>{props.description}</p>
                        </div>

                        {props.showFull && <div className="place-item__content-middle">
                            <div className="place-item__content-middle-item" style={{ flex: 6 }}>
                                <div className="place-item__content-middle-item-header" >
                                    <i className="fa-solid fa-location-dot"></i>
                                    <p>Location</p>
                                </div>

                                <p style={{ overflow: "hidden" }}>{props.address}</p>
                            </div>
                            <div className="place-item__content-middle-item" style={{ flex: 3 }}>
                                <div className="place-item__content-middle-item-header">
                                    <i className="fa-regular fa-calendar-days"></i>
                                    <p>Starts</p>
                                </div>
                                <p>{props.startTime}</p>
                            </div>
                            <div className="place-item__content-middle-item" style={{ flex: 1 }}>
                                <div className="place-item__content-middle-item-header">
                                    <i className="fa-solid fa-ticket"></i>
                                    <p>Joined</p>
                                </div>
                                <p>{numOfParticipants}</p>
                            </div>
                        </div>}

                        <div className="place-item__content-bottom">
                            <div className={props.showFull ? `place-item__actions` : `place-item__actions-mini`}>
                                {props.showFull && auth.userId !== props.host && !isParticipating && !isRequested &&
                                    <div className="event-item__action">
                                        {auth.isLoggedIn ? <button onClick={handleJoinRequest}>

                                            Request to join
                                        </button> : <a href="./auth">
                                            Request to join</a>}

                                    </div >
                                }
                                {props.showFull && auth.userId !== props.host && isParticipating && <div className="event-item__action">
                                    <button onClick={handleCancelParticipation}>
                                        Leave event
                                    </button>
                                </div >
                                }

                                {props.showFull && isRequested && !isParticipating && <div className="event-item__action">
                                    <button onClick={handleCancelRequest}>
                                        Cancel request
                                    </button>
                                </div >
                                }

                                {props.showFull && auth.userId === props.host &&
                                    <div className="event-item__action">
                                        <button onClick={() => { if (auth.isLoggedIn) setShowConfirm(true) }}>
                                            <i class="fa-solid fa-trash"></i>
                                            Cancel Event
                                        </button>
                                    </div >
                                }
                                {!props.showFull && <CustomButton href={`/events/${props.id}`} size="small" primary onClick={() => { }}>
                                    See full details
                                </CustomButton>}

                            </div>
                        </div>
                    </div>
                </li >
            </Card> */}

        </React.Fragment >
    )
}

export default EventItem;