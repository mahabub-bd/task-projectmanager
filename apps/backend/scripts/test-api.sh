#!/bin/bash

echo "🧪 Testing API Endpoints"
echo "========================"

echo ""
echo "1️⃣ Testing Health Endpoint..."
curl -s http://localhost:3000/api/health | jq .

echo ""
echo "2️⃣ Testing Database Connections..."
curl -s http://localhost:3000/api/health/connections | jq .

echo ""
echo "3️⃣ Testing Request Statistics..."
curl -s http://localhost:3000/api/monitoring/stats | jq .

echo ""
echo "✅ API Tests Completed!"
