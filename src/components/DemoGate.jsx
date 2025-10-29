import { useState } from 'react';
import { activateAdminMode } from '../utils/rateLimit';

export default function DemoGate({ onStart }) {
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleStartDemo = () => {
    onStart(false); // Regular user
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    const success = activateAdminMode(adminCode);
    
    if (success) {
      onStart(true); // Admin mode
    } else {
      setAdminError('Invalid code');
      setTimeout(() => setAdminError(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CodePractice.AI
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Practice Python & SQL with real-time AI feedback
          </p>

          {/* Demo Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  This is a demo portfolio project
                </p>
                <p className="text-sm text-blue-700">
                  Click start demo to get <strong>25,000 free Gemini tokens</strong> for AI-powered hints and feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🐍</div>
              <div className="font-semibold text-gray-900 text-sm">Python Execution</div>
              <div className="text-xs text-gray-600">Run real Python code in your browser</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🗄️</div>
              <div className="font-semibold text-gray-900 text-sm">SQL Practice</div>
              <div className="text-xs text-gray-600">Query real databases with feedback</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold text-gray-900 text-sm">AI Hints</div>
              <div className="text-xs text-gray-600">Contextual help when you're stuck</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartDemo}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Demo →
          </button>

          {/* Admin Access Link */}
          <div className="mt-6">
            {!showAdminInput ? (
              <button
                onClick={() => setShowAdminInput(true)}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Admin access
              </button>
            ) : (
              <form onSubmit={handleAdminSubmit} className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Admin code"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Unlock
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminInput(false);
                      setAdminCode('');
                      setAdminError('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {adminError && (
                  <span className="text-red-500 text-xs">{adminError}</span>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Built by <a href="https://jonashaahr.com" className="text-blue-600 hover:underline">Jonas Haahr</a> • 
          View on <a href="https://github.com/Nordic-OG-Raven" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
        </p>
      </div>
    </div>
  );
}

