import React, { useState } from "react";
import "./MenuDropdown.css";

const MenuDropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button className="menu-button" onClick={toggleMenu}>
                <i class="fa-solid fa-sliders"></i>
            </button>
            <div className={`menu ${isOpen ? "open" : ""}`}>
                {props.children}
            </div>
        </div>
    );
};

export default MenuDropdown;
