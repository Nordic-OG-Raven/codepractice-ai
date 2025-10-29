import { createContext, useContext, useState, useEffect } from 'react'
import { getFromStorage, saveToStorage } from '../services/storage'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [userLevel, setUserLevel] = useState(() => {
    return getFromStorage('userLevel') || {
      'Data Engineering': 1,
      'Analytics Engineering': 1,
      'Data Analysis': 1,
      'Data Science': 1,
      'Other': 1
    }
  })

  const [userProgress, setUserProgress] = useState(() => {
    return getFromStorage('userProgress') || {}
  })

  useEffect(() => {
    saveToStorage('userLevel', userLevel)
  }, [userLevel])

  useEffect(() => {
    saveToStorage('userProgress', userProgress)
  }, [userProgress])

  const levelUp = (category) => {
    setUserLevel(prev => ({
      ...prev,
      [category]: (prev[category] || 1) + 1
    }))
  }

  const updateProgress = (category, exerciseId, result) => {
    setUserProgress(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [exerciseId]: {
          ...result,
          timestamp: new Date().toISOString()
        }
      }
    }))
  }

  const getLevelForCategory = (category) => {
    return userLevel[category] || 1
  }

  const value = {
    userLevel,
    userProgress,
    levelUp,
    updateProgress,
    getLevelForCategory
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

