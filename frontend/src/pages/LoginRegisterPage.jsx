import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LANGUAGES } from '../config';
import { useAuthForm } from '../utils/useAuthForm';
import { BACKGROUND_IMAGES, GLASS_CARD, GRADIENT_TEXT } from '../utils/constants';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

function LoginRegisterPage({ language }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const t = LANGUAGES[language];
  
  const authForm = useAuthForm(language);

  const handleRegisterSuccess = async (e) => {
    const success = await authForm.handleRegister(e);
    if (success) {
      setTimeout(() => {
        setIsLogin(true);
        authForm.setPassword('');
        authForm.setConfirmPassword('');
        authForm.setSuccess('');
      }, 2000);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    authForm.resetForm();
  };

  return (
    <div className="relative w-full min-h-screen overflow-y-auto flex items-center justify-center pt-16">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 z-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${BACKGROUND_IMAGES.search}')`, 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="overlay-medium" />
      </div>

      {/* Main Container */}
      <motion.div 
        className="relative z-10 w-full max-w-md mx-4 my-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={GLASS_CARD}>
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl md:text-3xl font-black gradient-text-animated"
            >
              {isLogin ? t.login_title : t.register_title}
            </motion.h1>
          </motion.div>

          {/* Form - Switch between Login and Signup */}
          {isLogin ? (
            <LoginForm 
              language={language}
              {...authForm}
            />
          ) : (
            <SignupForm 
              language={language}
              {...authForm}
              handleRegister={handleRegisterSuccess}
            />
          )}

          {/* Switch Mode */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm text-gray-700">
              {isLogin
                ? (language === 'VN' ? 'Chưa có tài khoản?' : "Don't have an account?")
                : (language === 'VN' ? 'Đã có tài khoản?' : 'Already have an account?')
              }
              <button
                type="button"
                onClick={switchMode}
                className="ml-2 font-bold text-primary hover:text-primary-light transition-colors"
                disabled={authForm.loading}
              >
                {isLogin
                  ? (language === 'VN' ? 'Đăng ký ngay' : 'Register now')
                  : (language === 'VN' ? 'Đăng nhập' : 'Login')
                }
              </button>
            </p>
          </motion.div>

          {/* Back to Home */}
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              disabled={authForm.loading}
            >
              ← {t.back_home}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginRegisterPage;
