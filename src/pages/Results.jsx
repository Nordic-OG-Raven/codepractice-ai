import { useExercise } from '../contexts/ExerciseContext'

const Results = ({ onReturnHome }) => {
  const { getAllResults } = useExercise()
  const sessionResults = getAllResults()

  const correctCount = sessionResults.filter(r => r.isCorrect).length
  const totalCount = sessionResults.length
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0


  const getMessage = (pct) => {
    if (pct >= 90) return 'Outstanding work!'
    if (pct >= 70) return 'Great job!'
    if (pct >= 50) return 'Good effort!'
    return 'Keep practicing!'
  }

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-brand-text mb-2">
              Session Complete!
            </h1>
            <p className="text-xl text-brand-text-secondary">{getMessage(percentage)}</p>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-br from-brand-primary/20 to-brand-primary/10 border border-brand-primary/30 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-brand-primary mb-2">
                {correctCount}/{totalCount}
              </div>
              <p className="text-brand-text-secondary">Correct Answers</p>
              <div className="mt-4">
                <div className="w-full bg-brand-border rounded-full h-3">
                  <div
                    className="bg-brand-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-brand-text-secondary mt-2">{percentage}% Success Rate</p>
              </div>
            </div>
          </div>

          {/* Exercise Breakdown */}
          {sessionResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-brand-text mb-3">
                Exercise Summary
              </h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sessionResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      result.isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500/50'
                        : 'bg-red-500/20 border-red-500/50'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-brand-text">
                          Exercise {idx + 1}
                        </p>
                        <p className="text-brand-text-secondary line-clamp-2">
                          {result.question}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={onReturnHome}
              className="btn btn-primary w-full"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Results

