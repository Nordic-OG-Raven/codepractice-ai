import { GoogleGenerativeAI } from '@google/generative-ai'
import { generateExercisesPrompt, generateHintPrompt, generateFeedbackPrompt } from './prompts'
import { hasTokensRemaining, addTokenUsage, getTokenUsage } from '../utils/rateLimit'

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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
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
    
    // Check if it's a model not found error (404)
    if (error.message && error.message.includes('404') && error.message.includes('not found')) {
      throw new Error('My sincere apologies! Google changed their Gemini model names since I last updated this app. Please reach out via the contact form at jonashaahr.com and I\'ll fix it ASAP. - Jonas')
    }
    
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

  // Check token budget (estimate ~2000 tokens for a hint)
  if (!hasTokensRemaining(2000)) {
    const { remaining } = getTokenUsage()
    throw new Error(`Token budget reached! You have ${remaining.toLocaleString()} Gemini tokens remaining. Try again in 24 hours.`)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = generateHintPrompt(question, userAnswer, correctSolution)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const hint = response.text().trim()
    
    // Track actual token usage
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0
    if (tokensUsed > 0) {
      addTokenUsage(tokensUsed)
    }
    
    return hint
  } catch (error) {
    console.error('Error getting hint:', error)
    
    // Check if it's a model not found error (404)
    if (error.message && error.message.includes('404') && error.message.includes('not found')) {
      throw new Error('My sincere apologies! Google changed their Gemini model names since I last updated this app. Please reach out via the contact form at jonashaahr.com and I\'ll fix it ASAP. - Jonas')
    }
    
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

  // Check token budget (estimate ~2000 tokens for feedback)
  if (!hasTokensRemaining(2000)) {
    const { remaining } = getTokenUsage()
    throw new Error(`Token budget reached! You have ${remaining.toLocaleString()} Gemini tokens remaining. Try again in 24 hours.`)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const prompt = generateFeedbackPrompt(question, userAnswer, correctSolution, errorMessage)
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const feedback = response.text().trim()
    
    // Track actual token usage
    const tokensUsed = response.usageMetadata?.totalTokenCount || 0
    if (tokensUsed > 0) {
      addTokenUsage(tokensUsed)
    }
    
    return feedback
  } catch (error) {
    console.error('Error getting feedback:', error)
    
    // Check if it's a model not found error (404)
    if (error.message && error.message.includes('404') && error.message.includes('not found')) {
      throw new Error('My sincere apologies! Google changed their Gemini model names since I last updated this app. Please reach out via the contact form at jonashaahr.com and I\'ll fix it ASAP. - Jonas')
    }
    
    throw new Error('Failed to get feedback')
  }
}

