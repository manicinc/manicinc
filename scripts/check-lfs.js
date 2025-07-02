#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Git LFS status...\n');

try {
  // Check if git lfs is installed
  execSync('git lfs version', { stdio: 'pipe' });
  console.log('✅ Git LFS is installed');
} catch (error) {
  console.error('❌ Git LFS is not installed or not available');
  process.exit(1);
}

try {
  // Check LFS status
  const lfsStatus = execSync('git lfs status', { encoding: 'utf8' });
  console.log('📊 LFS Status:');
  console.log(lfsStatus);
} catch (error) {
  console.warn('⚠️  Could not get LFS status:', error.message);
}

try {
  // List LFS files
  const lfsFiles = execSync('git lfs ls-files', { encoding: 'utf8' });
  const fileCount = lfsFiles.trim().split('\n').filter(line => line.trim()).length;
  console.log(`📁 Found ${fileCount} LFS files`);
  
  if (fileCount === 0) {
    console.log('ℹ️  No LFS files found. This might be normal if no large files are tracked.');
  }
} catch (error) {
  console.warn('⚠️  Could not list LFS files:', error.message);
}

// Check for common missing image files
const imagesToCheck = [
  'public/assets/blog/thinkpieces/logomaker-an-experiment/input-noise-locked-behind-paywalls.png',
  'public/assets/blog/thinkpieces/logomaker-an-experiment/this-is-aider.png',
  'public/assets/blog/thinkpieces/logomaker-an-experiment/her-movie-screenshot-warner-bros.png'
];

console.log('\n🖼️  Checking for required images...');
let missingFiles = [];

imagesToCheck.forEach(imagePath => {
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    const fileType = execSync(`file "${imagePath}"`, { encoding: 'utf8' }).trim();
    
    if (stats.size < 200 && fileType.includes('ASCII text')) {
      console.log(`⚠️  ${imagePath} appears to be an LFS pointer file (${stats.size} bytes)`);
      missingFiles.push(imagePath);
    } else {
      console.log(`✅ ${imagePath} exists (${stats.size} bytes)`);
    }
  } else {
    console.log(`❌ ${imagePath} is missing`);
    missingFiles.push(imagePath);
  }
});

if (missingFiles.length > 0) {
  console.log('\n🔧 Attempting to pull LFS files...');
  try {
    execSync('git lfs pull', { stdio: 'inherit' });
    console.log('✅ LFS pull completed');
    
    // Re-check missing files
    console.log('\n🔍 Re-checking missing files...');
    missingFiles.forEach(imagePath => {
      if (fs.existsSync(imagePath)) {
        const stats = fs.statSync(imagePath);
        const fileType = execSync(`file "${imagePath}"`, { encoding: 'utf8' }).trim();
        
        if (stats.size < 200 && fileType.includes('ASCII text')) {
          console.log(`⚠️  ${imagePath} is still an LFS pointer file`);
        } else {
          console.log(`✅ ${imagePath} is now available (${stats.size} bytes)`);
        }
      } else {
        console.log(`❌ ${imagePath} is still missing`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to pull LFS files:', error.message);
  }
}

console.log('\n📋 Summary:');
console.log('- Ensure all required images are committed to the repository');
console.log('- Run "git lfs track" for new image files before committing');
console.log('- Use "npm run lfs:pull" to download LFS files');
console.log('- Use "npm run lfs:status" to check LFS status'); 