# 🧾 Product Requirements Document (PRD)

**Product Name:** CodePractice.AI (placeholder)  
**Version:** 1.0 MVP  
**Owner:** Jonas  
**Created:** October 2025  
**Last Updated:** October 2025

---

## 🎯 1. Product Vision

A **mobile-first**, intelligent web app that helps users practice Python and SQL through data-focused exercises, with instant AI feedback and adaptive difficulty.

### Core Principles
- **Mobile-first** — Optimized for phone browsers (desktop support comes later)
- **Intelligent** — LLM-powered exercise generation and personalized feedback
- **Accessible** — Free tier LLM (Gemini 1.5 Flash), no account required for MVP
- **Practical** — Real code execution with immediate validation
- **Scalable** — Architecture supports future expansion to more languages and features

---

## 👥 2. Target Users

| User Segment | Characteristics | Use Case |
|-------------|-----------------|----------|
| **Data Learners** | Students, bootcamp participants, career changers | Structured practice to build foundational skills |
| **Working Professionals** | Data analysts, engineers, scientists | Quick skill sharpening during commute or breaks |
| **Casual Coders** | Hobbyists, lifelong learners | Daily challenges on the go |

### Primary Use Context
- **Mobile browser** (Chrome, Safari on iOS/Android)
- **Short sessions** (5-15 minutes)
- **On-the-go learning** (commute, lunch break, waiting room)

---

## 🧩 3. Core Features (MVP)

### 3.1. Category Selection
**User Flow:**
1. User opens app on mobile
2. Presented with 5 category cards (large touch targets)
3. User taps one category to begin

**Categories:**
- 🔧 **Data Engineering** — Data pipelines, ETL, storage (Python + SQL)
- 🛠️ **Analytics Engineering** — Data transformation, cleaning, dbt-style workflows
- 📊 **Data Analysis** — Exploratory analysis, pandas, visualization concepts
- 🤖 **Data Science** — ML fundamentals, model evaluation, feature engineering
- 🎯 **Other** — User enters custom topic for LLM

**Technical Notes:**
- Each category has predefined prompt templates
- "Other" category allows freeform text input with character limit (100 chars)

---

### 3.2. Exercise Generation

**LLM Integration:**
- **Primary:** Gemini 1.5 Flash (free tier, 15 requests/minute)
- **Fallback:** Architecture supports easy swap to GPT-4o-mini

**Prompt Structure:**
```
You are an expert coding instructor specializing in data skills.
Generate 10 practice exercises for [CATEGORY] at [LEVEL] difficulty.

Requirements:
- Mix of Python and SQL exercises (60% Python, 40% SQL)
- Exercises should be completable in 2-5 minutes each
- Include practical, real-world scenarios
- Provide expected solution code

Return JSON array with this structure:
[
  {
    "id": "uuid",
    "question": "Exercise description...",
    "solution": "correct code...",
    "language": "python" or "sql",
    "difficulty": "beginner|intermediate|advanced"
  }
]
```

**Response Handling:**
- Exercises stored in React state + localStorage
- If API fails, show cached exercises or error message
- Loading indicator during generation (5-15 seconds)

---

### 3.3. Exercise Interface (Mobile-Optimized)

**Layout:**
```
┌─────────────────────┐
│  Progress: 3/10 ⭐  │
│  Level: 1           │
├─────────────────────┤
│  Question Text      │
│  (scrollable)       │
├─────────────────────┤
│  ┌───────────────┐  │
│  │ Code Input    │  │
│  │ (textarea)    │  │
│  │               │  │
│  └───────────────┘  │
├─────────────────────┤
│ [💡 Help] [✓ Check]│
└─────────────────────┘
```

**Features:**
- Syntax-highlighted code input (CodeMirror mobile mode or simple textarea)
- Large, thumb-friendly buttons
- Auto-save draft to localStorage
- Swipe gesture to navigate exercises (optional enhancement)

---

### 3.4. Code Execution & Validation

#### SQL Exercises
**Technology:** sql.js (SQLite in WebAssembly)

**Sample Datasets:**
- Pre-loaded tables: `customers`, `orders`, `products`, `employees`
- ~50-100 rows per table
- Realistic e-commerce/business data

**Validation Flow:**
1. User submits SQL query
2. Execute in sql.js sandbox
3. Compare results to expected output:
   - Column names match
   - Row count matches
   - Data values match (allowing for ordering differences)
