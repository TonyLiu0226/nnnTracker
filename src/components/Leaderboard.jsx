import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabaseClient'
import './Leaderboard.css'

function Leaderboard({ onBack }) {
  const { user, signOut } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  async function loadLeaderboard() {
    setLoading(true)
    setError(null)

    try {
      // Fetch all user profiles and their tracker data
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')

      if (profileError) throw profileError

      const { data: trackerData, error: trackerError } = await supabase
        .from('tracker_data')
        .select('*')

      if (trackerError) throw trackerError

      // Combine the data
      const combined = profiles.map(profile => {
        const tracker = trackerData.find(t => t.user_id === profile.user_id) || {
          failed_days: [],
          current_day: 1
        }

        const failedCount = tracker.failed_days?.length || 0
        const currentDay = tracker.current_day || 1
        
        // Calculate current streak
        let streak = 0
        const failedSet = new Set(tracker.failed_days || [])
        for (let i = 1; i <= currentDay; i++) {
          if (!failedSet.has(i)) {
            streak++
          } else {
            streak = 0
          }
        }

        return {
          username: profile.username,
          user_id: profile.user_id,
          failedCount,
          currentDay,
          streak,
          successDays: currentDay - failedCount
        }
      })

      // Sort by: 1) Lowest failed count, 2) Highest streak, 3) Username
      combined.sort((a, b) => {
        if (a.failedCount !== b.failedCount) {
          return a.failedCount - b.failedCount
        }
        if (a.streak !== b.streak) {
          return b.streak - a.streak
        }
        return a.username.localeCompare(b.username)
      })

      setLeaderboardData(combined)
    } catch (err) {
      console.error('Error loading leaderboard:', err)
      setError('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner">Loading leaderboard...</div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-nav">
          <button 
            onClick={onBack}
            className="nav-button"
          >
            ← Back to Tracker
          </button>
          <button 
            onClick={handleSignOut}
            className="nav-button"
          >
            Sign Out
          </button>
        </div>
        <h1>🏆 Leaderboard</h1>
        <p>See how everyone is doing this November</p>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={loadLeaderboard}>Retry</button>
        </div>
      )}

      <div className="leaderboard-container">
        {leaderboardData.length === 0 ? (
          <div className="empty-state">
            <p>No participants yet. Be the first!</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {leaderboardData.map((entry, index) => (
              <div 
                key={entry.user_id} 
                className={`leaderboard-item ${entry.user_id === user?.id ? 'current-user' : ''} ${index < 3 ? 'top-three' : ''}`}
              >
                <div className="rank">
                  {getRankEmoji(index)}
                </div>
                <div className="user-info">
                  <div className="username">
                    {entry.username}
                    {entry.user_id === user?.id && <span className="you-badge">You</span>}
                  </div>
                  <div className="user-stats">
                    <span className="stat">
                      <span className="stat-icon">🔥</span>
                      {entry.streak} day streak
                    </span>
                    <span className="stat">
                      <span className="stat-icon">✅</span>
                      {entry.successDays} success
                    </span>
                    <span className="stat">
                      <span className="stat-icon">❌</span>
                      {entry.failedCount} goons
                    </span>
                  </div>
                </div>
                <div className="progress-indicator">
                  <div className="progress-circle">
                    <svg width="60" height="60">
                      <circle
                        cx="30"
                        cy="30"
                        r="25"
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="5"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="25"
                        fill="none"
                        stroke={entry.failedCount === 0 ? '#38ef7d' : entry.failedCount <= 3 ? '#ffd700' : '#ff6a00'}
                        strokeWidth="5"
                        strokeDasharray={`${((entry.currentDay - entry.failedCount) / entry.currentDay) * 157} 157`}
                        transform="rotate(-90 30 30)"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="progress-text">
                      {Math.round(((entry.currentDay - entry.failedCount) / entry.currentDay) * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="controls">
        <button className="reset-button" onClick={loadLeaderboard}>
          🔄 Refresh
        </button>
      </div>
    </div>
  )
}

export default Leaderboard

