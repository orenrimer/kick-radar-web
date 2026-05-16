import { useReducer, useState, useContext } from 'react';
import { useMutation } from '@tanstack/react-query';

import { apiRequest } from '../../../api/client';
import AuthContext from '../contexts/AuthContext';

const validators = {
  username: (value) => value.length > 0,
  email: (value) => /^\S+@\S+\.\S+$/.test(value),
  password: (value) => value.length >= 8 && value.length <= 12,
};

const errorMessages = {
  username: 'Please provide a username.',
  email: 'Please provide a valid email address.',
  password: 'Password must be 8-12 characters long.',
};

const buildInitialState = (fields) =>
  Object.fromEntries(fields.map((f) => [f, { value: '', isValid: false }]));

const inputReducer = (state, action) => {
  if (!(action.type in state)) return state;
  return {
    ...state,
    [action.type]: {
      value: action.payload,
      isValid: validators[action.type](action.payload),
    },
  };
};

export function useAuthForm({ fields, endpoint, buildBody }) {
  const auth = useContext(AuthContext);
  const [state, dispatch] = useReducer(inputReducer, fields, buildInitialState);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(() =>
    Object.fromEntries(fields.map((f) => [f, '']))
  );

  const submitMutation = useMutation({
    mutationFn: (body) => apiRequest(endpoint, { method: 'POST', body }),
    onSuccess: (data) => auth.login(data.userId, data.token),
  });

  const values = Object.fromEntries(fields.map((f) => [f, state[f].value]));
  const isFormFilled = fields.every((f) => state[f].value.trim().length > 0);

  const handleChange = (field) => (e) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
    dispatch({ type: field, payload: e.target.value });
    submitMutation.reset();
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = (event) => {
    event.preventDefault();
    const next = Object.fromEntries(
      fields.map((f) => [f, state[f].isValid ? '' : errorMessages[f]])
    );
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    submitMutation.mutate(buildBody(values));
  };

  return {
    values,
    errors,
    error: submitMutation.error?.message ?? null,
    isSubmitting: submitMutation.isPending,
    isFormFilled,
    showPassword,
    togglePassword,
    handleChange,
    handleSubmit,
  };
}
