// Test script to debug city filtering issue

const testFilters = {
  region: "경기",
  city: "이천시"
};

const hospitals = [
  { id: 22, name: "경기도의료원 이천병원", region: "경기", city: "이천시" },
  { id: 23, name: "경기도의료원 수원병원", region: "경기", city: "수원시" },
  { id: 28, name: "이천 바른병원", region: "경기", city: "이천시" },
  { id: 16, name: "아주대학교병원", region: "경기", city: "수원시" }
];

console.log('🔍 Testing filter logic...\n');
console.log('Input filters:', testFilters);
console.log('\n📋 Test hospitals:', hospitals.length, 'hospitals\n');

// Simulate the filtering logic from Hospital.js
let filtered = [...hospitals];

console.log('Step 1: Apply region filter...');
if (testFilters.region) {
  filtered = filtered.filter(h => h.region === testFilters.region);
  console.log(`  After region filter: ${filtered.length} hospitals`);
  console.log(`  Region filter value: "${testFilters.region}"`);
}

console.log('\nStep 2: Apply city filter...');
if (testFilters.city) {
  console.log(`  City filter value: "${testFilters.city}"`);
  console.log(`  City filter type: ${typeof testFilters.city}`);
  console.log(`  City filter truthy: ${!!testFilters.city}`);

  console.log('\n  Checking each hospital:');
  filtered.forEach(h => {
    const matches = h.city === testFilters.city;
    console.log(`    ${h.name}`);
    console.log(`      h.city = "${h.city}" (type: ${typeof h.city})`);
    console.log(`      testFilters.city = "${testFilters.city}" (type: ${typeof testFilters.city})`);
    console.log(`      Match: ${matches}`);
  });

  filtered = filtered.filter(h => h.city === testFilters.city);
  console.log(`\n  After city filter: ${filtered.length} hospitals`);
}

console.log('\n✅ Final result:', filtered.length, 'hospitals');
console.log(filtered.map(h => h.name));
