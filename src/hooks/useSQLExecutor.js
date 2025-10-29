import { useState, useEffect } from 'react'
import initSqlJs from 'sql.js'
import { sampleDataSQL } from '../utils/sampleData'

export const useSQLExecutor = () => {
  const [db, setDb] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initDB = async () => {
      try {
        setIsLoading(true)
        // Load sql.js with CDN wasm file
        const SQL = await initSqlJs({
          locateFile: file => `https://sql.js.org/dist/${file}`
        })
        
        // Create database and load sample data
        const database = new SQL.Database()
        database.run(sampleDataSQL)
        
        setDb(database)
        setError(null)
      } catch (err) {
        console.error('Failed to initialize SQL database:', err)
        setError('Failed to initialize SQL database')
      } finally {
        setIsLoading(false)
      }
    }

    initDB()
  }, [])

  const executeSQL = (query) => {
    if (!db) {
      return { error: 'Database not initialized' }
    }

    try {
      // Execute query
      const results = db.exec(query)
      
      if (results.length === 0) {
        // Query executed but returned no results (like CREATE, INSERT, UPDATE)
        return { data: [], success: true }
      }

      // Convert results to array of objects
      const result = results[0]
      const data = result.values.map(row => {
        const obj = {}
        result.columns.forEach((col, idx) => {
          obj[col] = row[idx]
        })
        return obj
      })

      return { data, success: true }
    } catch (err) {
      return { error: err.message, success: false }
    }
  }

  return {
    executeSQL,
    isLoading,
    error,
    isReady: !!db && !isLoading
  }
}

