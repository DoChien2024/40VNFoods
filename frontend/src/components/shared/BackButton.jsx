import { memo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BackButton = memo(({ to, label, className = "" }) => {
  const navigate = useNavigate()

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg transition flex items-center gap-2 cursor-pointer ${className}`}
      onClick={() => to ? navigate(to) : navigate(-1)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      ← {label}
    </motion.button>
  )
})

BackButton.displayName = 'BackButton'

export default BackButton
