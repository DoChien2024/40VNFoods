import { memo } from 'react'
import { motion } from 'framer-motion'

const ErrorState = memo(({ 
  emoji = "😞", 
  title, 
  message, 
  buttonText, 
  onButtonClick 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <motion.div 
      className="card max-w-2xl w-full text-center p-10 bg-white shadow-xl rounded-3xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
      {message && <p className="text-gray-600 mb-6">{message}</p>}
      {buttonText && onButtonClick && (
        <motion.button 
          className="btn-primary"
          onClick={onButtonClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttonText}
        </motion.button>
      )}
    </motion.div>
  </div>
))

ErrorState.displayName = 'ErrorState'

export default ErrorState
