import { createContext, useContext, useState } from 'react'

const ExerciseContext = createContext()

export const useExercise = () => {
  const context = useContext(ExerciseContext)
  if (!context) {
    throw new Error('useExercise must be used within ExerciseProvider')
  }
  return context
}

export const ExerciseProvider = ({ children }) => {
  const [exercises, setExercises] = useState([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [sessionResults, setSessionResults] = useState({}) // Changed to object indexed by exercise index
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const currentExercise = exercises[currentExerciseIndex] || null

  const setExerciseList = (newExercises) => {
    setExercises(newExercises)
    setCurrentExerciseIndex(0)
    setSessionResults({})
    setError(null)
  }

  const submitAnswer = (userAnswer, isCorrect, feedback = null) => {
    const result = {
      exerciseId: currentExercise.id,
      question: currentExercise.question,
      userAnswer,
      isCorrect,
      feedback,
      timestamp: new Date().toISOString()
    }
    // Store result indexed by exercise index for easy lookup
    setSessionResults(prev => ({
      ...prev,
      [currentExerciseIndex]: result
    }))
  }

  // Get result for current exercise (if already attempted)
  const getCurrentResult = () => {
    return sessionResults[currentExerciseIndex] || null
  }

  // Get all results as array for summary page
  const getAllResults = () => {
    return Object.values(sessionResults)
  }

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
    }
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
    }
  }

  const resetSession = () => {
    setExercises([])
    setCurrentExerciseIndex(0)
    setSessionResults({})
    setError(null)
  }

  const value = {
    exercises,
    currentExercise,
    currentExerciseIndex,
    sessionResults,
    getAllResults,
    getCurrentResult,
    isLoading,
    error,
    setExerciseList,
    setIsLoading,
    setError,
    submitAnswer,
    nextExercise,
    previousExercise,
    resetSession
  }

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>
}

