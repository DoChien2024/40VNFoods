import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2 } from 'lucide-react'
import { authAxios } from '../utils/auth'
import { useRequireAuth } from '../utils/hooks'
import { BACKGROUND_IMAGES, MESSAGES } from '../utils/constants'
import { PageBackground, LoadingSpinner } from '../components/shared'

function HistoryPage({ language = 'VN' }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const { loggedIn } = useRequireAuth()
  const navigate = useNavigate()
  const messages = MESSAGES[language]

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false)
      return
    }

    authAxios.get('/history?limit=50')
      .then(response => {
        if (response.data.success) {
          setHistory(Array.isArray(response.data.history) ? response.data.history : [])
        }
      })
      .catch((err) => {
        console.error("Error fetching history:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [loggedIn])

  const handleClearHistory = useCallback(async () => {
    if (!loggedIn) return

    if (!window.confirm(messages.deleteConfirm)) return

    try {
      const response = await authAxios.delete('/history')
      if (response.data.success) {
        setHistory([])
        alert(messages.deleteSuccess)
      }
    } catch (error) {
      console.error('Error deleting history:', error)
      alert(messages.deleteError)
    }
  }, [loggedIn, messages])

  const handleDeleteItem = useCallback(async (itemId) => {
    if (!window.confirm('Xóa món này khỏi lịch sử?')) return

    try {
      const response = await authAxios.delete(`/history/${itemId}`)
      if (response.data.success) {
        setHistory(prev => prev.filter(item => item._id !== itemId))
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Lỗi khi xóa!')
    }
  }, [])

  const handleViewImage = useCallback(async (item) => {
    if (!item.image_base64) {
      alert('Không có ảnh lưu trữ')
      return
    }

    try {
      const response = await authAxios.get(`/food/${item.food_name}`, {
        params: { lang: language }
      })
      
      if (response.data.success) {
        const predictionData = {
          food_name: item.food_name,
          confidence: item.confidence,
          food_info: response.data.food,
          imageUrl: `data:image/jpeg;base64,${item.image_base64}`,
          related: item.extra?.related || []
        }
        
        navigate('/result', { 
          state: { 
            predictionResult: predictionData,
            fromHistory: true 
          } 
        })
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Lỗi khi tải thông tin món ăn')
    }
  }, [language, navigate])

  return (
    <div className="relative min-h-screen text-white">
      <PageBackground imageUrl={BACKGROUND_IMAGES.history} overlayType="darker" />

      <div className="relative z-10 max-w-3xl pt-32 mx-auto px-4 pb-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Lịch sử nhận diện</h1>
        
        {!loggedIn ? (
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white/20 backdrop-blur-md rounded-2xl"
            >
              <p className="text-xl mb-6">🔒 {messages.requireLogin}</p>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all"
              >
                {messages.loginNow}
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              {history.length > 0 && (
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow"
                  onClick={handleClearHistory}
                >
                  Xóa lịch sử
                </button>
              )}
            </div>
            {loading && (
              <div className="flex justify-center py-10">
                <LoadingSpinner message={messages.loadingData} />
              </div>
            )}
            {!loading && history.length === 0 && (
              <div className="text-center text-lg">{messages.noHistory}</div>
            )}
            {!loading && history.length > 0 && (
              <div className="space-y-4">{history.map((item, idx) => (
                  <motion.div
                key={item._id || idx}
                className="p-5 rounded-2xl bg-white/30 shadow-md flex flex-col md:flex-row md:items-center gap-4 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="flex-1">
                  <div className="font-bold text-lg text-yellow-400">🍽️ {item.food_name || 'Không xác định'}</div>
                  <div className="text-black text-sm">
                    Độ tin cậy: {item.confidence ? item.confidence.toFixed(1) : 0}%
                  </div>
                  <div className="text-gray-300 text-xs">
                    Thời gian: {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewImage(item)}
                    className="p-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded transition"
                    title="Xem lại"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded transition"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </>
    )}
    </div>
  </div>
  );
}

export default HistoryPage