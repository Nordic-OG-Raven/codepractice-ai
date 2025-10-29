import { useState, useEffect } from 'react';
import { getTokenUsage, isAdminUser } from '../utils/rateLimit';

export default function DemoBanner() {
  const [tokenInfo, setTokenInfo] = useState(getTokenUsage());
  const [isAdmin, setIsAdmin] = useState(isAdminUser());

  useEffect(() => {
    // Update token usage every second
    const interval = setInterval(() => {
      setTokenInfo(getTokenUsage());
      setIsAdmin(isAdminUser());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('demo_admin_token');
    window.location.reload();
  };

  if (isAdmin) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center gap-3">
          <span className="font-semibold">🔓 Admin Mode Active</span>
          <span>•</span>
          <span>Unlimited Gemini tokens</span>
          <button
            onClick={handleLogout}
            className="ml-2 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-xs transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  const isLow = tokenInfo.percentUsed >= 80;

  return (
    <div className={`px-4 py-2 text-center text-sm ${
      isLow 
        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
    }`}>
      <div className="flex items-center justify-center gap-2">
        <span>
          <strong>{tokenInfo.used.toLocaleString()}</strong> / {tokenInfo.budget.toLocaleString()} Gemini tokens used
        </span>
        <div className="hidden sm:block w-24 h-2 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${Math.max(0, 100 - tokenInfo.percentUsed)}%` }}
          />
        </div>
        {isLow && (
          <span className="text-xs opacity-90">• Resets in 24h</span>
        )}
      </div>
    </div>
  );
}

