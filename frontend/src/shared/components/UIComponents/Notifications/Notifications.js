import React, { useContext } from "react";
import { useMutation } from '@tanstack/react-query';

import { NotificationContext } from "../../contexts/NotificationContext";
import AuthContext from "../../contexts/AuthContext";
import { updateRequestStatus } from '../../../../api/requests';
import { resolveImageUrl } from '../../../../utils/resolveImageUrl';

import "./Notifications.css";


const Notifications = () => {
    const { notifications, setNotifications } = useContext(NotificationContext);
    const auth = useContext(AuthContext);

    const decisionMutation = useMutation({
        mutationFn: ({ requestId, status }) =>
            updateRequestStatus(
                requestId,
                { status, requestId, hostId: auth.userId },
                auth.token
            ),
    });

    const handleDecision = (requestId, status) => {
        decisionMutation.mutate({ requestId, status });
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
                            <img src={resolveImageUrl(notification.requesterId.image)} alt="" />
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
