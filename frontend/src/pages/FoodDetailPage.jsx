import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LANGUAGES, API_BASE_URL } from '../config'
import { BACKGROUND_IMAGES } from '../utils/constants'
import { PageBackground, LoadingSpinner, ErrorState, BackButton, InfoBox, RelatedDishes } from '../components/shared'

function FoodDetailPage({ language }) {
  const { foodName } = useParams()
  const navigate = useNavigate()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const t = LANGUAGES[language]

  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE_URL}/food/${encodeURIComponent(foodName)}?lang=${language}`)
        const data = await response.json()
        
        if (data.success) {
          setFood(data.food)
        } else {
          setError(data.error || 'Food not found')
        }
      } catch (err) {
        console.error('Error fetching food detail:', err)
        setError('Failed to load food details')
      } finally {
        setLoading(false)
      }
    }

    if (foodName) {
      fetchFoodDetail()
    }
  }, [foodName, language])

  const regionText = useMemo(() => 
    food ? t[food.region] || food.region : '', 
    [food, t]
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <LoadingSpinner message={t.loadingData || 'Loading...'} />
      </div>
    )
  }

  if (error || !food) {
    return (
      <ErrorState
        title={language === 'VN' ? 'Không tìm thấy món ăn' : 'Dish Not Found'}
        message={error}
        buttonText={`← ${language === 'VN' ? 'Quay lại thư viện' : 'Back to Library'}`}
        onButtonClick={() => navigate('/library')}
      />
    )
  }

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      <PageBackground imageUrl={BACKGROUND_IMAGES.foodDetail} />

      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-4 py-20 pt-32"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton 
          label={language === 'VN' ? 'Quay lại' : 'Back'}
          className="mb-6 bg-white/90 hover:bg-white text-gray-800 font-bold rounded-full shadow-lg"
        />

        {/* Main Card */}
        <motion.div 
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center">
            <motion.div 
              className="text-8xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🍜
            </motion.div>
            <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
              {food.name}
            </h1>
            <div className="inline-block px-6 py-2 bg-yellow-400 text-red-800 font-bold rounded-full text-sm uppercase tracking-wide shadow-lg">
              📍 {regionText}
            </div>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12 space-y-8">
            <InfoBox
              icon={{ emoji: '📝', bg: 'red-100' }}
              title={t.description}
              content={food.description}
              gradient="from-red-50 to-orange-50"
              borderColor="border-red-600"
              delay={0.3}
            />

            <InfoBox
              icon={{ emoji: '🥘', bg: 'orange-100' }}
              title={t.ingredients}
              content={food.ingredients}
              gradient="from-orange-50 to-yellow-50"
              borderColor="border-orange-600"
              delay={0.4}
            />

            {food.related && food.related.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t.related_dishes}
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {food.related.map((relatedFood, idx) => (
                    <motion.button
                      key={idx}
                      className="p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-red-500 hover:shadow-lg transition-all text-center font-bold text-gray-800"
                      onClick={() => navigate(`/food/${encodeURIComponent(relatedFood)}`)}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-3xl mb-2">🍜</div>
                      <span className="text-sm">{relatedFood}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center pt-6 border-t-2 border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                className="btn-primary px-8 py-3 rounded-full"
                onClick={() => navigate('/library')}
              >
                📚 {language === 'VN' ? 'Xem thêm món khác' : 'Explore More Dishes'}
              </button>
              <button
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-800 font-bold rounded-full hover:border-red-500 hover:shadow-lg transition-all"
                onClick={() => navigate('/')}
              >
                🏠 {t.back_home}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default FoodDetailPage
