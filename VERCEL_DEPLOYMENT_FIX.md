# Vercel Deployment Branch Fix

## Issue

Vercel deployment is still configured to deploy from the `master` branch instead of `main`.

## Solution

You need to change the Git branch settings in your Vercel project dashboard:

### Step 1: Access Vercel Project Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your Mahardika project
3. Go to **Settings** tab
4. Click on **Git** in the left sidebar

### Step 2: Change Production Branch

1. In the Git settings, find the **Production Branch** section
2. Change the production branch from `master` to `main`
3. Click **Save**

### Step 3: Alternative Method - Through Project Settings

If the above doesn't work, try this:

1. Go to your project settings
2. Look for **Git Repository** settings
3. Find **Production Branch** or **Default Branch**
4. Update it to `main`

### Step 4: Verify Configuration

1. Check that your GitHub repository default branch is set to `main`
2. Ensure your GitHub Actions workflow (`.github/workflows/deploy.yml`) is configured for `main` branch ✅ (Already done)
3. Verify that your next deployment uses the `main` branch

### Step 5: Force New Deployment

After changing the branch setting:

1. Go to the **Deployments** tab in Vercel
2. Click **Deploy** and select the `main` branch
3. Or make a small commit to the `main` branch to trigger a new deployment

## Current Status ✅

- ✅ GitHub workflow is correctly configured for `main` branch
- ✅ Local repository is using `main` branch
- ✅ All code references are correct
- ❌ Vercel project settings need to be updated (manual step required)

## Files Already Configured ✅

- `.github/workflows/deploy.yml` - Deploys on push to `main`
- `.github/workflows/ci.yml` - Runs on PRs to `main`
- Local git configuration uses `main` branch

## Note

This is a Vercel dashboard setting and cannot be changed programmatically. You must log into your Vercel account and manually update the production branch setting.
