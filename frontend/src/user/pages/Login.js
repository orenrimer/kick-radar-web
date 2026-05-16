import React from 'react';

import AuthLayout from '../../shared/components/forms/AuthLayout';
import LoginForm from '../../shared/components/forms/LoginForm';

const Login = () => (
    <AuthLayout
        title="Sign In"
        subtitle="Please sign in to your account."
        footerPrompt="Don't have an account?"
        footerLinkLabel="Sign up"
        footerLinkTo="/auth/signup"
    >
        <LoginForm />
    </AuthLayout>
);

export default Login;
