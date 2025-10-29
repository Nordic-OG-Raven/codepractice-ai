import { useState } from 'react'
import { generateExercises } from '../services/geminiAPI'
import { useExercise } from '../contexts/ExerciseContext'
import { useUser } from '../contexts/UserContext'

export const useExercises = () => {
  const { setExerciseList, setIsLoading, setError } = useExercise()
  const { getLevelForCategory } = useUser()
  const [isGenerating, setIsGenerating] = useState(false)

  const loadExercises = async (category) => {
    setIsGenerating(true)
    setIsLoading(true)
    setError(null)

    try {
      const level = getLevelForCategory(category)
      const exercises = await generateExercises(category, level)
      setExerciseList(exercises)
      return { success: true, exercises }
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate exercises'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsGenerating(false)
      setIsLoading(false)
    }
  }

  return {
    loadExercises,
    isGenerating
  }
}

