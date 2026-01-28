#!/usr/bin/env node

/**
 * E2E test: build tarball, install in temp dir, verify import works
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT_DIR = path.join(__dirname, '..');

function run(cmd, cwd = ROOT_DIR) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd, stdio: 'inherit' });
}

function runCapture(cmd, cwd = ROOT_DIR) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { cwd, encoding: 'utf-8' }).trim();
}

async function main() {
  console.log('=== E2E Test ===\n');

  // 1. Build the package
  console.log('1. Building package...');
  run('npm run build');

  // 2. Create tarball
  console.log('\n2. Creating tarball...');
  const tarball = runCapture('npm pack');
  const tarballPath = path.join(ROOT_DIR, tarball);
  console.log(`   Created: ${tarball}`);

  // 3. Create temp directory
  console.log('\n3. Creating temp directory...');
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-sum-inn-e2e-'));
  console.log(`   Temp dir: ${tempDir}`);

  try {
    // 4. Initialize temp project
    console.log('\n4. Initializing temp project...');
    run('npm init -y', tempDir);

    // 5. Install the tarball
    console.log('\n5. Installing tarball...');
    run(`npm install ${tarballPath}`, tempDir);

    // 6. Create test script
    console.log('\n6. Creating test script...');
    const testScript = `
const { sum } = require('@ypankratovich/ts-sum-inn');

console.log('Testing sum function...');

const tests = [
  { a: 2, b: 3, expected: 5 },
  { a: -1, b: 1, expected: 0 },
  { a: 0, b: 0, expected: 0 },
  { a: 100, b: 200, expected: 300 },
];

let passed = 0;
let failed = 0;

for (const { a, b, expected } of tests) {
  const result = sum(a, b);
  if (result === expected) {
    console.log(\`  ✓ sum(\${a}, \${b}) = \${result}\`);
    passed++;
  } else {
    console.log(\`  ✗ sum(\${a}, \${b}) = \${result} (expected \${expected})\`);
    failed++;
  }
}

console.log(\`\\nResults: \${passed} passed, \${failed} failed\`);

if (failed > 0) {
  process.exit(1);
}

console.log('\\n✅ E2E test passed!');
`;
    fs.writeFileSync(path.join(tempDir, 'test.js'), testScript);

    // 7. Run test
    console.log('\n7. Running test...');
    run('node test.js', tempDir);

    console.log('\n=== E2E Test Complete ===');
  } finally {
    // Cleanup
    console.log('\nCleaning up...');
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.rmSync(tarballPath, { force: true });
  }
}

main().catch((err) => {
  console.error('E2E test failed:', err.message);
  process.exit(1);
});
