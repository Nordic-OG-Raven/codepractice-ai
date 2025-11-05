import { useState } from 'react';
import { activateAdminMode } from '../utils/rateLimit';
import { BrandingBar } from './BrandingBar';

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
    <div className="min-h-screen bg-brand-bg">
      <BrandingBar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-brand-text mb-4">
            CodePractice.AI
          </h1>
          
          <p className="text-xl text-brand-text-secondary mb-8">
            Practice Python & SQL with real-time AI feedback
          </p>

          {/* Demo Notice */}
          <div className="bg-brand-primary/20 border border-brand-primary/50 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-brand-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <p className="text-sm font-semibold text-brand-primary mb-1">
                  This is a demo portfolio project
                </p>
                <p className="text-sm text-brand-text-secondary">
                  Click start demo to get <strong>25,000 free Gemini tokens</strong> for AI-powered hints and feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
            <div className="p-4 bg-brand-surface border border-brand-border rounded-lg">
              <div className="text-2xl mb-2">🐍</div>
              <div className="font-semibold text-brand-text text-sm">Python Execution</div>
              <div className="text-xs text-brand-text-secondary">Run real Python code in your browser</div>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-lg">
              <div className="text-2xl mb-2">🗄️</div>
              <div className="font-semibold text-brand-text text-sm">SQL Practice</div>
              <div className="text-xs text-brand-text-secondary">Query real databases with feedback</div>
            </div>
            <div className="p-4 bg-brand-surface border border-brand-border rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold text-brand-text text-sm">AI Hints</div>
              <div className="text-xs text-brand-text-secondary">Contextual help when you're stuck</div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleStartDemo}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-primary-hover text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Start Demo →
          </button>

          {/* Admin Access Link */}
          <div className="mt-6">
            {!showAdminInput ? (
              <button
                onClick={() => setShowAdminInput(true)}
                className="text-xs text-brand-text-secondary hover:text-brand-primary transition-colors"
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
                  className="px-4 py-2 border border-brand-border rounded-lg bg-brand-surface text-brand-text text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-primary text-white text-sm rounded-lg hover:bg-brand-primary-hover transition-colors"
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
                    className="px-4 py-2 bg-brand-surface border border-brand-border text-brand-text-secondary text-sm rounded-lg hover:bg-brand-border transition-colors"
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
        <p className="text-center text-sm text-brand-text-muted mt-6">
          Built by <a href="https://nordicravensolutions.com" className="text-brand-primary hover:underline">Nordic Raven Solutions</a> • 
          View on <a href="https://github.com/Nordic-OG-Raven" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">GitHub</a>
        </p>
      </div>
      </div>
    </div>
  );
}

