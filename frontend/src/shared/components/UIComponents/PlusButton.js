import React from "react";
import "./PlusButton.css"; // Import the CSS file

const PlusButton = () => {
    return (
        <a className="plus-button" href="./events/new">
            <div className="tooltip">Add an Event</div>
            <div className="plus-sign">+</div>
        </a>
    );
};


export default PlusButton;
