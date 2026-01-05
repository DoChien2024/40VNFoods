import { memo } from 'react'
import { motion } from 'framer-motion'

const PageTitle = memo(({ title, subtitle, className = "" }) => (
  <motion.div
    className={`text-center mb-12 ${className}`}
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <motion.h1 className="text-6xl font-black mb-3 gradient-text-animated">
      {title}
    </motion.h1>
    {subtitle && (
      <motion.p className="text-white/80 text-lg font-medium">
        {subtitle}
      </motion.p>
    )}
  </motion.div>
))

PageTitle.displayName = 'PageTitle'

export default PageTitle
