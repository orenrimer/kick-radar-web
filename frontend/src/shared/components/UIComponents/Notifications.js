import React, { useContext } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import AuthContext from "../contexts/AuthContext";
import { useHttpClient } from '../hooks/http-hook';

import "./Notifications.css";



const Notifications = () => {
    const { notifications, setNotifications } = useContext(NotificationContext);
    const auth = useContext(AuthContext);
    const { sendRequest } = useHttpClient();

    const handleDecision = async (requestId, status) => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/requests/${requestId}`,
                'PATCH',
                JSON.stringify({
                    status,
                    requestId,
                    hostId: auth.userId,
                }),
                {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${auth.token}`
                });

            // setNotifications()
        } catch (err) { }
    };

    return (
        <div className="request-inner">
            <div className="request-inner__top">
                <h3>Notifications</h3>
            </div>
            <ul className="request-inner__list">
                {notifications && notifications.map((notification) => (
                    <li key={notification._id} className="request">
                        <div className="notification-info">
                            <img src={`${process.env.REACT_APP_STATIC_URL}/${notification.requesterId.image}`} />
                            <p>
                                <b>{notification.requesterId.name}</b> wants to join your event:
                                <br />
                                <b>{notification.eventId.title}</b>
                            </p>
                        </div >
                        <div className="request__actions">
                            <button onClick={() => handleDecision(notification._id, "accepted")}>
                                Accept
                            </button>
                            <button onClick={() => handleDecision(notification._id, "declined")}>
                                Decline
                            </button>
                        </div>
                    </li>
                ))}
                {(!notifications || notifications.length === 0) && <p>No New Notifications.</p>}
            </ul>
        </div >
    );
};

export default Notifications;
