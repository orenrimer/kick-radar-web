import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { env } from '../../../config/env';
import Card from '../UIComponents/Card/Card';
import GoogleSignInButton from './GoogleSignInButton';

import './AuthLayout.css';
import './LoginForm.css';

const AuthLayout = ({
  title,
  subtitle,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  children,
}) => {
  const [googleError, setGoogleError] = useState('');

  return (
    <Card className="authentication-continer">
      <div className="authentication-logo">
        <Link to="/">
          <img
            src={`${env.staticUrl}/kick-radar-logo.png`}
            alt="Kick Radar"
            style={{ width: '150px' }}
          />
        </Link>
      </div>

      <div className="signin-container">
        <div className="signin-box">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}

          <GoogleSignInButton
            onSuccess={() => setGoogleError('')}
            onError={setGoogleError}
          />
          {googleError && (
            <p className="auth-error-banner">{googleError}</p>
          )}

          <div className="auth-divider">
            <span>or</span>
          </div>

          {children}

          <div className="links">
            <p>
              {footerPrompt}{' '}
              <Link to={footerLinkTo}>{footerLinkLabel}</Link>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AuthLayout;
