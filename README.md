# CodePractice.AI

A mobile-first web app for practicing Python and SQL with AI-powered feedback and real code execution.

## Features

- 🎯 **5 Practice Categories** - Data Engineering, Analytics Engineering, Data Analysis, Data Science, or Custom Topics
- 🤖 **AI-Powered** - Exercise generation and hints using Gemini 1.5 Flash
- ▶️ **Real Code Execution** - Run Python (via Pyodide) and SQL (via sql.js) directly in the browser
- 📱 **Mobile-First** - Optimized for mobile browsers with touch-friendly UI
- 📊 **Progress Tracking** - Level system with localStorage persistence
- 💡 **Intelligent Help** - Get hints without spoiling the solution

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS
- **Code Execution**: Pyodide (Python), sql.js (SQLite)
- **LLM**: Google Gemini 1.5 Flash
- **Storage**: Browser localStorage

## Prerequisites

- Node.js 18+ and npm
- A Gemini API key (free tier available)

## Setup Instructions

### 1. Fix npm Cache Permissions (if needed)

If you encounter npm permission errors, run:

```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Dependencies

```bash
cd tutor-app
npm install
```

### 3. Configure API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Get your free API key**: https://makersuite.google.com/app/apikey

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Test on Mobile

To test on your phone:

1. Find your local IP: `ifconfig | grep inet` (on Mac/Linux)
2. Run dev server: `npm run dev -- --host`
3. Open `http://YOUR_IP:5173` on your phone

## Building for Production

```bash
npm run build
npm run preview
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository on [Vercel](https://vercel.com)
3. Add `VITE_GEMINI_API_KEY` as an environment variable
4. Deploy!

### Netlify

1. Push code to GitHub
2. Import repository on [Netlify](https://netlify.com)
3. Add `VITE_GEMINI_API_KEY` as an environment variable
4. Deploy!

## Usage

1. **Select Category** - Choose from 5 data-focused categories
2. **Practice** - Work through 10 AI-generated exercises
3. **Get Help** - Stuck? Request hints without seeing the solution
4. **Track Progress** - Level up as you master each category
5. **Level Up** - Unlock harder challenges when ready

## Project Structure

```
tutor-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context for state management
│   ├── hooks/           # Custom hooks for code execution
│   ├── pages/           # Main app pages (Home, Practice, Results)
│   ├── services/        # API and storage services
│   ├── utils/           # Helper functions and sample data
│   └── App.jsx          # Main app component
├── public/              # Static assets
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## API Rate Limits

**Gemini 1.5 Flash (Free Tier)**:
- 15 requests per minute
- 1,500 requests per day
- Should be sufficient for individual use

## Performance Notes

- **First Load**: Pyodide takes ~8-10 seconds to initialize (one-time)
- **SQL**: Instant execution in browser
- **Python**: ~1-2 seconds per execution
- **Exercise Generation**: ~5-15 seconds

## Troubleshooting

### "Gemini API not configured"
Make sure you've created a `.env` file with `VITE_GEMINI_API_KEY`

### Python/SQL not working
Check browser console for errors. Pyodide and sql.js load from CDN.

### npm permission errors
Run: `sudo chown -R $(whoami) ~/.npm`

### Exercises not loading
Check API key and network connection. Gemini API requires internet.

## Future Enhancements

- User accounts and cloud sync (Supabase)
- Offline mode with cached exercises
- More programming languages (R, JavaScript)
- Gamification (XP, streaks, leaderboards)
- Native mobile app via Capacitor

## License

MIT

## Author

Jonas


