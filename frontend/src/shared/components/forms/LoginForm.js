import React from 'react';

import { useAuthForm } from './useAuthForm';
import AuthField from '../UIComponents/AuthField/AuthField';

const LoginForm = () => {
    const form = useAuthForm({
        fields: ['email', 'password'],
        endpoint: '/users/login',
        buildBody: ({ email, password }) => ({ email, password }),
    });

    return (
        <form className="signin-form" onSubmit={form.handleSubmit} noValidate>
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
                Log In
            </button>
        </form>
    );
};

export default LoginForm;
