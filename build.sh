#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building UI package..."
cd packages/ui
npm run build
cd ../..

echo "Building web app..."
cd apps/web
npm run build
cd ../..

echo "Build complete!" 