4. Show ✅ or ❌ with diff if incorrect

#### Python Exercises
**Technology:** Pyodide (Python 3.11 in WebAssembly)

**Supported Libraries:**
- pandas, numpy (pre-loaded)
- matplotlib (output as text description for MVP)

**Validation Flow:**
1. User submits Python code
2. Execute in Pyodide sandbox with timeout (10 seconds)
3. Capture `stdout` and return value
4. Compare to expected output:
   - String comparison for print statements
   - Value equality for return values
5. Show ✅ or ❌ with error messages

**Performance Note:**
- Pyodide initial load: ~8-10 seconds (show loading spinner)
- Cache Pyodide runtime in browser for subsequent visits

---

### 3.5. Help Function

**User Trigger:**
- User taps "💡 Help" button after failed attempt

**LLM Prompt:**
```
The user is stuck on this exercise. Provide a helpful hint without giving away the full solution.

Exercise: [question]
User's attempt: [user_code]
Correct solution: [hidden from user]

Give 1-2 sentence hint that guides them toward the right approach.
Be encouraging and specific.
```

**UI:**
- Hint appears in a modal or slide-up panel
- User can request multiple hints (each costs an API call)
- Option to "Show Solution" after 2 hints (increments skip counter)

---

### 3.6. Level System

**Progression:**
- **Level 1 (Beginner):** Foundational concepts, single-step problems
- **Level 2 (Intermediate):** Multi-step problems, combining concepts
- **Level 3 (Advanced):** Complex scenarios, optimization, edge cases

**Advancement:**
- Complete 8/10 exercises correctly → "Level Up?" prompt
- User can decline and practice more at current level
- Level stored in localStorage (per category)

**Future:** XP points, streaks, badges (post-MVP)

---

## ⚙️ 4. Technical Architecture

### 4.1. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18 + Vite | Fast dev experience, Cursor-optimized |
| **Styling** | TailwindCSS | Mobile-first utilities, rapid prototyping |
| **State Management** | React Context + Hooks | Simple for MVP, no Redux needed yet |
| **Code Execution** | sql.js + Pyodide | Client-side, no backend needed |
| **LLM API** | Gemini 1.5 Flash | Free tier, 15 RPM |
| **Storage** | localStorage | Persists level, progress, drafts |
| **Hosting** | Vercel | Free, auto-deploy from GitHub |
| **Future Mobile** | Capacitor | Wrap as native app later |

### 4.2. Project Structure

```
tutor-app/
├── public/
│   ├── datasets/           # SQL sample data (CSV → loaded into sql.js)
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── CategorySelector.jsx    # 5 category cards
│   │   ├── ExerciseCard.jsx        # Question + code input
│   │   ├── CodeEditor.jsx          # Mobile-optimized input
│   │   ├── HelpModal.jsx           # Hint display
│   │   ├── LevelBadge.jsx          # Progress indicator
│   │   └── LoadingSpinner.jsx      # API/Pyodide loading
│   ├── contexts/
│   │   ├── ExerciseContext.jsx     # Exercise state
│   │   └── UserContext.jsx         # Level, progress
│   ├── hooks/
│   │   ├── useExercises.js         # Fetch & manage exercises
│   │   ├── useSQLExecutor.js       # sql.js wrapper
│   │   └── usePythonExecutor.js    # Pyodide wrapper
│   ├── services/
│   │   ├── geminiAPI.js            # LLM integration
│   │   ├── storage.js              # localStorage utils
│   │   └── prompts.js              # Prompt templates
│   ├── utils/
│   │   ├── codeValidator.js        # Compare outputs
│   │   └── sampleData.js           # SQL dataset loader
│   ├── pages/
│   │   ├── Home.jsx                # Category selection
│   │   ├── Practice.jsx            # Exercise interface
│   │   └── Results.jsx             # Session summary
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                   # Tailwind imports
├── .env.example                    # API keys template
├── package.json
├── vite.config.js
└── README.md
```

### 4.3. Mobile-First Design Principles

- **Touch Targets:** Minimum 44×44px (Apple HIG standard)
- **Font Sizes:** Base 16px (no tiny text)
- **Viewport:** `width=device-width, initial-scale=1, maximum-scale=1`
- **Gestures:** Swipe to navigate (optional), pull-to-refresh disabled
- **Performance:** Code-split Pyodide, lazy-load components
- **Offline Indicators:** Show when API unavailable

