import { useState, useEffect } from 'react'

const CodeEditor = ({ language, value, onChange, placeholder }) => {
  const [code, setCode] = useState(value || '')

  useEffect(() => {
    setCode(value || '')
  }, [value])

  const handleChange = (e) => {
    const newCode = e.target.value
    setCode(newCode)
    onChange(newCode)
  }

  const handleKeyDown = (e) => {
    // Tab key support
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      onChange(newCode)
      // Set cursor position after tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      }, 0)
    }
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
        {language === 'python' ? '🐍 Python' : '🗄️ SQL'}
      </div>
      <textarea
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || `Write your ${language} code here...`}
        className="code-input"
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
      />
    </div>
  )
}

export default CodeEditor

