#!/bin/bash

echo "🚀 Starting Load Test for Task Manager Backend"
echo "=============================================="

# Check if Artillery is installed
if ! command -v artillery &> /dev/null
then
    echo "❌ Artillery is not installed. Installing..."
    npm install -g artillery
fi

echo "📊 Running load test..."
echo "This will test your backend with increasing load over 4 minutes"
echo ""
echo "Test phases:"
echo "  - 1 minute: 10 requests/second (warm up)"
echo "  - 2 minutes: 50 requests/second (ramp up)"
echo "  - 1 minute: 100 requests/second (sustained load)"
echo ""

# Run the load test
artillery run artillery-load-test.yml

echo ""
echo "✅ Load test completed!"
echo ""
echo "💡 To monitor requests in real-time, check your backend console logs"
echo "💡 For detailed stats, visit: http://localhost:3000/api/monitoring/stats"
