/**
 * Rate limiting utility using localStorage
 * Tracks demo attempts per session token
 */

const STORAGE_KEYS = {
  SESSION_TOKEN: 'demo_session_token',
  TOKENS_USED: 'demo_tokens_used',
  LAST_RESET: 'demo_last_reset',
  ADMIN_TOKEN: 'demo_admin_token',
};

const TOKEN_BUDGET = 25000; // 25,000 Gemini API tokens per day
const ADMIN_SECRET = 'nordicraven2025'; // Change this to something secure

/**
 * Generate a unique session token
 */
function generateSessionToken() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if we need to reset the daily counter
 */
function shouldResetCounter() {
  const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET);
  if (!lastReset) return true;

  const lastResetDate = new Date(parseInt(lastReset));
  const now = new Date();
  
  // Reset if it's a new day (24 hours passed)
  return now.getTime() - lastResetDate.getTime() > 24 * 60 * 60 * 1000;
}

/**
 * Initialize demo session
 */
export function initializeSession() {
  // Generate session token if doesn't exist
  if (!localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN)) {
    const token = generateSessionToken();
    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
  }

  // Reset counter if needed
  if (shouldResetCounter()) {
    localStorage.setItem(STORAGE_KEYS.TOKENS_USED, '0');
    localStorage.setItem(STORAGE_KEYS.LAST_RESET, Date.now().toString());
  }

  return {
    isActive: true,
    isAdmin: isAdminUser(),
  };
}

/**
 * Check if current user is admin (has unlimited access)
 */
export function isAdminUser() {
  const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  return adminToken === ADMIN_SECRET;
}

/**
 * Activate admin mode with secret code
 */
export function activateAdminMode(secretCode) {
  if (secretCode === ADMIN_SECRET) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, ADMIN_SECRET);
    return true;
  }
  return false;
}

/**
 * Get current token usage
 */
export function getTokenUsage() {
  if (isAdminUser()) {
    return { used: 0, budget: Infinity, remaining: Infinity, percentUsed: 0 };
  }

  const tokensUsed = parseInt(localStorage.getItem(STORAGE_KEYS.TOKENS_USED) || '0');
  return {
    used: tokensUsed,
    budget: TOKEN_BUDGET,
    remaining: Math.max(0, TOKEN_BUDGET - tokensUsed),
    percentUsed: Math.min(100, (tokensUsed / TOKEN_BUDGET) * 100),
  };
}

/**
 * Add tokens to usage counter
 * @param {number} tokenCount - Number of tokens consumed by API call
 * @returns {boolean} - True if successful, false if would exceed budget
 */
export function addTokenUsage(tokenCount) {
  if (isAdminUser()) {
    return true; // Unlimited for admin
  }

  const current = parseInt(localStorage.getItem(STORAGE_KEYS.TOKENS_USED) || '0');
  const newTotal = current + tokenCount;
  
  if (newTotal > TOKEN_BUDGET) {
    return false; // Would exceed budget
  }

  localStorage.setItem(STORAGE_KEYS.TOKENS_USED, newTotal.toString());
  return true;
}

/**
 * Check if user has tokens remaining
 * @param {number} estimatedTokens - Estimated tokens for next call (default: 2000)
 * @returns {boolean} - True if user has budget remaining
 */
export function hasTokensRemaining(estimatedTokens = 2000) {
  if (isAdminUser()) {
    return true;
  }

  const current = parseInt(localStorage.getItem(STORAGE_KEYS.TOKENS_USED) || '0');
  return (current + estimatedTokens) <= TOKEN_BUDGET;
}

/**
 * Get time until reset (in hours)
 */
export function getTimeUntilReset() {
  const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET);
  if (!lastReset) return 0;

  const resetTime = parseInt(lastReset) + (24 * 60 * 60 * 1000);
  const now = Date.now();
  const hoursRemaining = Math.max(0, (resetTime - now) / (1000 * 60 * 60));
  
  return Math.ceil(hoursRemaining);
}

