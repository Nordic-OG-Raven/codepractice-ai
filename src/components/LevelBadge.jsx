const LevelBadge = ({ level, category }) => {
  const getLevelColor = (lvl) => {
    if (lvl === 1) return 'bg-green-100 text-green-700 border-green-300'
    if (lvl === 2) return 'bg-blue-100 text-blue-700 border-blue-300'
    return 'bg-purple-100 text-purple-700 border-purple-300'
  }

  const getLevelLabel = (lvl) => {
    if (lvl === 1) return 'Beginner'
    if (lvl === 2) return 'Intermediate'
    return 'Advanced'
  }

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full border-2 text-sm font-semibold ${getLevelColor(level)}`}>
      <span className="mr-1">⭐</span>
      <span>Level {level}: {getLevelLabel(level)}</span>
    </div>
  )
}

export default LevelBadge

