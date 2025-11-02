# No-Nut November Tracker

A modern, interactive React application to track your No-Nut November progress throughout the month.

## Features

- 📅 **30 Day Calendar**: Visual representation of all 30 days of November
- 🟢 **Automatic Success Tracking**: Days automatically turn green when no log is recorded
- 📊 **Real-time Statistics**: Track goon count, current streak, and days remaining


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
2. Get your project URL and anon key
3. Create a `.env` file with your credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. Run the SQL schema in Supabase SQL Editor (see SUPABASE_SETUP.md)

### 3. Start Development Server

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## How to Use

1. **Sign Up/Sign In**: Create an account or log in with your email and password
2. **View Progress**: The calendar displays all 30 days of November
3. **Toggle Status**: Click any day tile to toggle between success (green) and failed (red)
4. **Track Stats**: View your goon count, current streak, and days remaining
5. **Data Sync**: Your progress is automatically saved to the cloud
6. **Sign Out**: Click the sign out button to log out

## Color Coding

- 🟢 **Green**: Success - No log recorded for this day
- 🔴 **Red**: Failed - Log recorded for this day
- ⚪ **White**: Future days that haven't occurred yet
- 🔵 **Blue Border**: Current day of the month

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **LocalStorage**: Client-side data persistence
- **CSS3**: Custom styling with gradients and animations

## Data Structure

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

