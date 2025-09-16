#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding missing images referenced in markdown files...\n');

// Function to find all markdown files
function findMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Function to extract image references from markdown
function extractImageReferences(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;
  
  while ((match = imageRegex.exec(content)) !== null) {
    const alt = match[1];
    const src = match[2];
    
    // Skip external URLs
    if (!src.startsWith('http') && !src.startsWith('//')) {
      images.push({
        alt,
        src: src.startsWith('/') ? src.substring(1) : src,
        fullSrc: src
      });
    }
  }
  
  return images;
}

// Find all markdown files
const markdownFiles = findMarkdownFiles('posts');
console.log(`📝 Found ${markdownFiles.length} markdown files`);

const allImages = [];
const missingImages = [];

// Process each markdown file
for (const filePath of markdownFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const images = extractImageReferences(content);
  
  if (images.length > 0) {
    console.log(`\n📄 ${path.relative(process.cwd(), filePath)}:`);
    
    for (const image of images) {
      allImages.push({ ...image, sourceFile: filePath });
      
      // Check if image exists
      const imagePath = path.join('public', image.src);
      const exists = fs.existsSync(imagePath);
      
      if (exists) {
        const stats = fs.statSync(imagePath);
        let status = '✅';
        
        // Check if it's an LFS pointer file
        if (stats.size < 200) {
          try {
            const fileType = execSync(`file "${imagePath}"`, { encoding: 'utf8' });
            if (fileType.includes('ASCII text')) {
              status = '⚠️  (LFS pointer)';
            }
          } catch (e) {
            // file command not available, just check size
            status = stats.size < 200 ? '⚠️  (very small)' : '✅';
          }
        }
        
        console.log(`  ${status} ${image.src} (${stats.size} bytes)`);
      } else {
        console.log(`  ❌ ${image.src} - MISSING`);
        missingImages.push({ ...image, sourceFile: filePath });
      }
    }
  }
}

// Summary
console.log(`\n📊 Summary:`);
console.log(`- Total images referenced: ${allImages.length}`);
console.log(`- Missing images: ${missingImages.length}`);

if (missingImages.length > 0) {
  console.log('\n❌ Missing Images:');
  missingImages.forEach(img => {
    console.log(`  • ${img.src}`);
    console.log(`    Referenced in: ${path.relative(process.cwd(), img.sourceFile)}`);
    console.log(`    Alt text: "${img.alt}"`);
  });
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Add the missing image files to the repository');
  console.log('2. Use "git lfs track" for large image files');
  console.log('3. Commit and push the files');
  console.log('4. Run "git lfs pull" to download LFS files');
  
  // Create placeholder script
  console.log('\n📝 To create placeholder images, run:');
  missingImages.forEach(img => {
    const dir = path.dirname(path.join('public', img.src));
    const filename = path.basename(img.src);
    console.log(`mkdir -p "${dir}" && echo "Placeholder for ${img.alt}" > "${path.join('public', img.src)}"`);
  });
} 