import React from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { env } from '../../../config/env';

import CustomButton from "../UIComponents/CustomButton";
import Sidebar from "./Sidebar";
import Backdrop from "../UIComponents/Backdrop";
import NavLinks from "./NavLinks";

import "./Header.css"


const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <React.Fragment>
            {/* {isDrawerOpen && <Backdrop />}
            {isDrawerOpen && <Sidebar>
                <nav className="main-navigation__drawer-nav">
                    <div className="main-navigation__drawer-nav-header">
                        <CustomButton onClick={() => setIsDrawerOpen(false)}>
                            <i className="fa-solid fa-x"></i>
                        </CustomButton>
                    </div>
                    <div className="main-navigation__drawer-nav-menu">
                        <NavLinks />
                    </div>
                </nav>
            </Sidebar>} */}

            <header className="main-header">
                {/* <div className="main-navigation__menu-btn">
                    <CustomButton size="big" onClick={() => setIsDrawerOpen(true)}>
                        <i className="fa-solid fa-bars"></i>
                    </CustomButton>
                </div> */}
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