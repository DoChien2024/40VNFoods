import { memo } from 'react'
import { motion } from 'framer-motion'

const ConfidenceBar = memo(({ confidence, label }) => {
  const getColor = (value) => {
    if (value >= 70) return { bg: 'linear-gradient(to right, #10b981, #059669)', text: '#10b981', textDark: '#059669' }
    if (value >= 50) return { bg: 'linear-gradient(to right, #f59e0b, #d97706)', text: '#f59e0b', textDark: '#d97706' }
    return { bg: 'linear-gradient(to right, #ef4444, #dc2626)', text: '#ef4444', textDark: '#dc2626' }
  }

  const colors = getColor(confidence)

  return (
    <motion.div 
      className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 shadow-sm"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-black/80 uppercase tracking-widest">
          📊 {label}
        </span>
        <span className="text-3xl font-black">
          <span style={{ color: colors.text }}>
            {confidence.toFixed(1)}
          </span>
          <span style={{ color: colors.textDark }}>%</span>
        </span>
      </div>
      <div className="relative h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className="absolute h-full rounded-full shadow-lg"
          style={{ background: colors.bg }}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ delay: 1, duration: 1.5 }}
        />
      </div>
    </motion.div>
  )
})

ConfidenceBar.displayName = 'ConfidenceBar'

export default ConfidenceBar
