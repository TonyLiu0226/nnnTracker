# No-Nut November Tracker

A modern, interactive React application to track your No-Nut November progress throughout the month with user authentication and competitive leaderboards.

## Features

- 📅 **30 Day Calendar**: Visual representation of all 30 days of November
- 🟢 **Automatic Success Tracking**: Days automatically turn green when no log is recorded
- 📊 **Real-time Statistics**: Track goon count, current streak, and days remaining
- 🏆 **Leaderboard**: View and compete with all other users



## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

**Important:** You need to set up Supabase to use authentication!

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Quick steps:
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from project settings
3. Create a `.env` file with your credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run the SQL schema in Supabase SQL Editor:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `DATABASE_SCHEMA.sql`
   - Run the entire script to create tables and policies

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## How to Use

1. **Sign Up**: Create an account with email, username, and password
   - Username must be 3-20 characters
   - Can only contain letters, numbers, and underscores
   - Username must be unique
2. **Sign In**: Log in with your email and password
3. **View Progress**: The calendar displays all 30 days of November
4. **Toggle Status**: Click any day tile to toggle between success (green) and failed (red)
5. **Track Stats**: View your goon count, current streak, and days remaining
6. **View Leaderboard**: Click the 🏆 Leaderboard button to see how you rank against others
   - See everyone's stats, streaks, and success rates
   - Your entry is highlighted on the leaderboard
   - Top 3 users get special badges (🥇🥈🥉)
7. **Data Sync**: Your progress is automatically saved to the cloud
8. **Sign Out**: Click the sign out button to log out

## Color Coding

- 🟢 **Green**: Success - No log recorded for this day
- 🔴 **Red**: Failed - Log recorded for this day
- ⚪ **White**: Future days that haven't occurred yet
- 🔵 **Blue Border**: Current day of the month

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Supabase**: Backend-as-a-Service for authentication and database
- **PostgreSQL**: Via Supabase for data storage
- **CSS3**: Custom styling with gradients and animations

## Database Structure

### user_profiles
Stores user information:
- `user_id`: References auth.users
- `username`: Unique username (3-20 chars)
- `created_at`, `updated_at`: Timestamps

### tracker_data
Stores daily tracking information:
- `user_id`: References auth.users
- `failed_days`: Array of failed day numbers
- `current_day`: Current day of November
- `updated_at`: Timestamp

## Leaderboard Ranking

Users are ranked by:
1. **Lowest failed count** (primary)
2. **Highest current streak** (secondary)
3. **Username alphabetically** (tiebreaker)

The app stores data in localStorage with the following structure:

```json
{
  "failedDays": [5, 12, 23],
  "currentDay": 15,
  "lastUpdated": "2025-11-15T12:34:56.789Z"
}
```

## License

MIT

