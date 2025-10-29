import { getAllSessions, deleteSession } from '../services/sessionHistory'
import { useState } from 'react'

const SessionHistory = ({ onReviewSession }) => {
  const [sessions, setSessions] = useState(getAllSessions())

  const handleDelete = (sessionId, e) => {
    e.stopPropagation()
    if (confirm('Delete this session?')) {
      deleteSession(sessionId)
      setSessions(getAllSessions())
    }
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  if (sessions.length === 0) {
    return (
      <div className="card text-center text-gray-500 py-8">
        <p className="text-4xl mb-2">📚</p>
        <p>No past sessions yet</p>
        <p className="text-sm mt-1">Complete a session to see it here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onReviewSession(session)}
          className="card w-full text-left hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-800">{session.category}</h3>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                  Level {session.level}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>
                  {session.score.correct}/{session.score.total} correct
                </span>
                <span>•</span>
                <span>{formatDate(session.timestamp)}</span>
              </div>
            </div>
            <button
              onClick={(e) => handleDelete(session.id, e)}
              className="text-gray-400 hover:text-red-500 text-xl leading-none ml-2"
            >
              ×
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary-500 h-1.5 rounded-full"
              style={{ 
                width: `${(session.score.correct / session.score.total) * 100}%` 
              }}
            ></div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default SessionHistory

