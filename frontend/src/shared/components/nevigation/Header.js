import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PiSignInBold, PiSignOutBold } from 'react-icons/pi';

import AuthContext from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { useUser } from '../../../queries/users';
import { resolveImageUrl } from '../../../utils/resolveImageUrl';
import Avatar from '../UIComponents/Avatar/Avatar';
import Notifications from '../UIComponents/Notifications/Notifications';

import './Header.css';

const Header = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { notifications } = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const bellRef = useRef(null);

  const { data: userResponse } = useUser(auth.userId, auth.token);
  const userData = userResponse?.user;

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="page-header">
      <Link to="/" className="page-header__logo">
        <span className="page-header__logo-text">Kick Radar</span>
      </Link>

      <div className="page-header__actions">
        <div className="page-header__bell" ref={bellRef}>
          <button
            type="button"
            onClick={() => {
              setShowMenu(false);
              setShowNotifications((s) => !s);
            }}
          >
            <i className="fa-regular fa-bell" />
            {notifications.length > 0 && <span className="page-header__bell-dot" />}
          </button>
          {showNotifications && (
            <div className="page-header__dropdown">
              <Notifications />
            </div>
          )}
        </div>

        {auth.isLoggedIn && userData && (
          <div className="page-header__profile" ref={menuRef}>
            <button
              type="button"
              className="page-header__avatar"
              onClick={() => {
                setShowNotifications(false);
                setShowMenu((s) => !s);
              }}
            >
              <Avatar image={resolveImageUrl(userData.image)} alt="Profile" />
            </button>
            {showMenu && (
              <div className="page-header__dropdown page-header__menu">
                <Link to={`/users/${auth.userId}`} onClick={() => setShowMenu(false)}>
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    auth.logout();
                    navigate('/');
                  }}
                >
                  <PiSignOutBold />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        )}

        {!auth.isLoggedIn && (
          <Link to="/auth/login" className="page-header__signin">
            <PiSignInBold />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
