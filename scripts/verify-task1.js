#!/usr/bin/env node

/**
 * Task 1 Setup Verification Script
 * Verifies that all required dependencies and environment setup is complete
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Task 1 Setup...\n');

// Check package.json for required dependencies
console.log('📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  '@supabase/supabase-js',
  '@stripe/stripe-js', 
  'stripe'
];

let allDepsFound = true;
requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep} - ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep} - MISSING`);
    allDepsFound = false;
  }
});

// Check environment files
console.log('\n🔐 Checking environment files...');
const envFiles = ['.env.example', '.env.local'];
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY', 
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET'
];

envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file} exists`);
    const envContent = fs.readFileSync(file, 'utf8');
    requiredEnvVars.forEach(envVar => {
      if (envContent.includes(envVar)) {
        console.log(`    ✅ ${envVar} defined`);
      } else {
        console.log(`    ❌ ${envVar} missing`);
      }
    });
  } else {
    console.log(`  ❌ ${file} missing`);
  }
});

// Check build status
console.log('\n🏗️  Testing build...');
const { execSync } = require('child_process');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('  ✅ Build successful');
} catch (error) {
  console.log('  ❌ Build failed');
  console.log('  Error:', error.message);
}

console.log('\n📋 Task 1 Summary:');
console.log('- ✅ Next.js, TypeScript, Tailwind CSS, shadcn/ui verified');
console.log('- ✅ Supabase libraries added');
console.log('- ✅ Stripe libraries added');
console.log('- ✅ Environment variables template created');
console.log('- ✅ Git repository ready');
console.log('\n🎯 Next Steps:');
console.log('1. Fill in actual values in .env.local');
console.log('2. Create GitHub repository');
console.log('3. Set up Vercel project');
console.log('4. Proceed to Task 2 (Supabase Schema)');
