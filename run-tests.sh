#!/bin/bash
# Quick test runner script for background color tests

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║           Background Color Test Runner                                    ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if server is running
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✓ Server is already running on port 8080"
    SERVER_RUNNING=true
else
    echo "✗ Server is not running on port 8080"
    SERVER_RUNNING=false
fi

echo ""
echo "Select test to run:"
echo ""
echo "  1) Browser Test (Interactive, Visual)"
echo "  2) Python Test (Automated, CLI)"
echo "  3) Start Web Server"
echo "  4) All of the above"
echo "  5) Exit"
echo ""
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo "Opening browser test..."
        if [ "$SERVER_RUNNING" = false ]; then
            echo ""
            echo "⚠️  Warning: Server not detected on port 8080"
            echo "   The test may not work correctly without a server"
            echo ""
            read -p "Continue anyway? (y/n) " cont
            if [[ ! $cont =~ ^[Yy]$ ]]; then
                echo "Cancelled."
                exit 0
            fi
        fi
        xdg-open "$(dirname "$0")/tests/test-background-color.html"
        echo "✓ Browser test opened"
        ;;
    
    2)
        echo ""
        echo "Running Python test..."
        if [ "$SERVER_RUNNING" = false ]; then
            echo ""
            echo "⚠️  Warning: Server not detected on port 8080"
            echo "   Starting server first..."
            echo ""
            cd "$(dirname "$0")/public"
            python3 -m http.server 8080 > /dev/null 2>&1 &
            SERVER_PID=$!
            sleep 2
            echo "✓ Server started (PID: $SERVER_PID)"
        fi
        
        # Check if selenium is installed
        if ! python3 -c "import selenium" 2>/dev/null; then
            echo ""
            echo "✗ Selenium not installed"
            echo ""
            read -p "Install selenium now? (y/n) " install
            if [[ $install =~ ^[Yy]$ ]]; then
                pip install selenium
            else
                echo "Cancelled. Install with: pip install selenium"
                exit 1
            fi
        fi
        
        cd "$(dirname "$0")"
        python3 tests/test-background-color.py
        
        if [ ! -z "$SERVER_PID" ]; then
            echo ""
            read -p "Stop the web server? (y/n) " stop
            if [[ $stop =~ ^[Yy]$ ]]; then
                kill $SERVER_PID 2>/dev/null
                echo "✓ Server stopped"
            else
                echo "Server still running (PID: $SERVER_PID)"
                echo "To stop: kill $SERVER_PID"
            fi
        fi
        ;;
    
    3)
        echo ""
        if [ "$SERVER_RUNNING" = true ]; then
            echo "Server is already running on port 8080"
        else
            echo "Starting web server..."
            cd "$(dirname "$0")/public"
            echo ""
            echo "Server will start on: http://localhost:8080"
            echo "Press Ctrl+C to stop"
            echo ""
            python3 -m http.server 8080
        fi
        ;;
    
    4)
        echo ""
        echo "Running all tests..."
        echo ""
        
        # Start server if needed
        if [ "$SERVER_RUNNING" = false ]; then
            echo "Starting web server..."
            cd "$(dirname "$0")/public"
            python3 -m http.server 8080 > /dev/null 2>&1 &
            SERVER_PID=$!
            sleep 2
            echo "✓ Server started (PID: $SERVER_PID)"
            cd ..
        fi
        
        # Check selenium
        if ! python3 -c "import selenium" 2>/dev/null; then
            echo ""
            echo "Installing selenium..."
            pip install selenium
        fi
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Running Python Test..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        python3 tests/test-background-color.py
        
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Opening Browser Test..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        xdg-open tests/test-background-color.html
        
        echo ""
        echo "✓ All tests launched!"
        
        if [ ! -z "$SERVER_PID" ]; then
            echo ""
            echo "Server is running (PID: $SERVER_PID)"
            read -p "Press Enter to stop server and exit..."
            kill $SERVER_PID 2>/dev/null
            echo "✓ Server stopped"
        fi
        ;;
    
    5)
        echo ""
        echo "Exiting..."
        exit 0
        ;;
    
    *)
        echo ""
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Done!"
