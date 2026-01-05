import { memo } from 'react'
import { motion } from 'framer-motion'

const Pagination = memo(({ currentPage, totalPages, hasNext, hasPrev, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-3 mt-16">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={!hasPrev}
        className="btn-icon"
      >
        ←
      </button>
      
      <div className="flex gap-2 flex-wrap justify-center">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1
          const showPage = pageNum === 1 || 
                          pageNum === totalPages || 
                          Math.abs(pageNum - currentPage) <= 1
          
          if (!showPage && pageNum === 2 && currentPage > 3) {
            return <span key={i} className="w-12 h-12 flex items-center justify-center text-white">...</span>
          }
          if (!showPage && pageNum === totalPages - 1 && currentPage < totalPages - 2) {
            return <span key={i} className="w-12 h-12 flex items-center justify-center text-white">...</span>
          }
          if (!showPage) return null
          
          return (
            <button
              key={i}
              onClick={() => onPageChange(pageNum)}
              className={`w-12 h-12 rounded-xl font-black transition-all border-2 ${
                currentPage === pageNum 
                  ? 'bg-red-600 border-yellow-400 text-white scale-110 shadow-lg' 
                  : 'bg-white border-gray-100 text-gray-600 hover:border-red-400'
              }`}
            >
              {pageNum}
            </button>
          )
        })}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={!hasNext}
        className="btn-icon"
      >
        →
      </button>
    </div>
  )
})

Pagination.displayName = 'Pagination'

export default Pagination
