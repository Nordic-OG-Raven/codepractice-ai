# 🚀 Future Features Roadmap

**Project:** CodePractice.AI  
**Status:** Post-MVP (v1.0 complete)  
**Last Updated:** October 2025

---

## 💰 Phase 2: Monetization (Month 2-3)

### Credit System
**Priority:** High  
**Complexity:** Medium (8-10 days)  
**Description:** Users buy credits to use the platform
- [ ] Stripe integration for payments
- [ ] Credit purchase packages ($5 = 100 sessions, $10 = 250, etc.)
- [ ] Credit balance display in UI
- [ ] Credit deduction per session
- [ ] Low balance notifications
- [ ] Purchase history page

**Considerations:**
- Credit pricing: ~$0.05/session (2X markup on API costs)
- Stripe fees: $0.30 + 2.9% per transaction
- Minimum purchase: $5 to make fees worthwhile

---

## 🔐 Phase 2: User Authentication & Cloud Sync

### User Log-in System
**Priority:** High  
**Complexity:** Medium (6-8 days)  
**Description:** User accounts with cross-device sync
- [ ] Supabase Auth integration
- [ ] Email/password login
- [ ] Google OAuth (optional)
- [ ] User profile page
- [ ] Account settings

### Cloud Sync
**Priority:** High  
**Complexity:** Medium (4-6 days)  
**Description:** Sync data across devices
- [ ] Sync notes to cloud (Supabase PostgreSQL)
- [ ] Sync session history
- [ ] Sync user progress/levels
- [ ] Conflict resolution (if edited on multiple devices)
- [ ] Offline-first with sync when online

**Tech Stack:**
- Supabase (free tier: 500 MB, 50k users)
- PostgreSQL for data storage
- Real-time sync capabilities

---

## 🎮 Phase 3: Gamification

### Gamification Features
**Priority:** Medium  
**Complexity:** Medium (5-7 days)  
**Description:** Make learning more engaging and rewarding

- [ ] **XP Points System**
  - Points per correct answer (10 XP)
  - Bonus for first-try correct (5 XP)
  - Bonus for completing full session (20 XP)
  
- [ ] **Streaks**
  - Daily streak counter
  - Streak freeze tokens (1 free per week)
  - Longest streak record
  
- [ ] **Achievements/Badges**
  - "First Steps" - Complete first session
  - "Streak Master" - 7 day streak
  - "Speed Demon" - Complete exercise in <2 minutes
  - "Persistent" - Use hints 3 times and still solve
  - "Perfectionist" - 10 sessions with 100% score
  - Category-specific badges
  
- [ ] **Leaderboards**
  - Weekly leaderboard (by XP)
  - All-time leaderboard
  - Friends leaderboard (if connected)
  - Category-specific rankings
  
- [ ] **Profile Showcase**
  - Display badges
  - Show stats (total sessions, accuracy, etc.)
  - Shareable profile link

**Considerations:**
- Should leaderboards be global or opt-in?
- Privacy settings for public profiles
- Balance competition vs collaboration

---

## 📚 Phase 3: Curriculum System

### Curriculum Builder
**Priority:** Medium  
**Complexity:** High (8-12 days)  
**Description:** Structured learning paths

**Decision Point:** Pre-designed vs Custom-built?

#### Option A: Pre-Designed Curriculums (Easier)
**Pros:** Curated, high-quality, less user effort  
**Cons:** Less flexible, requires content creation

- [ ] **Beginner Data Analyst Path** (30 exercises)
  - Week 1: SQL Basics
  - Week 2: Python Basics
  - Week 3: Data Cleaning
  - Week 4: Basic Visualization
  
- [ ] **SQL Mastery Path** (50 exercises)
  - SELECT statements
  - JOINs and subqueries
  - Window functions
  - Query optimization
  
- [ ] **Python for Data Science Path** (40 exercises)
  - Python fundamentals
  - Pandas mastery
  - NumPy operations
  - Data manipulation

**Implementation:**
- [ ] Curriculum data structure in DB
- [ ] Progress tracking per curriculum
- [ ] "Start Curriculum" flow
- [ ] Certificate on completion

#### Option B: Custom Curriculum Builder (More flexible)
**Pros:** User control, personalized learning  
**Cons:** More complex, requires good UX

- [ ] Create curriculum UI
- [ ] Select exercises from library
- [ ] Set order and difficulty progression
- [ ] Save and share curriculums
- [ ] Community curriculums (user-generated)

