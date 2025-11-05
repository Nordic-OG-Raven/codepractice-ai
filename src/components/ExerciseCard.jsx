import { useState, useEffect } from 'react'
import CodeEditor from './CodeEditor'
import HelpModal from './HelpModal'
import LoadingSpinner from './LoadingSpinner'
import { useSQLExecutor } from '../hooks/useSQLExecutor'
import { usePythonExecutor } from '../hooks/usePythonExecutor'
import { compareSQLResults, comparePythonResults } from '../utils/codeValidator'
import { getFeedback } from '../services/geminiAPI'
import { useExercise } from '../contexts/ExerciseContext'

const ExerciseCard = ({ exercise, onSubmit, exerciseNumber, totalExercises, onPrevious, onNext }) => {
  const { getCurrentResult } = useExercise()
  const previousResult = getCurrentResult()
  
  const [userAnswer, setUserAnswer] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState(null)
  const [showHelp, setShowHelp] = useState(false)

  // Load previous answer when reviewing
  useEffect(() => {
    if (previousResult) {
      setUserAnswer(previousResult.userAnswer)
      setResult({
        isCorrect: previousResult.isCorrect,
        message: previousResult.isCorrect ? 'Correct! (previously submitted)' : 'Incorrect (previously submitted)'
      })
    } else {
      setUserAnswer('')
      setResult(null)
    }
  }, [exercise.id, previousResult])

  const { executeSQL, isReady: sqlReady } = useSQLExecutor()
  const { executePython, isReady: pythonReady } = usePythonExecutor()

  const isLanguageReady = exercise.language === 'sql' ? sqlReady : pythonReady

  const checkAnswer = async () => {
    if (!userAnswer.trim()) {
      setResult({
        isCorrect: false,
        message: 'Please write some code before checking!'
      })
      return
    }

    setIsChecking(true)
    setResult(null)

    try {
      if (exercise.language === 'sql') {
        await checkSQLAnswer()
      } else {
        await checkPythonAnswer()
      }
    } catch (err) {
      setResult({
        isCorrect: false,
        message: `Error: ${err.message}`
      })
    } finally {
      setIsChecking(false)
    }
  }

  const checkSQLAnswer = async () => {
    // Execute user's query
    const userResult = executeSQL(userAnswer)
    
    if (userResult.error) {
      const feedback = await getFeedback(
        exercise.question,
        userAnswer,
        exercise.solution,
        userResult.error
      )
      setResult({
        isCorrect: false,
        message: feedback || `SQL Error: ${userResult.error}`
      })
      return
    }

    // Execute expected solution
    const expectedResult = executeSQL(exercise.solution)
    
    if (expectedResult.error) {
      setResult({
        isCorrect: false,
        message: 'Error in expected solution. Please contact support.'
      })
      return
    }

    // Compare results
    const comparison = compareSQLResults(userResult.data, expectedResult.data)
    setResult(comparison)
    
    if (comparison.isCorrect) {
      onSubmit(userAnswer, true)
    }
  }

  const checkPythonAnswer = async () => {
    // Execute user's code
    const userResult = await executePython(userAnswer)
    
    if (userResult.error) {
      const feedback = await getFeedback(
        exercise.question,
        userAnswer,
        exercise.solution,
        userResult.error
      )
      setResult({
        isCorrect: false,
        message: feedback || `Python Error: ${userResult.error}`
      })
      return
    }

    // Execute expected solution
    const expectedResult = await executePython(exercise.solution)
    
    if (expectedResult.error) {
      setResult({
        isCorrect: false,
        message: 'Error in expected solution. Please contact support.'
      })
      return
    }

    // Compare outputs
    const comparison = comparePythonResults(userResult.output, expectedResult.output)
    setResult(comparison)
    
    if (comparison.isCorrect) {
      onSubmit(userAnswer, true)
    }
  }

  const handleNext = () => {
    setUserAnswer('')
    setResult(null)
    onSubmit(userAnswer, result?.isCorrect || false)
  }

  if (!isLanguageReady) {
    return (
      <div className="card">
        <LoadingSpinner message={`Loading ${exercise.language === 'sql' ? 'SQL' : 'Python'} runtime...`} />
      </div>
    )
  }

  return (
    <>
      <div className="card space-y-4">
        {/* Progress */}
        <div className="flex justify-between items-center text-sm text-brand-text-secondary">
          <span className="font-semibold">Exercise {exerciseNumber}/{totalExercises}</span>
          <span className="text-xs bg-brand-surface border border-brand-border px-2 py-1 rounded text-brand-text-secondary">
            {exercise.language === 'sql' ? 'SQL' : 'Python'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-brand-border rounded-full h-2">
          <div
            className="bg-brand-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(exerciseNumber / totalExercises) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
          <h3 className="font-semibold text-brand-text mb-2">Question:</h3>
          <p className="text-brand-text-secondary whitespace-pre-wrap">{exercise.question}</p>
        </div>

        {/* Code Editor */}
        <CodeEditor
          language={exercise.language}
          value={userAnswer}
          onChange={setUserAnswer}
        />

        {/* Result */}
        {result && (
          <div
            className={`rounded-lg p-4 ${
              result.isCorrect
                ? 'bg-emerald-500/20 border border-emerald-500/50'
                : 'bg-red-500/20 border border-red-500/50'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-1">
                <p
                  className={`${
                    result.isCorrect ? 'text-emerald-400' : 'text-red-400'
                  } whitespace-pre-wrap`}
                >
                  {result.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation and Action Buttons */}
        <div className="space-y-2">
          {/* Previous/Next Navigation */}
          <div className="flex gap-3">
            <button
              onClick={onPrevious}
              disabled={exerciseNumber === 1}
              className="btn btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={onNext}
              disabled={exerciseNumber === totalExercises}
              className="btn btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowHelp(true)}
              className="btn btn-secondary flex-1"
              disabled={isChecking}
            >
              Help
            </button>
            <button
              onClick={checkAnswer}
              disabled={isChecking || !userAnswer.trim()}
              className="btn btn-primary flex-1 disabled:opacity-50"
            >
              {isChecking ? 'Checking...' : previousResult ? '↻ Recheck' : '✓ Check Answer'}
            </button>
          </div>
        </div>
      </div>

      {showHelp && (
        <HelpModal
          exercise={exercise}
          userAnswer={userAnswer}
          onClose={() => setShowHelp(false)}
        />
      )}
    </>
  )
}

export default ExerciseCard

