import React from "react";

import { useState, useContext, useEffect } from "react";


import "./Taskbar.css"
import AuthContext from "../contexts/AuthContext";

const Taskbar = (props) => {


    const [activeCategory, setActiveCategory] = useState('all');
    const auth = useContext(AuthContext);


    useEffect(() => {
        props.onCatgoryChange(activeCategory);
    }, [activeCategory]);

    return (
        <React.Fragment>
            {
                auth.isLoggedIn && <div className="taskbar-menu">
                    <div className={`taskbar-events-catgory ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
                        <i class="fa-solid fa-list"></i>
                    </div>
                    <div className={`taskbar-events-catgory ${activeCategory === 'hosted' ? 'active' : ''}`} onClick={() => setActiveCategory('hosted')}>
                        <i class="fa-regular fa-star"></i>
                    </div>
                    <div className={`taskbar-events-catgory ${activeCategory === 'participated' ? 'active' : ''}`} onClick={() => setActiveCategory('participated')}>
                        <i class="fa-regular fa-calendar-check"></i>
                    </div>
                    <div className={`taskbar-events-catgory ${activeCategory === 'requested' ? 'active' : ''}`} onClick={() => setActiveCategory('requested')}>
                        <i class="fa-solid fa-clock-rotate-left"></i>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

export default Taskbar;