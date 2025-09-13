#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

function fixAssetPaths(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix asset paths for GitHub Pages subdirectory
  content = content
    .replace(/href="\/_expo\//g, 'href="/qr-io/_expo/')
    .replace(/src="\/_expo\//g, 'src="/qr-io/_expo/')
    .replace(/href="\/favicon\.ico"/g, 'href="/qr-io/favicon.ico"')
    .replace(/url\(\/_expo\//g, 'url(/qr-io/_expo/');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed asset paths in: ${filePath}`);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.html')) {
      fixAssetPaths(filePath);
    }
  }
}

console.log('Fixing asset paths for GitHub Pages deployment...');
processDirectory(distDir);
console.log('Asset path fixing complete!');
