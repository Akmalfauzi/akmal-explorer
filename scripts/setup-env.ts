#!/usr/bin/env bun

import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const envFiles = [
  {
    source: 'apps/backend/.env.example',
    target: 'apps/backend/.env',
    name: 'Backend'
  },
  {
    source: 'apps/frontend/.env.example',
    target: 'apps/frontend/.env',
    name: 'Frontend'
  }
];

console.log('🔧 Setting up environment files...\n');

let successCount = 0;
let skippedCount = 0;

for (const { source, target, name } of envFiles) {
  const sourcePath = join(process.cwd(), source);
  const targetPath = join(process.cwd(), target);

  if (!existsSync(sourcePath)) {
    console.log(`❌ ${name}: Source file not found (${source})`);
    continue;
  }

  if (existsSync(targetPath)) {
    console.log(`⏭️  ${name}: .env file already exists, skipping`);
    skippedCount++;
    continue;
  }

  try {
    copyFileSync(sourcePath, targetPath);
    console.log(`✅ ${name}: Created .env from .env.example`);
    successCount++;
  } catch (error) {
    console.log(`❌ ${name}: Failed to create .env file`);
    console.error(error);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Created: ${successCount}`);
console.log(`   Skipped: ${skippedCount}`);
console.log(`   Total: ${envFiles.length}`);

if (successCount > 0) {
  console.log('\n⚠️  Don\'t forget to update the .env files with your actual configuration!');
}
