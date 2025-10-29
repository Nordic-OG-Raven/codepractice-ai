import { useState, useEffect } from 'react'
import { ExerciseProvider } from './contexts/ExerciseContext'
import { UserProvider } from './contexts/UserContext'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Results from './pages/Results'
import { useExercise } from './contexts/ExerciseContext'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'practice', 'results'
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [reviewSession, setReviewSession] = useState(null)
  const { setExerciseList, sessionResults } = useExercise()

  const startPractice = (category) => {
    setSelectedCategory(category)
    setReviewSession(null)
    setCurrentPage('practice')
  }

  const startReview = (session) => {
    setSelectedCategory(session.category)
    setReviewSession(session)
    setExerciseList(session.exercises)
    // Load the session results into context
    Object.keys(session.results).forEach(key => {
      sessionResults[key] = session.results[key]
    })
    setCurrentPage('practice')
  }

  const finishPractice = () => {
    setCurrentPage('results')
  }

  const returnHome = () => {
    setCurrentPage('home')
    setSelectedCategory(null)
    setReviewSession(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {currentPage === 'home' && (
        <Home 
          onSelectCategory={startPractice}
          onReviewSession={startReview}
        />
      )}
      {currentPage === 'practice' && (
        <Practice 
          category={selectedCategory} 
          onFinish={finishPractice}
          onBack={returnHome}
          reviewSession={reviewSession}
        />
      )}
      {currentPage === 'results' && (
        <Results onReturnHome={returnHome} />
      )}
    </div>
  )
}

function App() {
  return (
    <UserProvider>
      <ExerciseProvider>
        <AppContent />
      </ExerciseProvider>
    </UserProvider>
  )
}

export default App