**Recommendation:** Start with **Option A** (pre-designed), add **Option B** later if users request it.

---

## 🤖 Phase 4: AI Code Review

### Intelligent Code Review
**Priority:** Medium  
**Complexity:** Medium (4-6 days)  
**Description:** AI analyzes your code and provides feedback beyond correctness

**Features:**
- [ ] **Code Quality Feedback**
  - Readability suggestions
  - Pythonic/idiomatic code recommendations
  - SQL query optimization tips
  
- [ ] **Performance Analysis**
  - Time complexity warnings
  - Memory usage concerns
  - Better algorithm suggestions
  
- [ ] **Best Practices**
  - Error handling suggestions
  - Code structure improvements
  - Naming convention tips
  
- [ ] **Learning Moments**
  - "Did you know?" educational tips
  - Alternative approaches
  - Links to documentation

**Example Implementation:**
```javascript
// After correct answer, run additional LLM call:
const review = await getCodeReview(
  userAnswer, 
  correctSolution, 
  language
)

// Returns:
{
  quality_score: 8/10,
  feedback: [
    { type: "improvement", message: "Consider using list comprehension" },
    { type: "praise", message: "Great error handling!" },
    { type: "tip", message: "This could be optimized with..." }
  ]
}
```

**Considerations:**
- Extra API call per exercise (2X cost)
- Optional feature (toggle on/off)
- Show after correct answer to avoid overwhelm

---

## 🌟 Phase 5: Additional Features

### Nice-to-Have Features
**Priority:** Low  
**Complexity:** Varies

- [ ] **Dark Mode** (Easy, 2-3 hours)
- [ ] **Offline Mode** (Medium, cache exercises)
- [ ] **Exercise Bookmarking** (Easy, save favorites)
- [ ] **Spaced Repetition** (Medium, show old exercises at intervals)
- [ ] **Difficulty Adjustment** (Easy, manual difficulty selector)
- [ ] **Exercise Generator** (Medium, user creates custom exercises)
- [ ] **Social Features** (High, share progress, challenge friends)
- [ ] **Mobile Native App** (High, Capacitor or React Native)
- [ ] **More Languages** (Medium, R, JavaScript, Java, etc.)
- [ ] **Voice Input** (High, dictate code)
- [ ] **Code Execution Sandbox** (High, run more complex code)
- [ ] **Video Tutorials** (Medium, integrate with YouTube)
- [ ] **Community Forum** (High, requires moderation)

---

## 📊 Implementation Priority Order

### Immediate (Month 2):
1. User Authentication + Cloud Sync
2. Credit System + Stripe

### Short-term (Month 3-4):
3. Pre-designed Curriculums (3-4 paths)
4. Basic Gamification (XP, Streaks, Badges)

### Mid-term (Month 5-6):
5. AI Code Review
6. Leaderboards
7. Dark Mode

### Long-term (Month 7+):
8. Custom Curriculum Builder
9. Mobile Native App
10. Advanced gamification features

---

## 💡 Questions to Answer Before Building

### Monetization:
- [ ] Free tier limits? (5 sessions/day, 10 hints/month?)
- [ ] Credit pricing strategy?
- [ ] Refund policy?

### Gamification:
- [ ] Should leaderboards be competitive or collaborative?
- [ ] What's the XP to level conversion?
- [ ] How many badges total?

### Curriculums:
- [ ] Who creates the pre-designed curriculums? (You? Community? AI?)
- [ ] Certification format?
- [ ] Integration with LinkedIn/resumes?

### Code Review:
- [ ] Always on or optional?
- [ ] Show for incorrect answers too?
- [ ] How much detail?

---

## 🎯 Success Metrics (Track These First)

Before building features, validate these metrics:

**Current (Free MVP):**
- Daily Active Users (DAU)
- Sessions per user per week
- 7-day retention rate
- Average session duration
- Notes usage %
- History review %

**After Paid Launch:**
- Conversion rate (free → paid)
- Monthly Recurring Revenue (MRR)
- Churn rate
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

---

## 📝 Notes

- All features should maintain mobile-first design
- Keep API costs under $0.001/session for sustainability
- User data privacy is critical - be transparent
- Regular backups of user data
- GDPR compliance if serving EU users

---

**Next Step:** Validate product-market fit with 20-50 beta users before building Phase 2+

