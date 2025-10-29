import { useExercise } from '../contexts/ExerciseContext'

const Results = ({ onReturnHome }) => {
  const { getAllResults } = useExercise()
  const sessionResults = getAllResults()

  const correctCount = sessionResults.filter(r => r.isCorrect).length
  const totalCount = sessionResults.length
  const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  const getEmoji = (pct) => {
    if (pct >= 90) return '🏆'
    if (pct >= 70) return '🎉'
    if (pct >= 50) return '👍'
    return '💪'
  }

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
            <div className="text-6xl mb-4">{getEmoji(percentage)}</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Session Complete!
            </h1>
            <p className="text-xl text-gray-600">{getMessage(percentage)}</p>
          </div>

          {/* Score */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {correctCount}/{totalCount}
              </div>
              <p className="text-gray-700">Correct Answers</p>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{percentage}% Success Rate</p>
              </div>
            </div>
          </div>

          {/* Exercise Breakdown */}
          {sessionResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Exercise Summary
              </h2>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sessionResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      result.isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="text-xl mr-2">
                        {result.isCorrect ? '✅' : '❌'}
                      </span>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-800">
                          Exercise {idx + 1}
                        </p>
                        <p className="text-gray-600 line-clamp-2">
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

