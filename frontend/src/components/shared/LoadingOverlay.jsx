import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'

const LoadingOverlay = memo(({ isVisible, message, image }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div 
        className="loading-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingSpinner 
          size="lg" 
          message={message} 
          image={image}
        />
      </motion.div>
    )}
  </AnimatePresence>
))

LoadingOverlay.displayName = 'LoadingOverlay'

export default LoadingOverlay
