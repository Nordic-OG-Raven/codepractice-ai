import { useEffect, useState } from 'react'
import { useExercise } from '../contexts/ExerciseContext'
import { useUser } from '../contexts/UserContext'
import { useExercises } from '../hooks/useExercises'
import ExerciseCard from '../components/ExerciseCard'
import LoadingSpinner from '../components/LoadingSpinner'
import LevelBadge from '../components/LevelBadge'
import NotesPanel from '../components/NotesPanel'
import { saveSession } from '../services/sessionHistory'

const Practice = ({ category, onFinish, onBack, reviewSession = null }) => {
  const { exercises, currentExercise, currentExerciseIndex, nextExercise, previousExercise, resetSession, getAllResults, setExerciseList, sessionResults } = useExercise()
  const { getLevelForCategory, updateProgress, levelUp } = useUser()
  const { loadExercises, isGenerating } = useExercises()
  const [error, setError] = useState(null)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  const currentLevel = reviewSession ? reviewSession.level : getLevelForCategory(category)

  useEffect(() => {
    if (reviewSession) {
      // Load from saved session
      setIsReviewMode(true)
      setExerciseList(reviewSession.exercises)
      // Note: sessionResults are already loaded from reviewSession context
    } else {
      // Generate new exercises
      const fetchExercises = async () => {
        const result = await loadExercises(category)
        if (!result.success) {
          setError(result.error)
        }
      }
      fetchExercises()
    }

    return () => {
      if (!reviewSession) {
        resetSession()
      }
    }
  }, [category, reviewSession])

  const handleSubmitAnswer = (userAnswer, isCorrect) => {
    if (currentExercise) {
      updateProgress(category, currentExercise.id, {
        userAnswer,
        isCorrect,
        solution: currentExercise.solution
      })
    }
  }

  const handleFinishSession = () => {
    // Save session to history
    const allResults = getAllResults()
    saveSession(category, currentLevel, exercises, sessionResults)
    
    // Calculate score
    const correctCount = allResults.filter(r => r.isCorrect).length

    if (correctCount >= 8) {
      setShowLevelUp(true)
    } else {
      onFinish()
    }
  }

  const handleLevelUp = () => {
    levelUp(category)
    setShowLevelUp(false)
    onFinish()
  }

  const handleStaySameLevel = () => {
    setShowLevelUp(false)
    onFinish()
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="card max-w-md">
          <div className="text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary w-full"
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className="btn btn-secondary w-full"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Removed the blocking loading screen - now loads in background

  if (showLevelUp) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="card max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Congratulations!
            </h2>
            <p className="text-gray-600 mb-4">
              You've mastered the current level. Ready for a bigger challenge?
            </p>
            <div className="flex justify-center mb-6">
              <LevelBadge level={currentLevel + 1} category={category} />
            </div>
            <div className="space-y-2">
              <button
                onClick={handleLevelUp}
                className="btn btn-primary w-full"
              >
                Level Up! 🚀
              </button>
              <button
                onClick={handleStaySameLevel}
                className="btn btn-secondary w-full"
              >
                Practice More at This Level
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={onBack}
            className="text-primary-600 font-medium text-sm"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(true)}
              className="btn btn-secondary text-sm px-3 py-1"
              title="Open notes"
            >
              📝 Notes
            </button>
            <LevelBadge level={currentLevel} category={category} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{category}</h1>
      </div>

      {/* Exercise */}
      <div className="max-w-2xl mx-auto">
        {isGenerating || exercises.length === 0 ? (
          // Loading state - but UI is still accessible
          <div className="card">
            <LoadingSpinner message="Generating your personalized exercises..." />
            <p className="text-center text-sm text-gray-500 mt-4">
              This may take 10-15 seconds
            </p>
            <p className="text-center text-xs text-gray-400 mt-2">
              💡 Tip: Open notes (📝 button) to review while waiting
            </p>
          </div>
        ) : currentExercise ? (
          <ExerciseCard
            exercise={currentExercise}
            onSubmit={handleSubmitAnswer}
            exerciseNumber={currentExerciseIndex + 1}
            totalExercises={exercises.length}
            onPrevious={previousExercise}
            onNext={nextExercise}
          />
        ) : null}
        
        {/* Finish Session Button - show when at the end and have attempted exercises (not in review mode) */}
        {!isReviewMode && currentExerciseIndex === exercises.length - 1 && getAllResults().length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleFinishSession}
              className="btn btn-primary w-full"
            >
              🎯 Finish Session
            </button>
          </div>
        )}
        
        {/* Review mode indicator */}
        {isReviewMode && (
          <div className="mt-4 text-center text-sm text-gray-600">
            📚 Reviewing past session
          </div>
        )}
      </div>

      {/* Notes Panel */}
      <NotesPanel
        category={category}
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
      />

      {/* Floating Notes Button (fixed position for easy access) */}
      {!showNotes && (
        <button
          onClick={() => setShowNotes(true)}
          className="fixed bottom-6 right-6 bg-primary-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary-600 active:scale-95 transition-all flex items-center justify-center text-2xl z-40"
          title="Open notes"
        >
          📝
        </button>
      )}
    </div>
  )
}

export default Practice

