import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

import { savePlatformMasterKeyFile, getPlatformMasterKey } from '../lib/platform-auth.js';

const args = process.argv.slice(2);
const command = args[0] || '--help';

function generateKey() {
  const randomHex = crypto.randomBytes(24).toString('hex');
  const newKey = `gkp_master_${randomHex}`;

  let savedToEnv = false;
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    if (envContent.includes('PLATFORM_MASTER_KEY=')) {
      envContent = envContent.replace(
        /PLATFORM_MASTER_KEY=.*/,
        `PLATFORM_MASTER_KEY="${newKey}"`
      );
    } else {
      envContent += `\n# Platform Master Authority Key for SuperAdmin Tenant Provisioning\nPLATFORM_MASTER_KEY="${newKey}"\n`;
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');
    savedToEnv = true;
  } catch (err: any) {
    // If .env is read-only in sandbox, save to data/.platform_key fallback
    savePlatformMasterKeyFile(newKey);
  }

  savePlatformMasterKeyFile(newKey);

  console.log('\n=============================================================');
  console.log('  🛡️  GOAN KI PATHSHALA - PLATFORM MASTER KEY GENERATED');
  console.log('=============================================================');
  console.log(`\nNew Platform Master Key:`);
  console.log(`\x1b[32m\x1b[1m  ${newKey}\x1b[0m\n`);
  if (savedToEnv) {
    console.log(`✓ Automatically saved to: ${envPath}`);
  } else {
    console.log(`✓ Saved to: backend/data/.platform_key`);
    console.log(`  Add to your .env: PLATFORM_MASTER_KEY="${newKey}"`);
  }
  console.log('✓ All SuperAdmin APIs will now require this key.');
  console.log('✓ Store this key securely. Do NOT share it publicly.\n');
  console.log('To run security verification against your API:');
  console.log('  npm run key:check\n');
  console.log('=============================================================\n');
}

async function runSecurityAudit() {
  const port = process.env.PORT || 4000;
  const baseUrl = `http://localhost:${port}`;
  const currentKey = getPlatformMasterKey();

  console.log('\n=============================================================');
  console.log('  🔒 PLATFORM API SECURITY & AUTHORIZATION AUDIT');
  console.log(`  Target: ${baseUrl}`);
  console.log('=============================================================\n');

  const tests = [
    {
      name: '1. Register Tenant without Key (POST /api/tenants)',
      url: `${baseUrl}/api/tenants`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker School', slug: 'hacker-slug' }),
      expectedStatus: 401,
    },
    {
      name: '2. Suspend Tenant without Key (PATCH /api/tenants/:id/status)',
      url: `${baseUrl}/api/tenants/00000000-0000-0000-0000-000000000000/status`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'SUSPENDED' }),
      expectedStatus: 401,
    },
    {
      name: '3. Delete Tenant without Key (DELETE /api/tenants/:id)',
      url: `${baseUrl}/api/tenants/00000000-0000-0000-0000-000000000000`,
      method: 'DELETE',
      headers: {},
      body: null,
      expectedStatus: 401,
    },
    {
      name: '4. Update Website CMS without Key (PUT /api/platform/config)',
      url: `${baseUrl}/api/platform/config`,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroTitle: 'Defaced Title' }),
      expectedStatus: 401,
    },
    {
      name: '5. Verify Key with Fake/Incorrect Token (POST /api/platform/verify-key)',
      url: `${baseUrl}/api/platform/verify-key`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'fake_password_123' }),
      expectedStatus: 403,
    },
    {
      name: '6. Verify Key with Valid Master Key (POST /api/platform/verify-key)',
      url: `${baseUrl}/api/platform/verify-key`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: currentKey }),
      expectedStatus: 200,
    },
    {
      name: '7. Update Website CMS with Valid Master Key (PUT /api/platform/config)',
      url: `${baseUrl}/api/platform/config`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-platform-key': currentKey,
      },
      body: JSON.stringify({}),
      expectedStatus: 200,
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const res = await fetch(test.url, {
        method: test.method,
        headers: test.headers,
        body: test.body,
      });

      if (res.status === test.expectedStatus) {
        console.log(`  \x1b[32m✔ PASS\x1b[0m [HTTP ${res.status}] ${test.name}`);
        passed++;
      } else {
        console.log(
          `  \x1b[31m✖ FAIL\x1b[0m [HTTP ${res.status} (expected ${test.expectedStatus})] ${test.name}`
        );
        failed++;
      }
    } catch (err: any) {
      console.log(`  \x1b[33m⚠ SKIPPED / OFFLINE\x1b[0m ${test.name} (${err.message})`);
      failed++;
    }
  }

  console.log('\n-------------------------------------------------------------');
  console.log(`Audit Summary: ${passed} Passed, ${failed} Failed`);
  if (failed === 0) {
    console.log('\x1b[32m\x1b[1mAll Platform SuperAdmin endpoints are strictly secured and protected.\x1b[0m');
  } else {
    console.log('\x1b[33mEnsure your backend server is running on port 4000 to complete the audit.\x1b[0m');
  }
  console.log('=============================================================\n');
}

if (command === '--generate' || command === 'generate') {
  generateKey();
} else if (command === '--test' || command === '--audit' || command === 'check') {
  runSecurityAudit();
} else {
  console.log(`
Usage:
  npx tsx src/scripts/manage-platform-key.ts [command]

Commands:
  --generate   Generate a new cryptographically secure Platform Master Key and save to .env
  --test       Run live authorization tests against all SuperAdmin API endpoints
  `);
}
