const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ML Workflow Frontend...\n');

// Check if we should use simplified package.json
const useSimple = process.argv.includes('--simple');

if (useSimple) {
  console.log('📦 Using simplified package.json to avoid dependency conflicts...');
  
  // Backup current package.json
  if (fs.existsSync('package.json')) {
    fs.copyFileSync('package.json', 'package-full.json');
    console.log('✅ Backed up current package.json to package-full.json');
  }
  
  // Use simplified package.json
  if (fs.existsSync('package-simple.json')) {
    fs.copyFileSync('package-simple.json', 'package.json');
    console.log('✅ Using simplified package.json');
  }
}

try {
  console.log('🧹 Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  console.log('\n📥 Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('\n✅ Installation complete!');
  console.log('\n🎉 Setup successful! You can now run:');
  console.log('   npm run dev');
  console.log('\n📚 If you encounter issues, check TROUBLESHOOTING.md');
  
} catch (error) {
  console.error('\n❌ Installation failed:', error.message);
  console.log('\n🔧 Try these solutions:');
  console.log('1. Run: npm install --legacy-peer-deps');
  console.log('2. Use simplified package: node setup.js --simple');
  console.log('3. Check TROUBLESHOOTING.md for more help');
  process.exit(1);
}

