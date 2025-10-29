#!/bin/bash

# CodePractice.AI Quick Start Script
# Run this to set up and launch the app

echo "🚀 CodePractice.AI Setup"
echo "========================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo ""
    echo "Please create a .env file with your Gemini API key:"
    echo "1. Get a free API key: https://makersuite.google.com/app/apikey"
    echo "2. Run: echo 'VITE_GEMINI_API_KEY=your_key_here' > .env"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    echo ""
    
    # Try to fix permissions if needed
    if ! npm install 2>/dev/null; then
        echo "⚠️  npm permission error detected"
        echo "Attempting to fix..."
        echo ""
        sudo chown -R $(whoami) ~/.npm
        npm cache clean --force
        npm install
    fi
    
    echo ""
    echo "✅ Dependencies installed!"
    echo ""
fi

echo "🎉 Starting development server..."
echo ""
echo "📱 To test on your phone:"
echo "   1. Find your IP: ifconfig | grep 'inet '"
echo "   2. Run: npm run dev -- --host"
echo "   3. Open http://YOUR_IP:5173 on your phone"
echo ""

npm run dev

