import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { LANGUAGES } from '../config'
import { BACKGROUND_IMAGES, TIMEOUTS, MESSAGES, ANIMATION_DELAYS } from '../utils/constants'
import { 
  PageBackground, 
  ErrorState, 
  BackButton, 
  PageTitle, 
  ConfidenceBar,
  RelatedDishes 
} from '../components/shared'

function ResultPage({ language, predictionResult: propPredictionResult }) {
  const navigate = useNavigate()
  const location = useLocation()
  const t = LANGUAGES[language]
  const messages = MESSAGES[language]

  const predictionResult = useMemo(() => 
    propPredictionResult || location.state?.predictionResult, 
    [propPredictionResult, location.state]
  )
  const fromHistory = location.state?.fromHistory || false

  useEffect(() => {
    if (!predictionResult) {
      const timer = setTimeout(() => navigate('/search'), TIMEOUTS.redirect)
      return () => clearTimeout(timer)
    }
  }, [predictionResult, navigate])

  if (!predictionResult) {
    return (
      <ErrorState
        emoji="🔍"
        title={messages.noResult}
        message={messages.redirecting}
        buttonText={t.back_home}
        onButtonClick={() => navigate('/search')}
      />
    )
  }

  const { food_info, confidence, imageUrl, related } = predictionResult
  
  if (!food_info) {
    return (
      <ErrorState
        title={messages.dataError}
        message={messages.foodNotFound}
        buttonText={messages.tryAgain}
        onButtonClick={() => navigate('/search')}
      />
    )
  }
  
  const regionText = t[food_info.region] || food_info.region

  return (
    <div className="relative pt-8 w-full min-h-screen overflow-y-auto">
      <PageBackground imageUrl={BACKGROUND_IMAGES.result} />

      <motion.div 
        className="max-w-6xl mx-auto py-8 px-4 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {fromHistory && (
          <BackButton 
            to="/history" 
            label="Quay lại lịch sử"
            className="mt-20 mb-6"
          />
        )}

        <PageTitle 
          title={t.result_title}
          subtitle="✨ AI đã phân tích thành công! ✨"
          className={fromHistory ? 'pt-0' : 'pt-20'}
        />

        <ResultCard 
          food_info={food_info}
          confidence={confidence}
          imageUrl={imageUrl}
          regionText={regionText}
          t={t}
        />

        <RelatedDishes 
          dishes={related}
          title={t.related_dishes}
        />

        <motion.div
          className="text-center mt-12 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ANIMATION_DELAYS.backButton }}
        >
          <motion.button 
            className="btn-primary px-12 py-4 rounded-full shadow-lg"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 {t.back_home}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

const ResultCard = ({ food_info, confidence, imageUrl, regionText, t }) => (
  <motion.div 
    className="result-card mb-10"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: ANIMATION_DELAYS.mainCard, type: "spring" }}
  >
    <div className="grid md:grid-cols-2 gap-12">
      <FoodImage imageUrl={imageUrl} />
      <FoodInfo 
        food_info={food_info}
        confidence={confidence}
        regionText={regionText}
        t={t}
      />
    </div>
  </motion.div>
)

const FoodImage = ({ imageUrl }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: ANIMATION_DELAYS.image }}
  >
    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 z-10 pointer-events-none" />
      <img 
        src={imageUrl} 
        alt="Food" 
        className="w-full h-full object-cover aspect-square md:aspect-auto" 
      />
    </div>
  </motion.div>
)

const FoodInfo = ({ food_info, confidence, regionText, t }) => (
  <motion.div
    className="space-y-6"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: ANIMATION_DELAYS.info }}
  >
    <motion.h2 
      className="text-5xl font-black text-gray-900 leading-tight"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      {food_info.name}
    </motion.h2>

    <ConfidenceBar confidence={confidence} label={t.confidence} />

    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-sm">
          📍 {regionText}
        </span>
      </div>

      <div className="info-box">
        <h4 className="text-xs font-bold text-black/80 uppercase mb-2">📝 {t.description}</h4>
        <p className="text-gray-700 leading-relaxed">{food_info.description}</p>
      </div>

      <div className="info-box">
        <h4 className="text-xs font-bold text-black/80 uppercase mb-2">🥘 {t.ingredients}</h4>
        <p className="text-gray-700 leading-relaxed">{food_info.ingredients}</p>
      </div>
    </div>
  </motion.div>
)

export default ResultPage