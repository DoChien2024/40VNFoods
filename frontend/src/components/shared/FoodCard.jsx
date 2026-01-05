import { memo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const FoodCard = memo(({ food, t, language, index }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 transition-all duration-300 border-2 border-white/50 hover:shadow-red-500/30 group cursor-pointer relative overflow-hidden"
      onClick={() => navigate(`/food/${encodeURIComponent(food.id)}`)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative z-10">
        <span className="mb-4 inline-block px-4 py-1 bg-yellow-100 text-red-600 text-[10px] font-black uppercase rounded-full border border-yellow-400">
          {t[food.region] || food.region}
        </span>
        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🍜</div>
        <h3 className="text-2xl font-black text-gray-800 mb-3 leading-tight">{food.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{food.description}</p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-red-500/90 to-orange-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-center items-center text-white z-20 pointer-events-none rounded-3xl">
        <p className="font-black text-xl mb-4 border-b-2 border-yellow-300 pb-2">{food.name}</p>
        <p className="text-xs uppercase font-bold text-yellow-200 mb-2">🥘 {t.feature_ingredients}</p>
        <p className="text-sm italic font-medium line-clamp-4">{food.ingredients}</p>
      </div>
    </motion.div>
  )
})

FoodCard.displayName = 'FoodCard'

export default FoodCard
