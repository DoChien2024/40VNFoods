import { memo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const RelatedDishes = memo(({ dishes, title, onDishClick }) => {
  const navigate = useNavigate()

  if (!dishes || dishes.length === 0) return null

  const handleClick = (dish) => {
    if (onDishClick) {
      onDishClick(dish)
    } else {
      navigate(`/food/${encodeURIComponent(dish)}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="mt-16"
    >
      <h3 className="text-2xl font-bold text-white/80 mb-6 flex items-center gap-2">
        🍽️ {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {dishes.map((dish, idx) => (
          <motion.div
            key={idx}
            className="p-5 text-center font-bold text-black bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl hover:bg-white hover:shadow-xl transition-all cursor-pointer"
            onClick={() => handleClick(dish)}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="text-2xl mb-1">🍜</div>
            <span className="text-sm">{dish}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
})

RelatedDishes.displayName = 'RelatedDishes'

export default RelatedDishes
