import React, { useContext, createContext, useState, useEffect } from "react";
import { useHttpClient } from '../hooks/http-hook';
import AuthContext from "../contexts/AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        try {
            const resp = await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/requests/user/${auth.userId}`
            );
            setNotifications(resp);
        } catch (error) { }
    };

    useEffect(() => {
        fetchNotifications();

        const ws = new WebSocket("ws://localhost:5000");

        ws.onopen = () => {
            console.log("WebSocket connection established.");
        };

        ws.onmessage = (event) => {
            fetchNotifications();
            // const newNotification = JSON.parse(event.data);

            // if (newNotification.hostId !== auth.userId) {
            //     return;
            // }
            // if (newNotification.type === "new-request") {
            //     console.log("new request incoming")
            //     setNotifications((prev) => [...prev, newNotification]);
            // }
            // else if (newNotification.type === "cancel-request" || newNotification.type === "update-request") {
            //     setNotifications((prev) => {
            //         const updatedNotifications = [...prev];
            //         return updatedNotifications.filter((n) => n.requestId !== newNotification.requestId)
            //     });
            // }
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [auth.userId]);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};








// import React, { useContext, createContext, useState, useEffect } from "react";
// import { useHttpClient } from '../hooks/http-hook';
// import AuthContext from "../contexts/AuthContext";


// export const NotificationContext = createContext();

// export const NotificationProvider = ({ children }) => {
//     const { isLoading, error, sendRequest, clearError } = useHttpClient();
//     const auth = useContext(AuthContext);
//     const [notifications, setNotifications] = useState([]);



//     const fetchNotifications = async () => {
//         try {
//             const resp = await sendRequest(
//                 `${process.env.REACT_APP_BACKEND_URL}/requests/user/${auth.userId}`
//             );
//             setNotifications(resp)
//         } catch (error) { }
//     };

//     useEffect(() => {
//         fetchNotifications();
//         // Poll the backend every 30 seconds for new notifications
//         const interval = setInterval(fetchNotifications, 30000);
//         return () => clearInterval(interval);
//     }, [auth.userId]);

//     return (
//         <NotificationContext.Provider value={{ notifications, setNotifications }}>
//             {children}
//         </NotificationContext.Provider>
//     );
// };
