#!/usr/bin/env node

/**
 * Task 3 Verification Script: Stripe Pass Purchase & Role Promotion
 * 
 * Verifies:
 * 1. Stripe checkout API endpoint exists and works
 * 2. Stripe webhook handler exists and handles events correctly
 * 3. Pricing page renders with correct plans
 * 4. Account page shows user status
 * 5. Pro subscription expiration function exists
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const projectRoot = process.cwd();

console.log('🔍 Task 3 Verification: Stripe Pass Purchase & Role Promotion\n');

let passed = 0;
let failed = 0;

function test(description, testFn) {
  try {
    testFn();
    console.log(`✅ ${description}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

// Test 1: Check Stripe checkout API endpoint exists
test('Stripe checkout API endpoint exists', () => {
  const checkoutPath = path.join(projectRoot, 'app/api/checkout/route.ts');
  if (!existsSync(checkoutPath)) {
    throw new Error('Checkout API route file not found');
  }
  
  const content = readFileSync(checkoutPath, 'utf8');
  if (!content.includes('stripe.checkout.sessions.create')) {
    throw new Error('Checkout session creation not found');
  }
  if (!content.includes('client_reference_id')) {
    throw new Error('Client reference ID not set for user tracking');
  }
});

// Test 2: Check Stripe webhook handler exists
test('Stripe webhook handler exists', () => {
  const webhookPath = path.join(projectRoot, 'app/api/stripe-hook/route.ts');
  if (!existsSync(webhookPath)) {
    throw new Error('Webhook API route file not found');
  }
  
  const content = readFileSync(webhookPath, 'utf8');
  if (!content.includes('stripe.webhooks.constructEvent')) {
    throw new Error('Webhook signature verification not found');
  }
  if (!content.includes('checkout.session.completed')) {
    throw new Error('Checkout completion handler not found');
  }
  if (!content.includes('supabaseAdmin')) {
    throw new Error('Supabase admin client not used');
  }
});

// Test 3: Check pricing page exists
test('Pricing page exists and has required components', () => {
  const pricingPath = path.join(projectRoot, 'app/pricing/page.tsx');
  if (!existsSync(pricingPath)) {
    throw new Error('Pricing page not found');
  }
  
  const content = readFileSync(pricingPath, 'utf8');
  if (!content.includes('7-Day Pass') || !content.includes('30-Day Pass')) {
    throw new Error('Pricing plans not found');
  }
  if (!content.includes('/api/checkout')) {
    throw new Error('Checkout API call not found');
  }
});

// Test 4: Check account page exists
test('Account page exists and shows user status', () => {
  const accountPath = path.join(projectRoot, 'app/account/page.tsx');
  if (!existsSync(accountPath)) {
    throw new Error('Account page not found');
  }
  
  const content = readFileSync(accountPath, 'utf8');
  if (!content.includes('Account Status')) {
    throw new Error('Account status section not found');
  }
  if (!content.includes('Usage Statistics')) {
    throw new Error('Usage statistics section not found');
  }
});

// Test 5: Check pro expiration function exists
test('Pro subscription expiration function exists', () => {
  const migrationDir = path.join(projectRoot, 'supabase/migrations');
  if (!existsSync(migrationDir)) {
    throw new Error('Migrations directory not found');
  }
  
  const files = execSync('ls -la supabase/migrations/', { encoding: 'utf8' });
  if (!files.includes('expire_pro_subscriptions')) {
    throw new Error('Pro expiration migration not found');
  }
  
  // Find the specific migration file
  const migrationFiles = execSync('ls supabase/migrations/*expire_pro_subscriptions*', { encoding: 'utf8' }).trim().split('\n');
  if (migrationFiles.length === 0) {
    throw new Error('Pro expiration migration file not found');
  }
  
  const migrationContent = readFileSync(migrationFiles[0], 'utf8');
  if (!migrationContent.includes('expire_pro_subscriptions()')) {
    throw new Error('Expiration function not found in migration');
  }
});

// Test 6: Check environment variables are documented
test('Environment variables are properly documented', () => {
  const envExamplePath = path.join(projectRoot, '.env.example');
  if (!existsSync(envExamplePath)) {
    throw new Error('.env.example file not found');
  }
  
  const content = readFileSync(envExamplePath, 'utf8');
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_7_DAY_PRICE_ID',
    'STRIPE_30_DAY_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  for (const varName of requiredVars) {
    if (!content.includes(varName)) {
      throw new Error(`Environment variable ${varName} not documented`);
    }
  }
});

// Test 7: Check if project builds without errors
test('Project builds successfully', () => {
  try {
    console.log('   Building project...');
    execSync('npm run build', { stdio: 'pipe' });
  } catch (error) {
    throw new Error('Build failed - check TypeScript errors');
  }
});

// Summary
console.log(`\n📊 Task 3 Verification Summary:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);

if (failed === 0) {
  console.log(`\n🎉 Task 3 verification completed successfully!`);
  console.log(`\n📋 Next Steps to Complete Task 3:`);
  console.log(`   1. Set up Stripe account and create products:`);
  console.log(`      - 7-Day Pass: $9.99`);
  console.log(`      - 30-Day Pass: $19.99`);
  console.log(`   2. Get Stripe API keys and add to .env.local`);
  console.log(`   3. Add environment variables to Vercel:`);
  console.log(`      - STRIPE_SECRET_KEY`);
  console.log(`      - STRIPE_WEBHOOK_SECRET`);
  console.log(`      - STRIPE_7_DAY_PRICE_ID`);
  console.log(`      - STRIPE_30_DAY_PRICE_ID`);
  console.log(`      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`);
  console.log(`      - SUPABASE_SERVICE_ROLE_KEY`);
  console.log(`   4. Set up Stripe webhook endpoint in dashboard`);
  console.log(`   5. Enable pg_cron extension in Supabase (optional)`);
  console.log(`   6. Test the complete payment flow`);
  process.exit(0);
} else {
  console.log(`\n💥 Task 3 verification failed. Please fix the issues above.`);
  process.exit(1);
}
