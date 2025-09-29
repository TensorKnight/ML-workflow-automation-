# Troubleshooting Guide

## Common Installation Issues

### 1. Dependency Conflicts (ERESOLVE errors)

**Problem**: `ERESOLVE unable to resolve dependency tree`

**Solution**: Use the legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```

Or use the provided installation script:
```bash
# Windows
install-deps.bat

# Linux/Mac
chmod +x install-deps.sh
./install-deps.sh
```

### 2. React Version Conflicts

**Problem**: Some packages require older React versions

**Solution**: Use the simplified package.json:
```bash
# Backup current package.json
mv package.json package-full.json

# Use simplified version
mv package-simple.json package.json

# Install dependencies
npm install
```

### 3. Node Version Issues

**Problem**: Incompatible Node.js version

**Solution**: Use Node.js 18+ (recommended: 18.17.0 or 20.15.0)

### 4. Cache Issues

**Problem**: Stale npm cache causing issues

**Solution**: Clear cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 5. TypeScript Errors

**Problem**: TypeScript compilation errors

**Solution**: 
1. Check if all imports are correct
2. Ensure all dependencies are installed
3. Run type checking:
```bash
npx tsc --noEmit
```

### 6. Vite Build Issues

**Problem**: Vite build fails

**Solution**:
1. Clear Vite cache:
```bash
rm -rf node_modules/.vite
```

2. Rebuild:
```bash
npm run build
```

## Alternative Installation Methods

### Method 1: Yarn (if npm fails)
```bash
yarn install
```

### Method 2: pnpm (if npm fails)
```bash
pnpm install
```

### Method 3: Manual dependency installation
```bash
# Install core dependencies first
npm install react react-dom react-router-dom

# Install Material-UI
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled

# Install other dependencies one by one
npm install axios react-dropzone react-query recharts framer-motion
```

## Development Server Issues

### 1. Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- --port 3001
```

### 2. Hot reload not working
```bash
# Restart dev server
npm run dev
```

## Production Build Issues

### 1. Build fails
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Build with verbose output
npm run build -- --debug
```

### 2. Large bundle size
```bash
# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
npx vite-bundle-analyzer
```

## Getting Help

1. Check the console for specific error messages
2. Ensure all dependencies are compatible
3. Try the simplified package.json if issues persist
4. Use `--legacy-peer-deps` flag for npm install
5. Clear all caches and reinstall

## Quick Fix Commands

```bash
# Complete reset
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps

# Start development server
npm run dev
```

