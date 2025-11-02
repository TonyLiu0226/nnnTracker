# No-Nut November Tracker

A modern, interactive React application to track your No-Nut November progress throughout the month.

## Features

- 📅 **30 Day Calendar**: Visual representation of all 30 days of November
- 🟢 **Automatic Success Tracking**: Days automatically turn green when no log is recorded
- 📊 **Real-time Statistics**: Track success days, current streak, and failed days
- 💾 **Persistent Storage**: Data is saved locally using localStorage
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations
- 📱 **Responsive Design**: Works great on desktop and mobile devices

## How to Use

1. **View Progress**: The calendar displays all 30 days of November
2. **Toggle Status**: Click any day tile to toggle between success (green) and failed (red)
3. **Track Stats**: View your success days, current streak, and failed days at the top
4. **Reset Data**: Use the reset button to clear all data and start fresh

## Color Coding

- 🟢 **Green**: Success - No masturbation logged for this day
- 🔴 **Red**: Failed - Masturbation was logged for this day
- ⚪ **White**: Future days that haven't occurred yet
- 🔵 **Blue Border**: Current day of the month

## Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Future Enhancements

This app is designed to be extensible for future features:

- 👥 Friend tracking and leaderboards
- 📝 Detailed logging with notes
- 🏆 Achievement system
- 📈 Historical data and yearly comparisons
- 🔔 Daily reminders and notifications
- 🌐 Social sharing features

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

This structure is designed to be easily extensible for future features like:
- User profiles
- Streak history
- Friend data
- Detailed logs with timestamps

## License

MIT

