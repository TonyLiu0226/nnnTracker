import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import '../App.css'

function Tracker({ onNavigateToLeaderboard }) {
  const { user, userProfile, signOut } = useAuth()
  const [failedDays, setFailedDays] = useState(new Set())
  const [currentDay, setCurrentDay] = useState(1)
  const [loading, setLoading] = useState(true)

  // Load data from Supabase on mount
  useEffect(() => {
    loadUserData()
  }, [user])

  // Save data to Supabase whenever it changes
  useEffect(() => {
    if (!loading && user) {
      saveUserData()
    }
  }, [failedDays, currentDay])

  async function loadUserData() {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('tracker_data')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is fine for first-time users
        throw error
      }

      if (data) {
        setFailedDays(new Set(data.failed_days || []))
        setCurrentDay(data.current_day || getCurrentDayOfNovember())
      } else {
        setCurrentDay(getCurrentDayOfNovember())
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Fall back to localStorage if Supabase fails
      const saved = localStorage.getItem(`nnnTracker_${user.id}`)
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
    } finally {
      setLoading(false)
    }
  }

  async function saveUserData() {
    if (!user) return

    const now = new Date()
    const data = {
      user_id: user.id,
      failed_days: Array.from(failedDays),
      current_day: currentDay,
      year: now.getFullYear(),
      updated_at: now.toISOString()
    }

    try {
      const { error } = await supabase
        .from('tracker_data')
        .upsert(data, { onConflict: 'user_id' })

      if (error) throw error

      // Also save to localStorage as backup
      localStorage.setItem(`nnnTracker_${user.id}`, JSON.stringify({
        failedDays: Array.from(failedDays),
        currentDay: currentDay,
        lastUpdated: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error saving data:', error)
      // Fall back to localStorage only
      localStorage.setItem(`nnnTracker_${user.id}`, JSON.stringify({
        failedDays: Array.from(failedDays),
        currentDay: currentDay,
        lastUpdated: new Date().toISOString()
      }))
    }
  }

  function getCurrentDayOfNovember() {
    if (!isItNovember()) {
      return 1
    }
    return Math.min(new Date().getDate(), 30)
  }

  function isItNovember() {
    const now = new Date()
    const month = now.getMonth()
    
    if (month === 10) {
      return true
    }
    return false
  }

  const toggleDay = (day) => {
    const newFailedDays = new Set(failedDays)
    if (newFailedDays.has(day)) {
      newFailedDays.delete(day)
    } else {
      newFailedDays.add(day)
    }
    setFailedDays(newFailedDays)
  }

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

  const resetTracker = async () => {
    if (window.confirm('Are you sure you want to reset all data?')) {
      setFailedDays(new Set())
      setCurrentDay(getCurrentDayOfNovember())
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getDayStatus = (day) => {
    if (failedDays.has(day)) return 'failed'
    if (day <= currentDay) return 'success'
    return 'pending'
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner">Loading your data...</div>
      </div>
    )
  }

  if (!isItNovember()) {
    return (
      <div className="app-container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '4rem' }}>🍂</div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Come Back in November</h1>
          <p style={{ opacity: 0.9, maxWidth: '400px', fontSize: '0.8rem' }}>
            The No-Nut November Tracker is only available during the month of November. See you then!
          </p>
          <button
            onClick={handleSignOut}
            style={{
              marginTop: '1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              fontWeight: '600'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            👤 {userProfile?.username || user?.email}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={onNavigateToLeaderboard}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                fontWeight: '600'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              🏆 Leaderboard
            </button>
            <button 
              onClick={handleSignOut}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              Sign Out
            </button>
          </div>
        </div>
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

export default Tracker

