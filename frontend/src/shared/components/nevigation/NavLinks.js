import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';

import { useHttpClient } from "../hooks/http-hook";
import Notifications from "../UIComponents/Notifications";
import { NotificationContext } from "../contexts/NotificationContext";
import AuthContext from "../contexts/AuthContext";

import "./NavLinks.css"
import CustomButton from "../UIComponents/CustomButton";


const NavLinks = (props) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { notifications } = useContext(NotificationContext); // Access notifications from context


    return (
        <div className="nav-links">
            {/* <li>
                <NavLink to='/events/new' exact >
                    <div className="nav-link-create-event-btn">
                        <i className="fa-solid fa-tv" style={{ fontSize: "18px" }}></i>
                        <span >Create event</span>
                    </div>
                </NavLink>
            </li > */}
            {/* <li>
                <div className="navlink-button" style={{ position: "relative" }}>
                    <CustomButton onClick={() => { setShowUserMenu(prev => !prev); setShowNotifications(false); }} >
                        <i className="fa-regular fa-user" style={{ fontSize: "18px" }}></i>
                    </CustomButton>
                    {showUserMenu && <div className="user-dropdown">
                        {
                            auth.isLoggedIn && <div className="nav-dropdown-item"> <NavLink to={`/users/${auth.userId}`} onClick={() => { setShowUserMenu(false); setShowNotifications(false); }}>
                                My Account
                            </NavLink></div>
                        }
                        {
                            auth.isLoggedIn &&
                            <div className="nav-dropdown-item"><button onClick={() => {
                                navigate('/');
                                auth.logout();
                            }} >Sign out</button></div>
                        }
                        {!auth.isLoggedIn && <div className="nav-dropdown-item"><NavLink to='/auth' >Sign In</NavLink></div>}
                    </div>}
                </div>
            </li> */}
            {auth.isLoggedIn &&
                <li>
                    <div className="navlink-button" style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        border: "none",
                        background: "white",
                        borderRadius: "50%",
                        width: "64px",
                        height: "64px",
                    }} >
                        <button
                            onClick={() => { setShowUserMenu(false); setShowNotifications((prev) => !prev); }}
                        >
                            <i className="fa-regular fa-bell" style={{ fontSize: "22px" }}></i>
                            {notifications.length > 0 && (
                                <span />
                            )}
                        </button>

                        {showNotifications && (
                            <div className="notifications-dropdown">
                                <Notifications />
                            </div>
                        )}
                    </div>
                </li>
            }
        </div >
    );
}

export default NavLinks;