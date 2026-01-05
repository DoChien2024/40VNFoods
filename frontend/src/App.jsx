import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { isAuthenticated } from './utils/auth'
import Header from './components/Header'
import Footer from './components/Footer'

import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ResultPage from './pages/ResultPage'
import LibraryPage from './pages/LibraryPage'
import HistoryPage from './pages/HistoryPage'
import LoginRegisterPage from './pages/LoginRegisterPage'
import FoodDetailPage from './pages/FoodDetailPage'

// Animation variants
const pageVariants = {
  slideX: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  slideY: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  }
}

const transition = { duration: 0.3 }

// Animated Page Wrapper Component
function AnimatedPage({ children, variant = 'slideY' }) {
  return (
    <motion.div
      initial={pageVariants[variant].initial}
      animate={pageVariants[variant].animate}
      exit={pageVariants[variant].exit}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}

// Protected Route Component
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function AnimatedRoutes({ language, predictionResult, setPredictionResult }) {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ========== PUBLIC ========== */}
        
        <Route path="/" element={
          <AnimatedPage variant="slideX">
            <HomePage language={language} setPredictionResult={setPredictionResult} />
          </AnimatedPage>
        } />
        
        <Route path="/search" element={
          <AnimatedPage variant="slideY">
            <SearchPage language={language} setPredictionResult={setPredictionResult} />
          </AnimatedPage>
        } />
        
        <Route path="/result" element={
          <AnimatedPage variant="scale">
            <ResultPage language={language} predictionResult={predictionResult} />
          </AnimatedPage>
        } />
        
        <Route path="/food/:foodName" element={
          <AnimatedPage variant="scale">
            <FoodDetailPage language={language} />
          </AnimatedPage>
        } />
        
        <Route path="/login" element={
          <AnimatedPage variant="scale">
            <LoginRegisterPage language={language} />
          </AnimatedPage>
        } />
        {/* ========== PROTECTED ========== */}
        
        <Route path="/library" element={
          <ProtectedRoute>
            <AnimatedPage variant="slideY">
              <LibraryPage language={language} />
            </AnimatedPage>
          </ProtectedRoute>
        } />
        
        <Route path="/history" element={
          <ProtectedRoute>
            <AnimatedPage variant="slideY">
              <HistoryPage />
            </AnimatedPage>
          </ProtectedRoute>
        } />
        
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [language, setLanguage] = useState('VN')
  const [predictionResult, setPredictionResult] = useState(null)

  const handleSetPrediction = (data) => {
    setPredictionResult(data);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header language={language} setLanguage={setLanguage} />
        <main className="flex-1 w-full">
          <AnimatedRoutes 
            language={language} 
            predictionResult={predictionResult} 
            setPredictionResult={handleSetPrediction}
          />
        </main>
        <Footer language={language} />
      </div>
    </Router>
  )
}

export default App
