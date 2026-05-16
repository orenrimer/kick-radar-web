import React, { useState, useReducer, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useHttpClient } from '../hooks/http-hook';
import AuthContext from '../contexts/AuthContext';

const initialState = {
    username: { value: '', isValid: false },
    email: { value: '', isValid: false },
    password: { value: '', isValid: false },
};

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'username':
            return {
                ...state,
                username: { value: action.payload, isValid: action.payload.length > 0 },
            };
        case 'email':
            return {
                ...state,
                email: {
                    value: action.payload,
                    isValid: /^\S+@\S+\.\S+$/.test(action.payload),
                },
            };
        case 'password':
            return {
                ...state,
                password: {
                    value: action.payload,
                    isValid: action.payload.length >= 8 && action.payload.length <= 12,
                },
            };
        default:
            return state;
    }
};

const SignupForm = () => {
    const auth = useContext(AuthContext);
    const { error, sendRequest, clearError } = useHttpClient();
    const [inputState, dispatch] = useReducer(inputReducer, initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });

    const validate = () => {
        const next = { username: '', email: '', password: '' };
        if (!inputState.username.isValid) next.username = 'Please provide a username.';
        if (!inputState.email.isValid) next.email = 'Please provide a valid email address.';
        if (!inputState.password.isValid) next.password = 'Password must be 8-12 characters long.';
        return next;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (validationErrors.username || validationErrors.email || validationErrors.password) return;

        try {
            const data = await sendRequest('/users/signup', 'POST', {
                name: inputState.username.value,
                email: inputState.email.value,
                password: inputState.password.value,
            });
            auth.login(data.userId, data.token);
        } catch {
            // error surfaced via useHttpClient
        }
    };

    return (
        <form className="signin-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="username">Name</label>
                <div className={errors.username ? 'input-error' : ''}>
                    <input
                        type="text"
                        id="username"
                        placeholder="name"
                        value={inputState.username.value}
                        onChange={(e) => {
                            setErrors((prev) => ({ ...prev, username: '' }));
                            dispatch({ type: 'username', payload: e.target.value });
                            clearError();
                        }}
                    />
                </div>
                {errors.username && (
                    <div className="input-error-msg">
                        <i className="fa-solid fa-triangle-exclamation" />
                        <p>{errors.username}</p>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email">E-mail</label>
                <div className={errors.email ? 'input-error' : ''}>
                    <input
                        type="email"
                        id="email"
                        placeholder="email"
                        value={inputState.email.value}
                        onChange={(e) => {
                            setErrors((prev) => ({ ...prev, email: '' }));
                            dispatch({ type: 'email', payload: e.target.value });
                            clearError();
                        }}
                    />
                </div>
                {errors.email && (
                    <div className="input-error-msg">
                        <i className="fa-solid fa-triangle-exclamation" />
                        <p>{errors.email}</p>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="password">Password</label>
                <div className="password-input">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="password"
                        value={inputState.password.value}
                        onChange={(e) => {
                            setErrors((prev) => ({ ...prev, password: '' }));
                            dispatch({ type: 'password', payload: e.target.value });
                            clearError();
                        }}
                    />
                    <span onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                {errors.password && (
                    <div className="input-error-msg">
                        <i className="fa-solid fa-triangle-exclamation" />
                        <p>{errors.password}</p>
                    </div>
                )}
            </div>

            {error && <p className="auth-error-banner">{error}</p>}

            <button type="submit" className="signin-btn">REGISTER</button>
        </form>
    );
};

export default SignupForm;
