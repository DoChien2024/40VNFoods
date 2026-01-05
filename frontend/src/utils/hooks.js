import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getUsername, clearTokens } from './auth';

/**
 * @returns {object}
 */
export const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const checkAuth = () => {
    const authenticated = isAuthenticated();
    setLoggedIn(authenticated);
    setUsername(getUsername() || '');
    return authenticated;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { loggedIn, username, checkAuth };
};

/**
 * @returns {object}
 */
export const useRequireAuth = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticated = isAuthenticated();
    setLoggedIn(authenticated);
    setLoading(false);

    if (!authenticated) {
    }
  }, [navigate]);

  return { loggedIn, loading };
};

/**
 * @param {string} language 
 * @returns {object} 
 */
export const useFormValidation = (language) => {
  const [errors, setErrors] = useState({});

  const messages = {
    VN: {
      usernameRequired: 'Vui lòng nhập tên đăng nhập',
      usernameMinLength: 'Tên đăng nhập phải có ít nhất 3 ký tự',
      passwordRequired: 'Vui lòng nhập mật khẩu',
      passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự',
      passwordMismatch: 'Mật khẩu xác nhận không khớp',
      confirmPasswordRequired: 'Vui lòng xác nhận mật khẩu',
    },
    EN: {
      usernameRequired: 'Please enter username',
      usernameMinLength: 'Username must be at least 3 characters',
      passwordRequired: 'Please enter password',
      passwordMinLength: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      confirmPasswordRequired: 'Please confirm password',
    }
  };

  const msg = messages[language] || messages.VN;

  const setFieldError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => setErrors({});

  const validateUsername = (username, showError = true) => {
    if (!username.trim()) {
      if (showError) setFieldError('username', msg.usernameRequired);
      return false;
    }
    if (username.length < 3) {
      if (showError) setFieldError('username', msg.usernameMinLength);
      return false;
    }
    clearFieldError('username');
    return true;
  };

  const validatePassword = (password, showError = true) => {
    if (!password.trim()) {
      if (showError) setFieldError('password', msg.passwordRequired);
      return false;
    }
    if (password.length < 6) {
      if (showError) setFieldError('password', msg.passwordMinLength);
      return false;
    }
    clearFieldError('password');
    return true;
  };

  const validateConfirmPassword = (password, confirmPassword, showError = true) => {
    if (!confirmPassword.trim()) {
      if (showError) setFieldError('confirmPassword', msg.confirmPasswordRequired);
      return false;
    }
    if (password !== confirmPassword) {
      if (showError) setFieldError('confirmPassword', msg.passwordMismatch);
      return false;
    }
    clearFieldError('confirmPassword');
    return true;
  };

  const validateLoginForm = (username, password) => {
    const isUsernameValid = validateUsername(username, true);
    const isPasswordValid = validatePassword(password, true);
    return isUsernameValid && isPasswordValid;
  };

  const validateRegisterForm = (username, password, confirmPassword) => {
    const isUsernameValid = validateUsername(username, true);
    const isPasswordValid = validatePassword(password, true);
    const isConfirmValid = validateConfirmPassword(password, confirmPassword, true);
    return isUsernameValid && isPasswordValid && isConfirmValid;
  };

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    validateUsername,
    validatePassword,
    validateConfirmPassword,
    validateLoginForm,
    validateRegisterForm,
  };
};
