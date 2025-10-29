/**
 * Utility functions for validating code execution results
 */

/**
 * Compare SQL query results
 */
export const compareSQLResults = (userResult, expectedResult) => {
  try {
    // Both should be arrays
    if (!Array.isArray(userResult) || !Array.isArray(expectedResult)) {
      return { isCorrect: false, message: 'Invalid result format' }
    }

    // Check row count
    if (userResult.length !== expectedResult.length) {
      return {
        isCorrect: false,
        message: `Row count mismatch: expected ${expectedResult.length}, got ${userResult.length}`
      }
    }

    // Empty results
    if (userResult.length === 0 && expectedResult.length === 0) {
      return { isCorrect: true, message: 'Correct! Query returned no rows as expected.' }
    }

    // Check column names
    const userColumns = Object.keys(userResult[0] || {}).sort()
    const expectedColumns = Object.keys(expectedResult[0] || {}).sort()
    
    if (JSON.stringify(userColumns) !== JSON.stringify(expectedColumns)) {
      return {
        isCorrect: false,
        message: `Column mismatch. Expected: ${expectedColumns.join(', ')}, Got: ${userColumns.join(', ')}`
      }
    }

    // Compare values (allowing for different row order)
    const userSorted = JSON.stringify(sortResults(userResult))
    const expectedSorted = JSON.stringify(sortResults(expectedResult))

    if (userSorted === expectedSorted) {
      return { isCorrect: true, message: 'Correct! Results match perfectly.' }
    } else {
      return {
        isCorrect: false,
        message: 'Results do not match expected output. Check your query logic.'
      }
    }
  } catch (error) {
    return { isCorrect: false, message: `Validation error: ${error.message}` }
  }
}

/**
 * Compare Python code output
 */
export const comparePythonResults = (userOutput, expectedOutput) => {
  try {
    // Normalize whitespace
    const normalizeOutput = (str) => {
      if (str === null || str === undefined) return ''
      return String(str).trim().replace(/\s+/g, ' ')
    }

    const userNormalized = normalizeOutput(userOutput)
    const expectedNormalized = normalizeOutput(expectedOutput)

    if (userNormalized === expectedNormalized) {
      return { isCorrect: true, message: 'Correct! Output matches expected result.' }
    }

    // Try numeric comparison if both are numbers
    const userNum = parseFloat(userOutput)
    const expectedNum = parseFloat(expectedOutput)
    
    if (!isNaN(userNum) && !isNaN(expectedNum)) {
      if (Math.abs(userNum - expectedNum) < 0.0001) {
        return { isCorrect: true, message: 'Correct! Numeric result matches.' }
      }
    }

    return {
      isCorrect: false,
      message: `Output mismatch.\nExpected: ${expectedOutput}\nGot: ${userOutput}`
    }
  } catch (error) {
    return { isCorrect: false, message: `Validation error: ${error.message}` }
  }
}

/**
 * Sort results for consistent comparison
 */
const sortResults = (results) => {
  return results.map(row => {
    const sorted = {}
    Object.keys(row).sort().forEach(key => {
      sorted[key] = row[key]
    })
    return sorted
  }).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

/**
 * Format error messages for display
 */
export const formatError = (error) => {
  if (typeof error === 'string') return error
  if (error.message) return error.message
  return 'An unknown error occurred'
}

