import React, { useState, useReducer, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useHttpClient } from '../hooks/http-hook';
import ImageUpload from './ImageUpload';
import Loading from '../UIComponents/Loading';
import AuthContext from '../contexts/AuthContext';
import CustomButton from '../UIComponents/CustomButton';

import './LoginForm.css';


const initialValue = {
    username: {
        value: '',
        isValid: false
    },
    email: {
        value: '',
        isValid: false
    },
    password: {
        value: '',
        isValid: false
    }
};


const inputReducer = (inputState, action) => {
    switch (action.type) {
        case 'username':
            return { ...inputState, username: { "value": action.payload, isValid: action.payload.length > 0 } }
        case 'email':
            return { ...inputState, email: { "value": action.payload, isValid: action.payload && /^\S+@\S+\.\S+$/.test(action.payload) } };
        case 'password':
            return { ...inputState, password: { "value": action.payload, isValid: action.payload.length >= 8 && action.payload.length <= 12 } };
        case 'reset':
            return initialValue;
        default:
            return inputState;
    }
};


const Auth = (props) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [inputState, dispatch] = useReducer(inputReducer, initialValue);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [showPassword, setShowPassword] = useState(false);
    const auth = useContext(AuthContext);

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: ''
    })

    function validateForm() {
        let isValid = true;
        let newErrors = {
            username: '',
            email: '',
            password: ''
        }
        if (!inputState.email.isValid) {
            newErrors.email = "Please provide a valid email address.";
            isValid = false;
        }
        if (!inputState.password.isValid) {
            newErrors.password = "Password must be 8-12 characters long.";
            isValid = false;
        }
        if (!isLoginMode && !inputState.username.isValid) {
            newErrors.username = "Please provide a username.";
            isValid = false;
        }
        return { newErrors, isValid };
    }

    const togglePassword = () => setShowPassword(!showPassword);

    const HandleModeSwitch = () => {
        dispatch({ type: 'reset', payload: null })
        setIsLoginMode(prev => !prev)
        setErrors({
            username: '',
            email: '',
            password: ''
        })

        clearError();
    }


    const HandleOnSubmit = async (event) => {
        event.preventDefault();

        const { newErrors, isValid } = validateForm();
        setErrors(newErrors);

        if (!isValid) return;

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/login`,
                    'POST',
                    JSON.stringify({
                        email: inputState.email.value,
                        password: inputState.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                console.log(responseData)

                if (props.onSubmit) props.onSubmit();
                auth.login(responseData.userId, responseData.token);
            } catch (err) { }
        } else {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
                    'POST',
                    JSON.stringify({
                        name: inputState.username.value,
                        email: inputState.email.value,
                        password: inputState.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );

                console.log(responseData)
                if (props.onSubmit) props.onSubmit();
                auth.login(responseData.userId, responseData.token);
            } catch (err) { }
        }
    }

    return (
        <React.Fragment>
            {/* {isLoading && <Loading asOverlay />} */}

            <div className="signin-container">
                <div className="signin-box">
                    <h2>{isLoginMode ? "Sign In" : "Create an account"}</h2>
                    <p>{isLoginMode ? "Please sign in to your account." : "Please enter your information."}</p>

                    <form className="signin-form" onSubmit={HandleOnSubmit}>
                        {!isLoginMode &&
                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="username">Name</label>
                                <div className={`${errors.username.length > 0 ? "input-error" : ''}`}>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="name"
                                        value={inputState.username.value}
                                        onChange={(event) => {
                                            setErrors((prev) => { return { ...prev, 'username': '' } })
                                            dispatch({ type: 'username', payload: event.target.value })
                                            clearError();
                                        }} />
                                </div>
                                {errors.username.length > 0 && <div className='input-error-msg'>
                                    <i class="fa-solid fa-triangle-exclamation"></i>
                                    <p>{errors.username}</p>
                                </div>}
                            </div>}

                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="email">E-mail</label>
                            <div className={`${errors.username.length > 0 ? "input-error" : ''}`}>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="email"
                                    value={inputState.email.value}
                                    onChange={(event) => {
                                        setErrors((prev) => { return { ...prev, 'email': '' } })
                                        dispatch({ type: 'email', payload: event.target.value })
                                        clearError();
                                    }}
                                    style={{ "outline": errors.email.length > 0 ? "red" : "none" }} />
                            </div>
                            {errors.email.length > 0 && <div className='input-error-msg'>
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>{errors.email}</p>
                            </div>}
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label htmlFor="password">Password</label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="password"
                                    value={inputState.password.value}
                                    onChange={(event) => {
                                        setErrors((prev) => { return { ...prev, 'password': '' } })
                                        dispatch({ type: 'password', payload: event.target.value })
                                        clearError();
                                    }}
                                />
                                <span onClick={togglePassword}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            {errors.password.length > 0 &&
                                <div className='input-error-msg'>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <p>{errors.password}</p>
                                </div>}
                        </div>
                        <button type="submit" className="signin-btn">
                            {isLoginMode ? 'LOGIN' : 'REGISTER'}
                        </button>
                    </form>

                    <div className="links">
                        {isLoginMode ?
                            <p>Don't have an account? <a onClick={HandleModeSwitch}>Sign up</a></p> :
                            <p>Already have an account? <a onClick={HandleModeSwitch}>Sign in</a></p>
                        }
                    </div>
                </div>
            </div>



            {/* <form className='auth-form' onSubmit={HandleOnSubmit}>
                <div className='auth-form-top'>
                    <h2>{isLoginMode ? "Sign In" : "Create an account"}</h2>
                    {error && <div className='error-msg'><p>{error}</p></div>}

                    {!isLoginMode && <div className='form-field-outer'>
                        <label>Username</label>
                        <div className={`form-field-inner ${errors.username.length > 0 ? "input-error" : ''}`}>
                            <input
                                id="username"
                                type="text"
                                placeholder='Enter your username'
                                value={inputState.username.value}
                                onChange={(event) => {
                                    setErrors((prev) => { return { ...prev, 'username': '' } })
                                    dispatch({ type: 'username', payload: event.target.value })
                                    clearError();
                                }}

                            />
                        </div>
                        {errors.username.length > 0 && <div className='input-error-msg'>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p>{errors.username}</p>
                        </div>}
                    </div>}
                    <div className='form-field-outer'>
                        <label>Email</label>
                        <div className={`form-field-inner ${errors.email.length > 0 ? "input-error" : ''}`}>
                            <input
                                id="email"
                                type="text"
                                placeholder='Enter your email'
                                value={inputState.email.value}
                                onChange={(event) => {
                                    setErrors((prev) => { return { ...prev, 'email': '' } })
                                    dispatch({ type: 'email', payload: event.target.value })
                                    clearError();
                                }}
                                style={{ "outline": errors.email.length > 0 ? "red" : "none" }}
                            />
                        </div>
                        {errors.email.length > 0 && <div className='input-error-msg'>
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <p>{errors.email}</p>
                        </div>}
                    </div>
                    <div className='form-field'>
                        <div className='form-field-outer'>
                            <label>Password</label>
                            <div className={`form-field-inner ${errors.password.length > 0 ? "input-error" : ''}`}>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder='Enter your password'
                                    value={inputState.password.value}
                                    onChange={(event) => {
                                        setErrors((prev) => { return { ...prev, 'password': '' } })
                                        dispatch({ type: 'password', payload: event.target.value })
                                        clearError();
                                    }}
                                />
                            </div>
                            {errors.password.length > 0 &&
                                <div className='input-error-msg'>
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                    <p>{errors.password}</p>
                                </div>}
                        </div>
                    </div>
                </div>

                <div className='form-footer'>
                    <CustomButton size="big" type="submit" primary>
                        {isLoginMode ? 'LOGIN' : 'REGISTER'}
                    </CustomButton>

                    <div className='form-footer__btn'>
                        {isLoginMode ?
                            <p>Don't have an account? <a onClick={HandleModeSwitch}>Sign up</a></p> :
                            <p>Already have an account? <a onClick={HandleModeSwitch}>Sign in</a></p>
                        }
                    </div>
                </div>
            </form> */}
        </React.Fragment>
    );
};

export default Auth;
