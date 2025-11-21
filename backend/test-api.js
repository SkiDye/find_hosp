// Test script to call the hospital API

import http from 'http';

const testCases = [
  { name: 'Region only (경기)', query: 'region=경기' },
  { name: 'Region + City (경기 이천시)', query: 'region=경기&city=이천시' },
  { name: 'City only (이천시)', query: 'city=이천시' }
];

function testAPI(query, name) {
  return new Promise((resolve) => {
    const url = `/api/hospitals?${encodeURI(query)}`;
    console.log(`\n🔍 Testing: ${name}`);
    console.log(`   URL: http://localhost:5000${url}`);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: url,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const hospitals = JSON.parse(data);
          console.log(`   ✅ Received: ${hospitals.length} hospitals`);
          if (hospitals.length > 0 && hospitals.length <= 5) {
            hospitals.forEach(h => {
              console.log(`      - ${h.name} (${h.region} ${h.city})`);
            });
          } else if (hospitals.length > 5) {
            hospitals.slice(0, 3).forEach(h => {
              console.log(`      - ${h.name} (${h.region} ${h.city})`);
            });
            console.log(`      ... and ${hospitals.length - 3} more`);
          }
          resolve();
        } catch (error) {
          console.log('   ❌ Error parsing response:', error.message);
          resolve();
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ❌ Request failed: ${error.message}`);
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Hospital API with city filters\n');
  console.log('=' .repeat(60));

  for (const testCase of testCases) {
    await testAPI(testCase.query, testCase.name);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Tests complete!\n');
}

runTests();
