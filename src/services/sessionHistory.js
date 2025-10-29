import { getFromStorage, saveToStorage } from './storage'

const HISTORY_KEY = 'sessionHistory'
const MAX_SESSIONS = 100 // Keep last 100 sessions

/**
 * Save a completed session to history
 */
export const saveSession = (category, level, exercises, results) => {
  const history = getFromStorage(HISTORY_KEY) || []
  
  const session = {
    id: Date.now().toString(),
    category,
    level,
    exercises,
    results,
    timestamp: new Date().toISOString(),
    score: {
      correct: Object.values(results).filter(r => r.isCorrect).length,
      total: Object.keys(results).length
    }
  }
  
  // Add new session at the beginning
  history.unshift(session)
  
  // Keep only last MAX_SESSIONS
  const trimmedHistory = history.slice(0, MAX_SESSIONS)
  
  saveToStorage(HISTORY_KEY, trimmedHistory)
  return session.id
}

/**
 * Get all sessions
 */
export const getAllSessions = () => {
  return getFromStorage(HISTORY_KEY) || []
}

/**
 * Get sessions for a specific category
 */
export const getSessionsByCategory = (category) => {
  const history = getAllSessions()
  return history.filter(s => s.category === category)
}

/**
 * Get a specific session by ID
 */
export const getSessionById = (sessionId) => {
  const history = getAllSessions()
  return history.find(s => s.id === sessionId)
}

/**
 * Delete a session
 */
export const deleteSession = (sessionId) => {
  const history = getAllSessions()
  const filtered = history.filter(s => s.id !== sessionId)
  saveToStorage(HISTORY_KEY, filtered)
}

/**
 * Clear all history
 */
export const clearAllHistory = () => {
  saveToStorage(HISTORY_KEY, [])
}

