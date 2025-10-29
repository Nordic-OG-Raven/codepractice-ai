import { GoogleGenerativeAI } from '@google/generative-ai'
import { generateExercisesPrompt, generateHintPrompt, generateFeedbackPrompt } from './prompts'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.warn('Gemini API key not found. Set VITE_GEMINI_API_KEY in .env file.')
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

/**
 * Generate exercises using Gemini API
 */
export const generateExercises = async (category, level = 1) => {
  if (!genAI) {
    throw new Error('Gemini API not configured. Please add VITE_GEMINI_API_KEY to .env file.')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = generateExercisesPrompt(category, level)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response (sometimes wrapped in markdown)
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from API')
    }
    
    const exercises = JSON.parse(jsonMatch[0])
    
    // Validate structure
    if (!Array.isArray(exercises) || exercises.length === 0) {
      throw new Error('No exercises generated')
    }
    
    return exercises
  } catch (error) {
    console.error('Error generating exercises:', error)
    throw new Error(`Failed to generate exercises: ${error.message}`)
  }
}

/**
 * Get a hint for a stuck user
 */
export const getHint = async (question, userAnswer, correctSolution) => {
  if (!genAI) {
    throw new Error('Gemini API not configured')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = generateHintPrompt(question, userAnswer, correctSolution)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const hint = response.text().trim()
    
    return hint
  } catch (error) {
    console.error('Error getting hint:', error)
    throw new Error('Failed to get hint')
  }
}

/**
 * Get detailed feedback on incorrect answer
 */
export const getFeedback = async (question, userAnswer, correctSolution, errorMessage = null) => {
  if (!genAI) {
    throw new Error('Gemini API not configured')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = generateFeedbackPrompt(question, userAnswer, correctSolution, errorMessage)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text().trim()
    
    return feedback
  } catch (error) {
    console.error('Error getting feedback:', error)
    throw new Error('Failed to get feedback')
  }
}

