import { motion, AnimatePresence } from 'framer-motion';
import PasswordInput from './PasswordInput';

function LoginForm({ 
  language, 
  username, 
  setUsername, 
  password, 
  setPassword, 
  loading, 
  success,
  error,
  errors, 
  clearFieldError,
  validateUsername,
  validatePassword,
  handleLogin,
  messages 
}) {
  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {/* Username Input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="form-label">
          {language === 'VN' ? 'Tên đăng nhập' : 'Username'}
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) clearFieldError('username');
          }}
          onBlur={() => validateUsername(username)}
          className={errors.username ? 'form-input-error' : 'form-input'}
          placeholder={language === 'VN' ? 'Nhập tên đăng nhập' : 'Enter username'}
          disabled={loading}
        />
        <AnimatePresence>
          {errors.username && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="error-message"
            >
              {errors.username}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Password Input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="form-label">
          {language === 'VN' ? 'Mật khẩu' : 'Password'}
        </label>
        <PasswordInput
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) clearFieldError('password');
          }}
          onBlur={() => validatePassword(password)}
          hasError={errors.password}
          placeholder={language === 'VN' ? 'Nhập mật khẩu' : 'Enter password'}
          disabled={loading}
        />
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="error-message"
            >
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="btn-gradient-primary"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="loading-spinner" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {messages.loading}
          </span>
        ) : (
          language === 'VN' ? 'Đăng nhập' : 'Login'
        )}
      </motion.button>

      {/* Success Message - Bottom */}
      <AnimatePresence mode="wait">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-green-50 border-2 border-green-500 text-green-800 rounded-xl text-center font-bold"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message - Bottom */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border-2 border-red-500 text-red-800 rounded-xl text-center font-bold"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default LoginForm;
