# Complete Setup Guide for NNN Tracker

This guide will walk you through setting up the NNN Tracker app with Supabase authentication and leaderboard functionality.

## Prerequisites

- Node.js and npm installed
- A Supabase account

## Step 1: Install Dependencies

```bash
cd /home/indoorotaku/Documents/projects/nnnTracker
npm install
```

## Step 2: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in/sign up
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `nnn-tracker` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to you
4. Click **"Create new project"**
5. Wait 1-2 minutes for the project to initialize

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, click the **Settings** (⚙️) icon in the sidebar
2. Go to **"API"** section
3. You'll see:
   - **Project URL** - Copy this value
   - **anon public** key - Copy this value

## Step 4: Configure Environment Variables

1. In the project root, copy the template:
   ```bash
   cp env.template .env
   ```

2. Open `.env` and replace the placeholder values with your actual credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

## Step 5: Set Up the Database

1. In your Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Open `DATABASE_SCHEMA.sql` from this project
4. Copy **ALL** of its contents
5. Paste into the SQL Editor in Supabase
6. Click **"Run"** or press `Ctrl/Cmd + Enter`
7. You should see: **"Success. No rows returned"**

This creates:
- `user_profiles` table for usernames
- `tracker_data` table for daily tracking
- Row Level Security policies
- Indexes for performance
- Triggers for auto-updating timestamps

## Step 6: Configure Authentication (Optional Settings)

### For Development (Recommended)

To make testing easier, disable email confirmation:

1. Go to **"Authentication"** > **"Providers"** in Supabase
2. Find **"Email"** and click to expand
3. Toggle **OFF** the "Confirm email" option
4. Click **"Save"**

It is suggested to re-enable this in production environments.

## Step 7: Start the Development Server

```bash
npm run dev
```

The app should now be running at `http://localhost:5173`

## Troubleshooting

### "Failed to fetch" or Connection Errors

**Problem:** Can't connect to Supabase

**Solutions:**
- Check that `.env` file exists and has correct values
- Ensure no extra spaces or quotes around values
- Restart the dev server after changing `.env`
- Check that your Supabase project is active

### "Row Level Security policy violation"

**Problem:** Can't read/write data

**Solutions:**
- Ensure you ran the complete `DATABASE_SCHEMA.sql` script
- Check policies in Supabase: Authentication > Policies
- Verify both tables have policies enabled
- Try re-running the schema script

### "Username is already taken"

**Problem:** Duplicate username during signup

**Solution:**
- Choose a different username
- Usernames must be unique across all users

### Email Not Receiving Verification

**Problem:** Not getting verification emails (if enabled)

**Solutions:**
- Check your spam folder
- For development, disable email confirmation (see Step 6)
- Check Supabase logs: Logs > Auth Logs

### Leaderboard Not Showing Data

**Problem:** Leaderboard is empty or not loading

**Solutions:**
- Create at least one user account with some tracked data
- Check browser console for errors
- Verify the `user_profiles` and `tracker_data` tables exist in Supabase
- Check that RLS policies allow reading data

## Database Verification

To verify your database setup in Supabase:

1. Go to **"Database"** > **"Tables"** in Supabase
2. You should see:
   - `user_profiles`
   - `tracker_data`
3. Click on each table to verify columns
4. Go to **"Authentication"** > **"Policies"**
5. Verify policies exist for both tables

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` |


## Production Deployment

When deploying to production, here are some things to be mindful about:
- Toggling on email confirmation in supabase is suggested
- Rate limiting should be enabled in supabase settings to prevent spamming
- Ensure that RLS and security policies are tightened as needed

## Need Help?

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **React Docs**: [https://react.dev](https://react.dev)
- **Vite Docs**: [https://vitejs.dev](https://vitejs.dev)


