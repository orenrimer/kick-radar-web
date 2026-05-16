import React from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import './AuthField.css';

const AuthField = ({
  type,
  name,
  label,
  placeholder,
  value,
  error,
  onChange,
  showPassword,
  togglePassword,
  leftIcon,
}) => {
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="auth-field">
      {label && (
        <label htmlFor={name} className="auth-field__label">{label}</label>
      )}
      <div className={`auth-field__input ${error ? 'auth-field__input--error' : ''}`}>
        {leftIcon && <span className="auth-field__icon">{leftIcon}</span>}
        <input
          type={inputType}
          id={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {isPassword && (
          <span className="auth-field__action" onClick={togglePassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
      {error && <p className="auth-field__error">{error}</p>}
    </div>
  );
};

export default AuthField;
