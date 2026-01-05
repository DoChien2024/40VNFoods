import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LANGUAGES } from '../config'
import { logout } from '../utils/auth'
import { useAuth } from '../utils/hooks'

function Header({ language, setLanguage }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const t = LANGUAGES[language]
  const { loggedIn, username, checkAuth } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [pathname, checkAuth])

  const handleLogout = () => {
    logout()
  }

  const textColor = isScrolled
    ? 'text-gray-700 hover:text-red-600'
    : 'text-white/90 hover:text-white'

  const NavBtn = ({ label, path, active }) => (
    <button
      onClick={() => navigate(path)}
      className={`relative font-bold text-sm uppercase tracking-widest pb-1 transition-all ${textColor}`}
    >
      {label}
      {active && (
        <motion.div
          layoutId="underline"
          className="absolute bottom-0 inset-x-0 h-0.5 bg-red-600"/>)}
    </button>
  )
  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
        ${isScrolled
          ? 'bg-gray-200/90 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer">
          <motion.span
            className="text-3xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}>🍜</motion.span>

          <div className="flex flex-col uppercase tracking-tighter">
            <span className={`text-xl font-black ${isScrolled ? 'text-gray-900' : 'text-white'}`}> {t.app_title} </span>
            <span className={`text-[12px] font-bold ${isScrolled ? 'text-primary' : 'text-gray-400'}`}> AI Recognition </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-10">
          <NavBtn label={t.nav_home} path="/" active={pathname === '/'} />
          <NavBtn label={t.nav_search} path="/search" active={pathname === '/search'} />
          {loggedIn && <NavBtn label={t.nav_library} path="/library" active={pathname === '/library'} />}

          {/* User Menu / Login Button */}
          {loggedIn ? (
            <div
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className={`font-bold text-sm uppercase tracking-widest pb-1 transition-all flex items-center gap-2 ${textColor}`}>
                <span className="text-xl">👤</span>
                {username}
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => navigate('/history')}
                      className="w-full px-5 py-3 text-left text-[11px] font-bold uppercase text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-300"
                    >
                      📊 {t.nav_history}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-5 py-3 text-left text-[11px] font-bold uppercase text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                    >
                      🚪 Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`font-bold text-sm uppercase tracking-widest pb-1 transition-all ${textColor} flex items-center gap-1`}
            >
              <span className="text-xl">🔐</span>
              {language === 'VN' ? 'Đăng nhập' : 'Login'}
            </button>
          )}
        </nav>

        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`border-2 rounded-full px-8 py-1 transition-all
            ${isScrolled ? 'text-gray-800 border-gray-800' : 'text-white border-white/20'}`}
        >
          <option value="VN" className="text-black">🌐VN</option>
          <option value="EN" className="text-black">🌐EN</option>
        </select>

      </div>
    </motion.header>
  )
}
export default Header
