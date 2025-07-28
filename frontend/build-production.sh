#!/bin/bash

# Frontend Production Build Script
# This script builds the frontend for production deployment

set -e

echo "🏗️  Building frontend for production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Clean previous build
print_status "Cleaning previous build..."
rm -rf dist
rm -rf ../backend/public/build

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Build for production
print_status "Building for production..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    print_status "✅ Build completed successfully!"
    print_status "📁 Build output: dist/"
    print_status "📊 Build size:"
    du -sh dist/
else
    print_error "❌ Build failed!"
    exit 1
fi

print_status "🎉 Frontend build completed!" 