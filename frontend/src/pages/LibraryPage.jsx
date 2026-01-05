import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { LANGUAGES, API_BASE_URL } from '../config'
import { BACKGROUND_IMAGES, PAGINATION as PAGINATION_CONFIG, TIMEOUTS } from '../utils/constants'
import { PageBackground, LoadingSpinner, FoodCard, Pagination } from '../components/shared'

function LibraryPage({ language }) {
  const [foods, setFoods] = useState([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: PAGINATION_CONFIG.itemsPerPage,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_prev: false
  })
  
  const t = LANGUAGES[language]

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      if (search !== debouncedSearch) setCurrentPage(1)
    }, TIMEOUTS.searchDebounce)
    return () => clearTimeout(timer)
  }, [search, debouncedSearch])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedRegion])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const fetchFoods = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        lang: language,
        page: currentPage.toString(),
        per_page: PAGINATION_CONFIG.itemsPerPage.toString(),
        region: selectedRegion,
        search: debouncedSearch
      })
      
      const response = await fetch(`${API_BASE_URL}/foods/search?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setFoods(data.foods)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to load foods:', error)
    } finally {
      setLoading(false)
    }
  }, [language, currentPage, selectedRegion, debouncedSearch])

  useEffect(() => {
    fetchFoods()
  }, [fetchFoods])

  const regions = useMemo(() => [
    { value: 'all', label: language === 'VN' ? 'Tất cả' : 'All' },
    { value: 'north', label: t.north},
    { value: 'central', label: t.central},
    { value: 'south', label: t.south},
    { value: 'nationwide', label: t.nationwide}
  ], [language, t])

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      <PageBackground imageUrl={BACKGROUND_IMAGES.library} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center">
        <motion.h1 className="pt-32 page-title gradient-text-animated mb-2">
          {t.library_title}
        </motion.h1>

        <motion.p className="text-yellow-400 mb-4 text-lg font-bold italic">
          {t.library_tagline}
        </motion.p>

        <div className="w-full max-w-3xl mb-8">
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            <input
              type="text"
              className="w-full bg-white/95 border-2 border-transparent focus:border-red-500 rounded-full py-4 pl-16 pr-8 text-gray-800 text-lg shadow-2xl transition-all outline-none"
              placeholder={t.search_placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {regions.map((region) => (
            <button
              key={region.value}
              onClick={() => setSelectedRegion(region.value)}
              className={`btn-filter ${selectedRegion === region.value ? 'btn-filter-active' : 'btn-filter-inactive'}`}
            >
              <span>{region.icon}</span> {region.label}
            </button>
          ))}
        </div>

        <div className="mb-12">
          <span className="badge-stat">🍽️ {pagination.total} {t.total_dishes}</span>
        </div>
        
        {loading && (
          <div className="w-full flex justify-center items-center py-20">
            <LoadingSpinner size="md" />
          </div>
        )}
        
        <div className="w-full">
          {!loading && foods.length > 0 && (
            <div 
              key={currentPage}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {foods.map((food, index) => (
                <FoodCard 
                  key={food.id}
                  food={food}
                  t={t}
                  language={language}
                  index={index}
                />
              ))}
            </div>
          )}
            
            {!loading && foods.length === 0 && (
              <div 
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === 'VN' ? 'Không tìm thấy món ăn' : 'No dishes found'}
                </h3>
                <p className="text-white/70">
                  {language === 'VN' ? 'Thử tìm kiếm với từ khóa khác' : 'Try searching with different keywords'}
                </p>
              </div>
            )}
        </div>

        {!loading && pagination.total_pages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.total_pages}
            hasNext={pagination.has_next}
            hasPrev={pagination.has_prev}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

export default LibraryPage