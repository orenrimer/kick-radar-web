import React from 'react';
import { IoFootball } from "react-icons/io5";
import "./Marker.css"



const Marker = ({ distance, isCenter }) => {
    return (
        <React.Fragment>
            {!isCenter && <div className="distance-badge">
                <div className="icon">
                    <IoFootball />
                </div>
                <span>{distance} km</span>
            </div>}
            {isCenter && <div className="ripple-container">
                <div className="circle large"></div>
                <div className="circle medium"></div>
                <div className="circle small"></div>
            </div>}
        </React.Fragment>



    )
};



export default Marker;