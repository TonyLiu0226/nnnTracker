import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import Auth from './components/Auth'
import Tracker from './components/Tracker'
import Leaderboard from './components/Leaderboard'
import './App.css'

function App() {
  const { user, loading } = useAuth()
  const [currentView, setCurrentView] = useState('tracker')

  if (loading) {
    return (
      <div className="app-container">
        <div style={{ 
          textAlign: 'center', 
          color: 'white', 
          fontSize: '1.5rem', 
          padding: '2rem' 
        }}>
          Loading...
        </div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return currentView === 'tracker' ? (
    <Tracker onNavigateToLeaderboard={() => setCurrentView('leaderboard')} />
  ) : (
    <Leaderboard onBack={() => setCurrentView('tracker')} />
  )
}

export default App

