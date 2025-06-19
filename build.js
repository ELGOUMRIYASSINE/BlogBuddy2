#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

console.log('Building for production...');

// Create dist directory if it doesn't exist
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

// Build the client (React app)
console.log('Building client...');
execSync('vite build', { stdio: 'inherit' });

// Build the server
console.log('Building server...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server', { stdio: 'inherit' });

console.log('Build completed successfully!');