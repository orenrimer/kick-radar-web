import React from 'react';

import AuthLayout from '../../shared/components/forms/AuthLayout';
import SignupForm from '../../shared/components/forms/SignupForm';

const Signup = () => (
    <AuthLayout
        title="Create an account"
        footerPrompt="Already have an account?"
        footerLinkLabel="Sign in"
        footerLinkTo="/auth/login"
    >
        <SignupForm />
    </AuthLayout>
);

export default Signup;
