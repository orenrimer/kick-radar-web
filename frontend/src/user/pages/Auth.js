import React from 'react';
import Card from '../../shared/components/UIComponents/Card';
import LoginForm from '../../shared/components/forms/LoginForm';

import "./Auth.css"

const Auth = () => {
    return (
        <React.Fragment>
            <Card className="authentication-continer">
                <div className='authentication-logo'>
                    <a href='/'>
                        <img src={`${process.env.REACT_APP_STATIC_URL}/kick-radar-logo.png`} alt style={{ width: "150px" }} />
                    </a>
                </div>
                <LoginForm />
                {/* <div className='authentication__form'>
                    </div> */}
            </Card >
            {/* <div className="authentication-continer">
                <div className="authentication-intro">
                    <div className='logo'>
                        <a href='/'>
                            <img src={`${process.env.REACT_APP_STATIC_URL}/footy-finder-logo.svg`} alt style={{ width: "200px" }} />
                        </a>
                    </div>
                    <h2>
                        Your ultimate companion for discovering live football <br /> match screenings near you!
                    </h2>
                    <span>
                        Never miss a moment of the action – find, plan, and enjoy your perfect matchday experience!
                    </span>
                </div>

            </div> */}
        </React.Fragment>
    );
};

export default Auth;
