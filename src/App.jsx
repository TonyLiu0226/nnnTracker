import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // State to track which days have failed (logged masturbation)
  const [failedDays, setFailedDays] = useState(new Set())
  const [currentDay, setCurrentDay] = useState(1)

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nnnTracker')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setFailedDays(new Set(data.failedDays || []))
        setCurrentDay(data.currentDay || getCurrentDayOfNovember())
      } catch (e) {
        console.error('Error loading saved data:', e)
      }
    } else {
      setCurrentDay(getCurrentDayOfNovember())
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data = {
      failedDays: Array.from(failedDays),
      currentDay: currentDay,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('nnnTracker', JSON.stringify(data))
  }, [failedDays, currentDay])

  // Function to get current day of November (1-30)
  function getCurrentDayOfNovember() {
    const now = new Date()
    const month = now.getMonth() // 0-indexed, so November is 10
    const day = now.getDate()
    
    if (month === 10) { // November
      return Math.min(day, 30)
    }
    return 1 // Default to day 1 if not November
  }

  // Toggle a day's status
  const toggleDay = (day) => {
    const newFailedDays = new Set(failedDays)
    if (newFailedDays.has(day)) {
      newFailedDays.delete(day)
    } else {
      newFailedDays.add(day)
    }
    setFailedDays(newFailedDays)
  }

  // Calculate statistics
  const totalDays = 30
  const failedCount = failedDays.size
  const currentStreak = calculateCurrentStreak()

  function calculateCurrentStreak() {
    let streak = 0
    for (let i = 1; i <= currentDay; i++) {
      if (!failedDays.has(i)) {
        streak++
      } else {
        streak = 0
      }
    }
    return streak
  }

  // Reset all data
  const resetTracker = () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      setFailedDays(new Set())
      setCurrentDay(getCurrentDayOfNovember())
    }
  }

  // Get day status for styling
  const getDayStatus = (day) => {
    if (failedDays.has(day)) return 'failed'
    if (day <= currentDay) return 'success'
    return 'pending'
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>🍂 No-Nut November Tracker</h1>
        <p>Track your progress through the month</p>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{failedDays.size}</div>
          <div className="stat-label">Number of goons</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalDays - currentDay}</div>
          <div className="stat-label">Days to go</div>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-grid">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className={`day-tile ${getDayStatus(day)} ${day === currentDay ? 'current' : ''}`}
              onClick={() => toggleDay(day)}
              title={`Day ${day} - Click to toggle`}
            >
              <div className="day-number">{day}</div>
              <div className="day-status">
                {failedDays.has(day) ? '❌' : day <= currentDay ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="controls">
          <button className="reset-button" onClick={resetTracker}>
            Reset Tracker
          </button>
        </div>
      </div>

      <div className="instructions">
        <p>🟢 Green = Success (no log) | 🔴 Red = Failed (logged) | ⚪ White = Future days</p>
        <p>Click any day to toggle its status</p>
      </div>
    </div>
  )
}

export default App

