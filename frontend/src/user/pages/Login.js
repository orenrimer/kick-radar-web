import React from 'react';

import AuthLayout from '../../shared/components/forms/AuthLayout';
import LoginForm from '../../shared/components/forms/LoginForm';

const Login = () => (
    <AuthLayout
        title="Welcome back"
        footerPrompt="Don't have an account?"
        footerLinkLabel="Sign up for free"
        footerLinkTo="/auth/signup"
    >
        <LoginForm />
    </AuthLayout>
);

export default Login;
