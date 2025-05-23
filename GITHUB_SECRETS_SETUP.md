# GitHub Secrets Setup Guide

## 🔑 Your Supabase Credentials

You have provided these credentials:

- **Access Token**: `sbp_233f02d89fb924888cd567a2e0011f3bca6f2b57`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bndueWh4ZXBqeWx2eGZ4c3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODU3NzksImV4cCI6MjA2MzU2MTc3OX0.wmwBPQG9h0cZU3kVZQF1c1QCvso72Ycwce3jy-eXIGA`
- **Project URL**: `https://fvnwnyhxepjylvxfxspe.supabase.co`
- **Project Ref**: `fvnwnyhxepjylvxfxspe`

## 📋 Step-by-Step Instructions

### Step 1: Go to Your GitHub Repository

1. Open your browser and go to: `https://github.com/amirulirfn1/Mahardika`
2. Make sure you're logged into GitHub

### Step 2: Access Repository Settings

1. Click on the **"Settings"** tab (it's at the top of your repository page)
2. In the left sidebar, look for **"Secrets and variables"**
3. Click on **"Secrets and variables"** → then click **"Actions"**

### Step 3: Add Each Secret

You need to add 4 secrets. For each one:

1. Click the **"New repository secret"** button
2. Enter the **Name** exactly as shown below
3. Copy and paste the **Value** exactly as provided
4. Click **"Add secret"**

#### Secret #1: SUPABASE_PROJECT_REF

- **Name**: `SUPABASE_PROJECT_REF`
- **Value**: `fvnwnyhxepjylvxfxspe`

#### Secret #2: SUPABASE_ACCESS_TOKEN

- **Name**: `SUPABASE_ACCESS_TOKEN`
- **Value**: `sbp_233f02d89fb924888cd567a2e0011f3bca6f2b57`

#### Secret #3: NEXT_PUBLIC_SUPABASE_URL

- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://fvnwnyhxepjylvxfxspe.supabase.co`

#### Secret #4: NEXT_PUBLIC_SUPABASE_ANON_KEY

- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bndueWh4ZXBqeWx2eGZ4c3BlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5ODU3NzksImV4cCI6MjA2MzU2MTc3OX0.wmwBPQG9h0cZU3kVZQF1c1QCvso72Ycwce3jy-eXIGA`

## ✅ Verification

After adding all 4 secrets, you should see them listed in your repository secrets page. The values will be hidden for security.

## 🚀 Test the Setup

Once you've added all secrets:

1. Make a small change to any file (or just push an empty commit)
2. Push to the `main` branch
3. Go to the **"Actions"** tab in your GitHub repository
4. Watch the workflow run - it should now pass all steps!

## 🎯 Expected Results

After adding these secrets, your GitHub Actions should:

- ✅ **CI / lint-test-typecheck** - Pass
- ✅ **Deploy / migrate-db** - Pass (Supabase commands will work)
- ✅ **Deploy / vercel-deploy** - Pass (build with proper env vars)

## 🔒 Security Note

These secrets are now safely stored in GitHub and will only be accessible to your GitHub Actions workflows. They won't be visible in logs or to other users.
