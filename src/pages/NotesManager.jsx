import { useState } from 'react'
import { getAllNotes, exportNotes, importNotes } from '../services/notes'

const NotesManager = ({ onBack }) => {
  const [notes, setNotes] = useState(getAllNotes())
  const [importError, setImportError] = useState(null)

  const handleExport = () => {
    exportNotes()
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = importNotes(event.target.result)
      if (result.success) {
        setNotes(getAllNotes())
        setImportError(null)
        alert('✅ Notes imported successfully!')
      } else {
        setImportError(result.error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="text-primary-600 font-medium text-sm mb-2"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Notes Manager</h1>
          <p className="text-sm text-gray-600 mt-1">
            Backup and restore your notes
          </p>
        </div>

        {/* Backup/Export */}
        <div className="card mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            📥 Backup Your Notes
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Download all your notes as a JSON file for safekeeping
          </p>
          <button onClick={handleExport} className="btn btn-primary w-full">
            Export All Notes
          </button>
        </div>

        {/* Import */}
        <div className="card mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            📤 Restore from Backup
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Import notes from a previously exported JSON file
          </p>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="w-full"
          />
          {importError && (
            <p className="text-red-600 text-sm mt-2">Error: {importError}</p>
          )}
        </div>

        {/* Current Notes Summary */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            📝 Your Notes
          </h2>
          {Object.keys(notes).length === 0 ? (
            <p className="text-gray-500 text-sm">No notes yet</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(notes).map(([category, content]) => (
                <div
                  key={category}
                  className="bg-gray-50 rounded p-3 border border-gray-200"
                >
                  <div className="font-semibold text-sm text-gray-800 mb-1">
                    {category}
                  </div>
                  <div className="text-xs text-gray-600">
                    {content.length} characters
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotesManager

