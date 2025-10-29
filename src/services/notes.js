import { getFromStorage, saveToStorage } from './storage'

const NOTES_KEY = 'categoryNotes'
const BACKUP_KEY = 'categoryNotesBackup'

/**
 * Get notes for a specific category
 */
export const getNotes = (category) => {
  const allNotes = getFromStorage(NOTES_KEY) || {}
  return allNotes[category] || ''
}

/**
 * Save notes for a specific category
 * ALWAYS creates a backup before saving
 */
export const saveNotes = (category, content) => {
  try {
    // Get current notes
    const allNotes = getFromStorage(NOTES_KEY) || {}
    
    // Create backup of current state before updating
    saveToStorage(BACKUP_KEY, allNotes)
    
    // Update notes
    allNotes[category] = content
    
    // Save to localStorage
    saveToStorage(NOTES_KEY, allNotes)
    
    return { success: true }
  } catch (error) {
    console.error('Failed to save notes:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all notes (for export)
 */
export const getAllNotes = () => {
  return getFromStorage(NOTES_KEY) || {}
}

/**
 * Restore from backup
 */
export const restoreFromBackup = () => {
  const backup = getFromStorage(BACKUP_KEY)
  if (backup) {
    saveToStorage(NOTES_KEY, backup)
    return { success: true }
  }
  return { success: false, error: 'No backup found' }
}

/**
 * Export notes as JSON (for manual backup)
 */
export const exportNotes = () => {
  const notes = getAllNotes()
  const dataStr = JSON.stringify(notes, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `codepractice-notes-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import notes from JSON file
 */
export const importNotes = (jsonString) => {
  try {
    const notes = JSON.parse(jsonString)
    saveToStorage(NOTES_KEY, notes)
    return { success: true }
  } catch (error) {
    console.error('Failed to import notes:', error)
    return { success: false, error: 'Invalid JSON format' }
  }
}

