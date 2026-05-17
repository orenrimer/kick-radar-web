import React from 'react';
import { Link } from 'react-router-dom';

import './PlusButton.css';

const PlusButton = () => (
    <Link className="plus-button" to="/events/new">
        <div className="tooltip">Add an Event</div>
        <div className="plus-sign">+</div>
    </Link>
);

export default PlusButton;
