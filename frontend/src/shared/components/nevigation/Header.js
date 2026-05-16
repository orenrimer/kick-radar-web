import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { env } from '../../../config/env';

import CustomButton from "../UIComponents/CustomButton/CustomButton";
import Sidebar from "./Sidebar";
import Backdrop from "../UIComponents/Backdrop/Backdrop";
import NavLinks from "./NavLinks";

import "./Header.css"


const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <React.Fragment>

            <header className="main-header">
                <div className="main-navigation__logo">
                    <Link to="/" style={{ display: "flex" }}>
                        <img src={`${env.staticUrl}/footy-finder-logo-small.svg`} alt="Kick Radar" />
                    </Link>
                </div>
                <nav className="main-navigation__header-nav">
                    {/* <NavLinks /> */}
                </nav>
            </header>
        </React.Fragment >

    )

}


export default Header;