#!/bin/bash

echo "🔥 Testing Concurrent Request Handling"
echo "======================================"

echo "Making 50 concurrent requests to test monitoring..."
echo "Watch your backend console for request tracking logs"
echo ""

# Make 50 concurrent requests
for i in {1..50}; do
  curl -s http://localhost:3000/api/health > /dev/null &
done

# Wait for all background jobs to complete
wait

echo ""
echo "✅ 50 concurrent requests sent!"
echo ""
echo "Check statistics at: http://localhost:3000/api/monitoring/stats"
curl -s http://localhost:3000/api/monitoring/stats | jq .
