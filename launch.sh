#!/bin/bash

# Florida Project Tracker Launch Script
# This script starts both the backend and frontend servers

echo "🚀 Starting Florida Project Tracker..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if node_modules exist in backend
if [ ! -d "code/backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd code/backend
    npm install
    cd "$SCRIPT_DIR"
    echo "✅ Backend dependencies installed"
    echo ""
fi

# Check if node_modules exist in frontend
if [ ! -d "code/frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd code/frontend
    npm install
    cd "$SCRIPT_DIR"
    echo "✅ Frontend dependencies installed"
    echo ""
fi

# Function to cleanup background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Start backend server in background
echo "🔧 Starting backend server on port 3001..."
cd code/backend
npm start &
BACKEND_PID=$!
cd "$SCRIPT_DIR"

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend is ready!"
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start. Check the error messages above."
        cleanup
    fi
done

echo ""

# Start frontend server in background
echo "🎨 Starting frontend server on port 3000..."
cd code/frontend
BROWSER=none npm start &
FRONTEND_PID=$!
cd "$SCRIPT_DIR"

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to start (this may take 30-60 seconds)..."
for i in {1..90}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is ready!"
        break
    fi
    sleep 1
    if [ $i -eq 90 ]; then
        echo "❌ Frontend failed to start. Check the error messages above."
        cleanup
    fi
done

echo ""
echo "✨ Florida Project Tracker is running!"
echo ""
echo "📊 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Open browser after a short delay
sleep 2
if command -v open &> /dev/null; then
    echo "🌐 Opening browser..."
    open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
fi

# Wait for background processes
wait
