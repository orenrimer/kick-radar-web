import React from 'react';

import { useAuthForm } from './useAuthForm';
import AuthField from '../UIComponents/AuthField/AuthField';

const SignupForm = () => {
    const form = useAuthForm({
        fields: ['username', 'email', 'password'],
        endpoint: '/users/signup',
        // backend expects `name`, not `username`
        buildBody: ({ username, email, password }) => ({
            name: username,
            email,
            password,
        }),
    });

    return (
        <form className="signin-form" onSubmit={form.handleSubmit} noValidate>
            <AuthField
                type="text"
                name="username"
                label="Name"
                placeholder="Your name"
                value={form.values.username}
                error={form.errors.username}
                onChange={form.handleChange('username')}
            />
            <AuthField
                type="email"
                name="email"
                label="Email"
                placeholder="example@email.com"
                value={form.values.email}
                error={form.errors.email}
                onChange={form.handleChange('email')}
            />
            <AuthField
                type="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={form.values.password}
                error={form.errors.password}
                onChange={form.handleChange('password')}
                showPassword={form.showPassword}
                togglePassword={form.togglePassword}
            />

            {form.error && <p className="auth-error-banner">{form.error}</p>}

            <button type="submit" className="signin-btn">
                Sign Up
            </button>
        </form>
    );
};

export default SignupForm;