---

## 💸 5. Cost Analysis

| Resource | Free Tier | Expected Monthly Cost (500 users) |
|----------|-----------|-----------------------------------|
| Gemini 1.5 Flash | 15 req/min, 1500/day | **$0** (stays within free tier) |
| Vercel Hosting | 100 GB bandwidth | **$0** |
| Domain (optional) | N/A | $12/year |
| **Total MVP Cost** | | **~$0/month** |

**Scaling Costs:**
- At 5,000+ users, may hit Gemini rate limits → switch to GPT-4o-mini (~$20-50/month)
- Add Supabase free tier (500 MB) for user accounts → still $0

---

## ⏱️ 6. Development Timeline

| Week | Deliverable | Hours | Milestones |
|------|-------------|-------|------------|
| **Week 1** | Project setup + Category UI | 6h | User can select category, see loading state |
| **Week 2** | Exercise generation + display | 8h | Exercises load from Gemini, show question |
| **Week 3** | Code execution (sql.js + Pyodide) | 10h | User can run code, see results |
| **Week 4** | Validation + Help system | 8h | Answer checking works, hints from LLM |
| **Week 5** | Level system + polish | 6h | Progress saves, UI refined for mobile |
| **Week 6** | Testing + deployment | 4h | Deployed to Vercel, tested on real devices |
| **Total** | **Functional MVP** | **42h** | Ready for beta users |

---

## 🎯 7. Success Metrics (MVP)

### Must-Have (Launch Criteria)
- [ ] User completes full 10-exercise session on mobile
- [ ] Code execution works for Python and SQL
- [ ] Help function provides useful hints
- [ ] Progress persists across sessions (localStorage)
- [ ] App loads in <5 seconds on 4G mobile

### Nice-to-Have (Post-MVP)
- [ ] 80% of exercises are solvable without hints
- [ ] Average session time: 10-15 minutes
- [ ] Users level up within 2-3 sessions
- [ ] <3% API error rate

---

## 🚀 8. Future Roadmap (Post-MVP)

### Phase 2 (Months 2-3)
- [ ] User accounts (Supabase Auth)
- [ ] Cross-device sync
- [ ] Daily challenge notifications
- [ ] Leaderboards (optional, gamification)

### Phase 3 (Months 4-6)
- [ ] Native mobile app (Capacitor → Android APK)
- [ ] Offline mode (cached exercises)
- [ ] More languages (R, JavaScript, Java)
- [ ] Collaborative exercises

### Phase 4 (6+ months)
- [ ] User-generated content (community exercises)
- [ ] Subscription tier (unlimited hints, advanced analytics)
- [ ] Integration with LeetCode/HackerRank style problems

---

## 📋 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Pyodide load time too slow | Medium | High | Show engaging loading animation, cache runtime |
| Gemini API rate limits | Low | Medium | Implement exponential backoff, cache exercises |
| Code validation inaccuracies | High | Medium | Allow manual review, improve prompts iteratively |
| Mobile browser compatibility | Low | High | Test on iOS Safari, Chrome, Samsung Internet |
| User frustration with hard exercises | Medium | Medium | Tune difficulty via LLM prompts, allow skip |

---

## 📝 10. Open Questions

1. **Branding:** Final app name? (CodePractice.AI is placeholder)
2. **Monetization:** Free forever, or add premium tier later?
3. **Social Features:** Should users see friends' progress?
4. **Content Moderation:** How to handle LLM generating inappropriate exercises?
5. **Analytics:** Track user behavior? (Privacy-first approach needed)

---

## ✅ 11. Definition of Done (MVP)

The MVP is complete when:
1. All 5 categories generate exercises successfully
2. Python and SQL code execute and validate correctly
3. Help system provides useful hints
4. Level system tracks progress across sessions
5. App works smoothly on Jonas's Pixel browser
6. Deployed to public URL with README for setup
7. Jonas completes 3 full practice sessions without critical bugs

---

## 📞 12. Stakeholders

- **Product Owner:** Jonas
- **Developer:** AI Assistant (Cursor)
- **Beta Testers:** Jonas + 5-10 friends/colleagues (Week 6)

---

**End of PRD**

*Next Steps: Begin implementation with Week 1 deliverables (project setup + category UI).*

