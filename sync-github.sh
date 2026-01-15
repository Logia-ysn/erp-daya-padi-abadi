#!/bin/bash

# GitHub Sync Script for ERP Daya Padi Abadi
# This script automates the git workflow

# Predefined values
GIT_USERNAME="Logia-ysn"
GIT_EMAIL="yayang.nugroho.s@gmail.com"
REPO_URL="https://github.com/Logia-ysn/erp-daya-padi-abadi"

echo "🚀 ERP Daya Padi Abadi - GitHub Sync"
echo "===================================="
echo ""

# Check if git is configured
if ! git config user.name > /dev/null 2>&1; then
    echo "⚙️  Configuring Git user..."
    git config --global user.name "$GIT_USERNAME"
    git config --global user.email "$GIT_EMAIL"
    echo "✅ Git user configured: $GIT_USERNAME <$GIT_EMAIL>"
    echo ""
fi

# Check git status
echo "📊 Checking git status..."
git status
echo ""

# Ask for commit message
read -p "Enter commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="sync: update changes $(date +'%Y-%m-%d %H:%M')"
fi

# Add all changes
echo "📝 Adding changes..."
git add .

# Commit
echo "💾 Committing changes..."
git commit -m "$commit_msg"

# Check if remote exists
if ! git remote | grep -q origin; then
    echo ""
    echo "⚙️  Adding remote repository..."
    git remote add origin "$REPO_URL"
    echo "✅ Remote added: $REPO_URL"
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully synced with GitHub!"
    echo "🎉 All changes are now on GitHub"
else
    echo ""
    echo "❌ Failed to push to GitHub"
    echo "Please check your credentials and try again"
    echo ""
    echo "Tips:"
    echo "1. Make sure you're using Personal Access Token (not password)"
    echo "2. Check your internet connection"
    echo "3. Verify repository URL with: git remote -v"
fi

echo ""
echo "Done! 🚀"
