import { useState } from 'react'
import CategorySelector from '../components/CategorySelector'
import LevelBadge from '../components/LevelBadge'
import SessionHistory from '../components/SessionHistory'
import { useUser } from '../contexts/UserContext'

const Home = ({ onSelectCategory, onReviewSession }) => {
  const { userLevel } = useUser()
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-text mb-2">
          CodePractice.AI
        </h1>
        <p className="text-brand-text-secondary">
          Practice Python & SQL with AI-powered feedback
        </p>
      </div>

      {/* Level Summary */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-brand-text mb-3">Your Progress</h2>
          <div className="space-y-2">
            {Object.entries(userLevel).map(([category, level]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-sm text-brand-text-secondary">{category}</span>
                <LevelBadge level={level} category={category} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle between Categories and History */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="flex gap-2 bg-brand-surface border border-brand-border rounded-lg p-1">
          <button
            onClick={() => setShowHistory(false)}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              !showHistory 
                ? 'bg-brand-primary text-white shadow' 
                : 'text-brand-text-secondary hover:text-brand-text'
            }`}
          >
            📚 Practice
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              showHistory 
                ? 'bg-brand-primary text-white shadow' 
                : 'text-brand-text-secondary hover:text-brand-text'
            }`}
          >
            📖 History
          </button>
        </div>
      </div>

      {/* Category Selection or History */}
      <div className="max-w-2xl mx-auto">
        {!showHistory ? (
          <>
            <h2 className="text-xl font-semibold text-brand-text mb-4">
              Choose Your Focus
            </h2>
            <CategorySelector onSelect={onSelectCategory} />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-brand-text mb-4">
              Past Sessions
            </h2>
            <SessionHistory onReviewSession={onReviewSession} />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-8 text-center text-xs text-brand-text-muted">
        <p>Built with Gemini 1.5 Flash • Mobile-First Design</p>
      </div>
    </div>
  )
}

export default Home

