import { useState, useEffect } from 'react'

export const usePythonExecutor = () => {
  const [pyodide, setPyodide] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        setIsLoading(true)
        
        // Load Pyodide from CDN
        const pyodideModule = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        })
        
        // Load commonly used packages
        await pyodideModule.loadPackage(['numpy', 'pandas'])
        
        setPyodide(pyodideModule)
        setError(null)
      } catch (err) {
        console.error('Failed to load Pyodide:', err)
        setError('Failed to initialize Python runtime')
      } finally {
        setIsLoading(false)
      }
    }

    // Check if Pyodide script is loaded
    if (!window.loadPyodide) {
      // Add Pyodide script dynamically
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
      script.async = true
      script.onload = () => loadPyodide()
      script.onerror = () => {
        setError('Failed to load Pyodide script')
        setIsLoading(false)
      }
      document.head.appendChild(script)
    } else {
      loadPyodide()
    }
  }, [])

  const executePython = async (code) => {
    if (!pyodide) {
      return { error: 'Python runtime not initialized' }
    }

    try {
      // Redirect stdout
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `)

      // Execute user code with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Execution timeout (10s)')), 10000)
      )

      const executePromise = (async () => {
        try {
          const result = await pyodide.runPythonAsync(code)
          
          // Get stdout
          const stdout = pyodide.runPython('sys.stdout.getvalue()')
          
          // Return stdout if exists, otherwise return result
          const output = stdout || (result !== undefined ? String(result) : '')
          
          return { output, success: true }
        } catch (err) {
          return { error: err.message, success: false }
        }
      })()

      return await Promise.race([executePromise, timeoutPromise])
    } catch (err) {
      return { error: err.message, success: false }
    } finally {
      // Reset stdout
      try {
        pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
        `)
      } catch (e) {
        console.error('Failed to reset stdout:', e)
      }
    }
  }

  return {
    executePython,
    isLoading,
    error,
    isReady: !!pyodide && !isLoading
  }
}

