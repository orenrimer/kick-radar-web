import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { PiSignInBold, PiSignOutBold } from "react-icons/pi";

import { resolveImageUrl } from '../../utils/resolveImageUrl';
import AuthContext from "../../shared/components/contexts/AuthContext";
import { useUser } from '../../queries/users';
import Avatar from "../../shared/components/UIComponents/Avatar/Avatar";

import "./User.css";


const User = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const { data: userResponse } = useUser(auth.userId, auth.token);
    const userData = userResponse?.user;

    return (
        <div className="user-info">
            {auth.isLoggedIn && userData && (
                <div className="user-info__image">
                    <Avatar image={resolveImageUrl(userData.image)} alt="Profile" />
                </div>
            )}
            {!auth.isLoggedIn && (
                <a href="/auth/login" className="user-info__signin">
                    <PiSignInBold />
                    <span>Sign in</span>
                </a>
            )}
            <div className="user-info__content">
                {auth.isLoggedIn && userData && (
                    <h5 style={{ fontSize: "14px", fontWeight: "700" }}>{userData.name}</h5>
                )}
                {auth.isLoggedIn && userData && <h5>{userData.email}</h5>}
            </div>
            {auth.isLoggedIn && userData && (
                <button onClick={() => { navigate('/'); auth.logout(); }}>
                    <PiSignOutBold style={{ fontSize: "20px" }} />
                </button>
            )}
        </div>
    );
};

export default User;
