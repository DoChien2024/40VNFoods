/**
 * Custom hook for authentication form logic
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from './auth';
import { useFormValidation } from './hooks';
import { MESSAGES } from './constants';

export const useAuthForm = (language) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { 
    errors, 
    clearFieldError, 
    clearAllErrors, 
    validateUsername,
    validatePassword,
    validateConfirmPassword,
    validateLoginForm, 
    validateRegisterForm 
  } = useFormValidation(language);
  
  const messages = MESSAGES[language];

  const handleLogin = async (e) => {
    e.preventDefault();
    clearAllErrors();
    setSuccess('');
    setError('');

    if (!validateLoginForm(username, password)) return;

    setLoading(true);
    try {
      const response = await login(username, password);
      if (response.success) {
        setSuccess(messages.loginSuccess);
        setError('');
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMsg = messages.error;
      
      if (err.code === 'ERR_NETWORK' || !err.response) {
        errorMsg = messages.networkError;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message === 'Invalid username or password' 
          ? messages.invalidCredentials 
          : err.response.data.message;
      }
      
      setError(errorMsg);
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearAllErrors();
    setSuccess('');
    setError('');

    if (!validateRegisterForm(username, password, confirmPassword)) return;

    setLoading(true);
    try {
      const response = await register(username, password);
      if (response.success) {
        setSuccess(messages.registerSuccess);
        setError('');
        return true;
      }
    } catch (err) {
      console.error('Register error:', err);
      let errorMsg = messages.error;
      
      if (err.code === 'ERR_NETWORK' || !err.response) {
        errorMsg = messages.networkError;
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message === 'Username already exists' 
          ? messages.usernameExists 
          : err.response.data.message;
      }
      
      setError(errorMsg);
      setSuccess('');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    clearAllErrors();
    setSuccess('');
    setError('');
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    success,
    setSuccess,
    error,
    setError,
    errors,
    clearFieldError,
    clearAllErrors,
    validateUsername,
    validatePassword,
    validateConfirmPassword,
    handleLogin,
    handleRegister,
    resetForm,
    messages,
  };
};
