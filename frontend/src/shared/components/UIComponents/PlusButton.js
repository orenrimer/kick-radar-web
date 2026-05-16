import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../contexts/AuthContext';
import './PlusButton.css';

const PlusButton = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <Link className="plus-button" to={isLoggedIn ? '/events/new' : '/auth/login'}>
            <div className="tooltip">Add an Event</div>
            <div className="plus-sign">+</div>
        </Link>
    );
};

export default PlusButton;
