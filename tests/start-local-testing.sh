#!/bin/bash

# Quick Start Script for Local Testing with Mock API
# Starts both mock API server and web application

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🚀 STARTING LOCAL TEST ENVIRONMENT                     ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ Python version: $(python3 --version)"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $API_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    echo "✅ Cleanup complete"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Mock API Server
echo "📡 Starting Mock API Server..."
node mock-api-server.js &
API_PID=$!

# Wait for API to start
sleep 2

# Check if API is running
if ! kill -0 $API_PID 2>/dev/null; then
    echo "❌ Failed to start Mock API Server"
    exit 1
fi

echo "✅ Mock API Server running (PID: $API_PID)"
echo "   URL: http://localhost:3001/api"
echo ""

# Start Web Server
echo "🌐 Starting Web Application..."
cd src
python3 -m http.server 8080 &
WEB_PID=$!
cd ..

# Wait for web server to start
sleep 2

# Check if web server is running
if ! kill -0 $WEB_PID 2>/dev/null; then
    echo "❌ Failed to start Web Server"
    kill $API_PID 2>/dev/null
    exit 1
fi

echo "✅ Web Server running (PID: $WEB_PID)"
echo "   URL: http://localhost:8080"
echo ""

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                    🎉 READY FOR TESTING!                         ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Test URLs:"
echo "   Application:  http://localhost:8080/"
echo "   API Health:   http://localhost:3001/api/health"
echo "   API Search:   http://localhost:3001/api/vagas/search?hotel=-1&checkin=2025-12-09&checkout=2025-12-11"
echo ""
echo "🧪 Quick Test:"
echo "   curl http://localhost:3001/api/health"
echo ""
echo "🌐 Open in browser:"
echo "   http://localhost:8080/"
echo ""
echo "📚 Documentation:"
echo "   LOCAL_TESTING_GUIDE.md"
echo ""
echo "Press Ctrl+C to stop all servers"
echo "══════════════════════════════════════════════════════════════════"
echo ""

# Keep script running
wait
