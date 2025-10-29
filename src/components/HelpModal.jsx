import { useState } from 'react'
import { getHint } from '../services/openaiAPI'
import LoadingSpinner from './LoadingSpinner'

const HelpModal = ({ exercise, userAnswer, onClose }) => {
  const [hint, setHint] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSolution, setShowSolution] = useState(false)

  const requestHint = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const hintText = await getHint(
        exercise.question,
        userAnswer,
        exercise.solution
      )
      setHint(hintText)
    } catch (err) {
      setError('Failed to get hint. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">💡 Need Help?</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!hint && !showSolution && (
            <>
              <p className="text-gray-600">
                Stuck on this exercise? Get a hint to guide you in the right direction.
              </p>
              <button
                onClick={requestHint}
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Getting hint...' : 'Get a Hint'}
              </button>
            </>
          )}

          {isLoading && <LoadingSpinner message="Generating hint..." />}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {hint && !showSolution && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Hint:</h3>
                <p className="text-blue-800">{hint}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="btn btn-primary flex-1"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setShowSolution(true)}
                  className="btn btn-secondary flex-1"
                >
                  Show Solution
                </button>
              </div>
            </>
          )}

          {showSolution && (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Solution:</h3>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto text-sm">
                  <code>{exercise.solution}</code>
                </pre>
              </div>
              <button
                onClick={onClose}
                className="btn btn-primary w-full"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default HelpModal

