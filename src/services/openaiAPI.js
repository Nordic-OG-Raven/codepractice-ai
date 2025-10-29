import OpenAI from 'openai'
import { generateExercisesPrompt, generateHintPrompt, generateFeedbackPrompt } from './prompts'

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!API_KEY) {
  console.warn('OpenAI API key not found. Set VITE_OPENAI_API_KEY in .env file.')
}

const openai = API_KEY ? new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true }) : null

/**
 * Generate exercises using OpenAI API
 */
export const generateExercises = async (category, level = 1) => {
  if (!openai) {
    throw new Error('OpenAI API not configured. Please add VITE_OPENAI_API_KEY to .env file.')
  }

  try {
    const prompt = generateExercisesPrompt(category, level)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert coding instructor. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })
    
    const text = completion.choices[0].message.content
    
    // Extract JSON from response
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
  if (!openai) {
    throw new Error('OpenAI API not configured')
  }

  try {
    const prompt = generateHintPrompt(question, userAnswer, correctSolution)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful coding tutor.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    })
    
    const hint = completion.choices[0].message.content.trim()
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
  if (!openai) {
    throw new Error('OpenAI API not configured')
  }

  try {
    const prompt = generateFeedbackPrompt(question, userAnswer, correctSolution, errorMessage)
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful coding instructor.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    })
    
    const feedback = completion.choices[0].message.content.trim()
    return feedback
  } catch (error) {
    console.error('Error getting feedback:', error)
    throw new Error('Failed to get feedback')
  }
}

