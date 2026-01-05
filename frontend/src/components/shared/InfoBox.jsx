import { memo } from 'react'
import { motion } from 'framer-motion'

const InfoBox = memo(({ 
  icon, 
  title, 
  content, 
  gradient = "from-red-50 to-orange-50",
  borderColor = "border-red-600",
  delay = 0
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 bg-${icon.bg || 'red-100'} rounded-full flex items-center justify-center`}>
        <span className="text-2xl">{icon.emoji}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border-l-4 ${borderColor}`}>
      <p className="text-gray-700 leading-relaxed text-lg">{content}</p>
    </div>
  </motion.div>
))

InfoBox.displayName = 'InfoBox'

export default InfoBox
