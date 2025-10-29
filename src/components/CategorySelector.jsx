import { useState } from 'react'

const categories = [
  {
    id: 'Data Engineering',
    icon: '🔧',
    title: 'Data Engineering',
    description: 'Pipelines, ETL, storage'
  },
  {
    id: 'Analytics Engineering',
    icon: '🛠️',
    title: 'Analytics Engineering',
    description: 'Transformation, cleaning, SQL'
  },
  {
    id: 'Data Analysis',
    icon: '📊',
    title: 'Data Analysis',
    description: 'EDA, pandas, statistics'
  },
  {
    id: 'Data Science',
    icon: '🤖',
    title: 'Data Science',
    description: 'ML, models, features'
  },
  {
    id: 'Other',
    icon: '🎯',
    title: 'Custom Topic',
    description: 'Your own topic'
  }
]

const CategorySelector = ({ onSelect }) => {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customTopic, setCustomTopic] = useState('')

  const handleCategoryClick = (categoryId) => {
    if (categoryId === 'Other') {
      setShowCustomInput(true)
    } else {
      onSelect(categoryId)
    }
  }

  const handleCustomSubmit = () => {
    if (customTopic.trim()) {
      onSelect(customTopic.trim())
    }
  }

  if (showCustomInput) {
    return (
      <div className="card">
        <button
          onClick={() => setShowCustomInput(false)}
          className="mb-4 text-primary-600 text-sm font-medium"
        >
          ← Back to categories
        </button>
        <h3 className="text-xl font-bold mb-3">Enter Your Topic</h3>
        <input
          type="text"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="e.g., Web scraping with Python"
          maxLength={100}
          className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 mb-4"
          autoFocus
        />
        <button
          onClick={handleCustomSubmit}
          disabled={!customTopic.trim()}
          className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Practice
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className="category-card w-full text-left"
        >
          <div className="flex items-start">
            <div className="text-4xl mr-4">{category.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {category.title}
              </h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </div>
            <div className="text-primary-500 text-2xl">→</div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default CategorySelector

