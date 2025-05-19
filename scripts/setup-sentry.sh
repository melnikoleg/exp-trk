#!/bin/bash

# Sentry setup script
# This script helps configure Sentry for your environment

# Colors for console output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Sentry Setup for Expense Tracker${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if .env file exists
if [ -f .env ]; then
  echo -e "${YELLOW}Found existing .env file.${NC}"
else
  echo -e "${YELLOW}Creating .env file...${NC}"
  cp .env.example .env
fi

# Prompt for Sentry DSN
echo -e "${GREEN}Please enter your Sentry DSN (or press enter to skip for now):${NC}"
read SENTRY_DSN

if [ ! -z "$SENTRY_DSN" ]; then
  # Update the .env file with the provided DSN
  if grep -q "VITE_SENTRY_DSN=" .env; then
    # Replace existing DSN
    sed -i '' "s|VITE_SENTRY_DSN=.*|VITE_SENTRY_DSN=$SENTRY_DSN|g" .env
  else
    # Add DSN if not present
    echo "VITE_SENTRY_DSN=$SENTRY_DSN" >> .env
  fi
  echo -e "${GREEN}Sentry DSN updated in .env file.${NC}"
fi

# Prompt for app version
echo -e "${GREEN}Please enter the app version (default: 1.0.0):${NC}"
read APP_VERSION
APP_VERSION=${APP_VERSION:-"1.0.0"}

# Update app version in .env
if grep -q "VITE_APP_VERSION=" .env; then
  sed -i '' "s|VITE_APP_VERSION=.*|VITE_APP_VERSION=$APP_VERSION|g" .env
else
  echo "VITE_APP_VERSION=$APP_VERSION" >> .env
fi

echo -e "${GREEN}App version set to $APP_VERSION in .env file.${NC}"

# Ask if they want to set up source maps
echo -e "${GREEN}Do you want to set up Sentry source maps? (y/n)${NC}"
read SETUP_SOURCEMAPS

if [ "$SETUP_SOURCEMAPS" = "y" ] || [ "$SETUP_SOURCEMAPS" = "Y" ]; then
  echo -e "${YELLOW}Running Sentry source maps wizard...${NC}"
  npx @sentry/wizard -i sourcemaps
else
  echo -e "${YELLOW}Skipping source maps setup.${NC}"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Sentry setup completed!${NC}"
echo -e "${BLUE}========================================${NC}"

# Final message
echo -e "${YELLOW}To verify the integration, start the development server:${NC}"
echo -e "${BLUE}npm run dev${NC}"
echo -e "${YELLOW}then go to the Profile page to access the Sentry test component.${NC}"
