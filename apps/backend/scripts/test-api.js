const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

async function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${endpoint}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function testEndpoints() {
  console.log('🧪 Testing API Endpoints\n');

  try {
    console.log('1️⃣ Health Check:');
    const health = await makeRequest('/health');
    console.log(JSON.stringify(health, null, 2));

    console.log('\n2️⃣ Database Connections:');
    const connections = await makeRequest('/health/connections');
    console.log(JSON.stringify(connections, null, 2));

    console.log('\n3️⃣ Request Statistics:');
    const stats = await makeRequest('/monitoring/stats');
    console.log(JSON.stringify(stats, null, 2));

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testEndpoints();
