import { memo } from 'react'
import { motion } from 'framer-motion'

const LoadingSpinner = memo(({ size = 'md', message, image }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-40 h-40'
  }

  if (image) {
    return (
      <div className="text-center">
        <div className={`mx-auto mb-6 ${sizeClasses.lg} rounded-full overflow-hidden border-4 border-yellow-400 bg-white shadow-2xl flex items-center justify-center`}>
          <img 
            src={image}
            alt="Loading" 
            className="w-full h-full object-cover animate-pulse" 
          />
        </div>
        {message && (
          <>
            <h2 className="text-4xl font-bold text-yellow-500 mb-4 animate-pulse">{message}</h2>
            {message.includes('🤖') && (
              <p className="text-gray-900 text-xl font-semibold opacity-90">Đang phân tích, vui lòng đợi...</p>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className={`loading-spinner ${sizeClasses[size]} border-4 border-red-600 border-t-transparent rounded-full mx-auto`}></div>
      {message && <p className="text-gray-600 font-medium mt-4">{message}</p>}
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner
