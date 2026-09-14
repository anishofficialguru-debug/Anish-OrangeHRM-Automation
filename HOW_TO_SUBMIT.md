# How to Submit This Assignment

## 1. Create a GitHub Account (if you don't have one)
Go to https://github.com/join and create a free account.

## 2. Create a New Repository
1. Click **New repository**
2. Name it: `TEST_AT-OrangeHRM-Automation` (or similar)
3. Set visibility to **Public** (or Private + share access with the recruiter)
4. Do **NOT** initialize with README (we already have one)
5. Click **Create repository**

## 3. Push this project
```bash
cd /path/to/this/folder
git init
git add .
git commit -m "TEST_AT: Complete Senior QA Automation Framework for OrangeHRM"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/TEST_AT-OrangeHRM-Automation.git
git push -u origin main
```

## 4. Verify CI
- Go to the **Actions** tab in your repository
- The workflow should run automatically
- After it finishes, download the HTML report artifacts if needed

## 5. Share the link
Send the repository URL to the interviewer.

---
Optional local verification before pushing:
```bash
npm install
npx playwright install chromium
npm test
npm run report
```
