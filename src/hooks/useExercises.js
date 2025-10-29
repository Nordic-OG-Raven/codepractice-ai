import { useState } from 'react'
import { generateExercises } from '../services/geminiAPI'
import { useExercise } from '../contexts/ExerciseContext'
import { useUser } from '../contexts/UserContext'
import preGeneratedExercises from '../data/preGeneratedExercises.json'

export const useExercises = () => {
  const { setExerciseList, setIsLoading, setError } = useExercise()
  const { getLevelForCategory } = useUser()
  const [isGenerating, setIsGenerating] = useState(false)

  const loadExercises = async (category) => {
    setIsGenerating(false) // Don't show loading initially
    setIsLoading(false)
    setError(null)

    try {
      const level = getLevelForCategory(category)
      
      // Get pre-generated exercises for instant start
      const preGenerated = preGeneratedExercises[category] || preGeneratedExercises['General Programming'] || []
      
      if (preGenerated.length > 0) {
        // Show first pre-generated exercise instantly
        const firstExercise = [preGenerated[0]]
        setExerciseList(firstExercise)
        
        // Generate fresh exercises in background
        setTimeout(async () => {
          try {
            const freshExercises = await generateExercises(category, level)
            // Replace with fresh exercises (user is likely still on exercise #1)
            setExerciseList(freshExercises)
          } catch (err) {
            // If background generation fails, fall back to more pre-generated
            console.warn('Background generation failed, using pre-generated:', err)
            setExerciseList(preGenerated.slice(0, 10))
          }
        }, 100)
        
        return { success: true, exercises: firstExercise }
      } else {
        // Fallback: no pre-generated exercises, show loading
        setIsGenerating(true)
        setIsLoading(true)
        const exercises = await generateExercises(category, level)
        setExerciseList(exercises)
        setIsGenerating(false)
        setIsLoading(false)
        return { success: true, exercises }
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to generate exercises'
      setError(errorMessage)
      setIsGenerating(false)
      setIsLoading(false)
      return { success: false, error: errorMessage }
    }
  }

  return {
    loadExercises,
    isGenerating
  }
}

