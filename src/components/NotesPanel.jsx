import { useState, useEffect, useRef } from 'react'
import { getNotes, saveNotes } from '../services/notes'

const NotesPanel = ({ category, isOpen, onClose }) => {
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const saveTimerRef = useRef(null)

  // Load notes when category changes
  useEffect(() => {
    const savedNotes = getNotes(category)
    setNotes(savedNotes)
  }, [category])

  // Auto-save with debouncing (saves 1 second after user stops typing)
  const handleNotesChange = (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)

    // Clear previous timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    // Set new timer to save after 1 second
    setIsSaving(true)
    saveTimerRef.current = setTimeout(() => {
      const result = saveNotes(category, newNotes)
      if (result.success) {
        setLastSaved(new Date())
        setIsSaving(false)
      }
    }, 1000)
  }

  // Save immediately when closing
  const handleClose = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }
    saveNotes(category, notes)
    onClose()
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Notes</h2>
              <p className="text-xs text-gray-500">{category}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Save indicator */}
            <span className="text-xs text-gray-500">
              {isSaving ? (
                <span className="text-yellow-600">💾 Saving...</span>
              ) : lastSaved ? (
                <span className="text-green-600">✓ Saved</span>
              ) : null}
            </span>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Notes textarea */}
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Write your notes here... (auto-saves)"
          className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm"
          autoFocus
        />

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">
            💾 Auto-saved • Backed up automatically
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotesPanel

