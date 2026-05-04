#!/usr/bin/env bash
# Halo Design System — first-time and subsequent deploy helper.
#
# Usage:
#   ./deploy.sh                                 # commit + push current changes
#   ./deploy.sh "your commit message"           # custom commit message
#
# First time only — before running this:
#   1. Create empty repo at https://github.com/new
#      Owner: yonipixellot   Name: halo-design-system-storybook   (no README/gitignore/license)
#   2. After first push, on GitHub:
#      Settings → Pages → Source: GitHub Actions
#
# Live URL after first deploy: https://yonipixellot.github.io/halo-design-system-storybook/

set -euo pipefail

cd "$(dirname "$0")"

REPO_URL_SSH="git@github.com:yonipixellot/halo-design-system-storybook.git"
REPO_URL_HTTPS="https://github.com/yonipixellot/halo-design-system-storybook.git"

# 1. Initialize git if this is the first run
if [ ! -d .git ]; then
  echo "→ First-run: initializing git repo"
  git init
  git branch -M main
  echo "→ Adding remote (SSH). If you use HTTPS, edit deploy.sh REPO_URL_SSH var."
  git remote add origin "$REPO_URL_SSH"
fi

# 2. Stage everything tracked by .gitignore rules
echo "→ Staging changes"
git add -A

# 3. Commit (only if there are staged changes)
if git diff --cached --quiet; then
  echo "→ Nothing to commit"
else
  MSG="${1:-update halo-design-system-storybook}"
  echo "→ Committing: $MSG"
  git commit -m "$MSG"
fi

# 4. Push
echo "→ Pushing to origin/main"
git push -u origin main

echo ""
echo "✓ Pushed. GH Actions is now building Storybook."
echo "  Watch the run:    https://github.com/yonipixellot/halo-design-system-storybook/actions"
echo "  Live URL:         https://yonipixellot.github.io/halo-design-system-storybook/"
echo ""
echo "  First deploy can take 3-5 minutes. Make sure GH Pages is set to"
echo "  'GitHub Actions' under repo Settings → Pages → Source."
