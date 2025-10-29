# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Fix npm permissions (if needed)

```bash
sudo chown -R $(whoami) ~/.npm
```

### Step 2: Install dependencies

```bash
cd /Users/jonas/Tutor/tutor-app
npm install
```

### Step 3: Get a free Gemini API key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Get API Key" or "Create API Key"
3. Copy the key

### Step 4: Create .env file

```bash
echo "VITE_GEMINI_API_KEY=your_key_here" > .env
```

Replace `your_key_here` with your actual API key.

### Step 5: Run the app

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## 📱 Test on Your Phone

### On the same WiFi network:

1. Find your computer's IP address:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Run with host option:
   ```bash
   npm run dev -- --host
   ```

3. Open `http://YOUR_IP:5173` on your phone

## 🐛 Common Issues

### npm EACCES errors
```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Gemini API errors
- Check your API key in `.env`
- Verify you haven't hit rate limits (15/min, 1500/day)
- Check internet connection

## ✅ Verify Installation

After running `npm run dev`, you should see:
- ✅ App opens at localhost:5173
- ✅ Five category cards displayed
- ✅ No console errors (except Pyodide/sql.js loading)

## 📚 Next Steps

1. Select a category
2. Wait for exercises to generate (~10 seconds)
3. Write and test your code!

Need help? Check the full README.md

